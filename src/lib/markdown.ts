const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatInline = (value: string) => {
  let formatted = escapeHtml(value);

  formatted = formatted.replace(/`([^`]+)`/g, "<code>$1</code>");
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  formatted = formatted.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) =>
    `<img src="${src}" alt="${alt}" loading="lazy" />`
  );
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  return formatted;
};

export const markdownToHtml = (markdown: string) => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const htmlParts: string[] = [];

  let inUl = false;
  let inOl = false;
  let inBlockquote = false;
  let paragraphBuffer: string[] = [];

  const closeParagraph = () => {
    if (paragraphBuffer.length) {
      htmlParts.push(`<p>${formatInline(paragraphBuffer.join(" "))}</p>`);
      paragraphBuffer = [];
    }
  };

  const closeLists = () => {
    if (inUl) {
      htmlParts.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      htmlParts.push("</ol>");
      inOl = false;
    }
  };

  const closeBlockquote = () => {
    if (inBlockquote) {
      htmlParts.push("</blockquote>");
      inBlockquote = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trimEnd();
    const pure = trimmed.trim();

    if (!pure) {
      closeParagraph();
      closeLists();
      closeBlockquote();
      return;
    }

    if (/^---+$/.test(pure)) {
      closeParagraph();
      closeLists();
      closeBlockquote();
      htmlParts.push("<hr />");
      return;
    }

    const headingMatch = pure.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      closeParagraph();
      closeLists();
      closeBlockquote();
      htmlParts.push(`<h${level}>${formatInline(text)}</h${level}>`);
      return;
    }

    const orderedMatch = pure.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      closeParagraph();
      closeBlockquote();
      if (!inOl) {
        closeLists();
        htmlParts.push("<ol>");
        inOl = true;
      }
      htmlParts.push(`<li>${formatInline(orderedMatch[1])}</li>`);
      return;
    }

    const unorderedMatch = pure.match(/^[-*+]\s+(.*)$/);
    if (unorderedMatch) {
      closeParagraph();
      closeBlockquote();
      if (!inUl) {
        closeLists();
        htmlParts.push("<ul>");
        inUl = true;
      }
      htmlParts.push(`<li>${formatInline(unorderedMatch[1])}</li>`);
      return;
    }

    const blockquoteMatch = pure.match(/^>\s?(.*)$/);
    if (blockquoteMatch) {
      closeParagraph();
      closeLists();
      if (!inBlockquote) {
        htmlParts.push("<blockquote>");
        inBlockquote = true;
      }
      htmlParts.push(`<p>${formatInline(blockquoteMatch[1])}</p>`);
      return;
    }

    const imageMatch = pure.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      closeParagraph();
      closeLists();
      closeBlockquote();
      htmlParts.push(
        `<figure><img src="${imageMatch[2]}" alt="${escapeHtml(imageMatch[1])}" loading="lazy" /></figure>`
      );
      return;
    }

    paragraphBuffer.push(pure);
  });

  closeParagraph();
  closeLists();
  closeBlockquote();

  return htmlParts.join("\n");
};

export const getExcerpt = (html: string, wordLimit = 40) => {
  const stripped = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = stripped.split(" ");
  if (words.length <= wordLimit) return stripped;
  return `${words.slice(0, wordLimit).join(" ")}...`;
};
