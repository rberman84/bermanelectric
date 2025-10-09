import { useMemo } from "react";
import clsx from "clsx";

type MarkdownRendererProps = {
  markdown: string;
  className?: string;
};

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[]; start?: number }
  | { type: "blockquote"; text: string };

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderInlineHtml = (value: string) => {
  const escaped = escapeHtml(value);

  const withCode = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
  const withStrong = withCode.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  const withEmphasis = withStrong.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  const withLinks = withEmphasis.replace(
    /\[([^\]]+)\]\((https?:\/\/[^(\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  return withLinks;
};

const renderBlock = (block: Block, index: number) => {
  if (block.type === "heading") {
    const Tag = `h${block.level}` as const;
    return (
      <Tag key={index} className="font-semibold">
        <span dangerouslySetInnerHTML={{ __html: renderInlineHtml(block.text) }} />
      </Tag>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p key={index}>
        <span dangerouslySetInnerHTML={{ __html: renderInlineHtml(block.text) }} />
      </p>
    );
  }

  if (block.type === "blockquote") {
    return (
      <blockquote key={index}>
        <span dangerouslySetInnerHTML={{ __html: renderInlineHtml(block.text) }} />
      </blockquote>
    );
  }

  if (block.ordered) {
    return (
      <ol key={index} start={block.start}>
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>
            <span dangerouslySetInnerHTML={{ __html: renderInlineHtml(item) }} />
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ul key={index}>
      {block.items.map((item, itemIndex) => (
        <li key={itemIndex}>
          <span dangerouslySetInnerHTML={{ __html: renderInlineHtml(item) }} />
        </li>
      ))}
    </ul>
  );
};

const normaliseBlocks = (markdown: string): Block[] => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  let paragraphBuffer: string[] = [];
  let listBuffer: { ordered: boolean; items: string[]; start?: number } | null = null;
  let blockquoteBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      blocks.push({ type: "paragraph", text: paragraphBuffer.join(" ").trim() });
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (listBuffer && listBuffer.items.length > 0) {
      blocks.push({ type: "list", ordered: listBuffer.ordered, items: listBuffer.items, start: listBuffer.start });
    }
    listBuffer = null;
  };

  const flushBlockquote = () => {
    if (blockquoteBuffer.length > 0) {
      blocks.push({ type: "blockquote", text: blockquoteBuffer.join(" ").trim() });
      blockquoteBuffer = [];
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushBlockquote();
      return;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();

      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      return;
    }

    const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      flushBlockquote();

      if (!listBuffer || !listBuffer.ordered) {
        flushList();
        listBuffer = { ordered: true, items: [], start: Number(orderedMatch[1]) };
      }

      listBuffer.items.push(orderedMatch[2].trim());
      return;
    }

    const bulletMatch = line.match(/^[-*+]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      flushBlockquote();

      if (!listBuffer || listBuffer.ordered) {
        flushList();
        listBuffer = { ordered: false, items: [] };
      }

      listBuffer.items.push(bulletMatch[1].trim());
      return;
    }

    if (line.startsWith(">")) {
      flushParagraph();
      flushList();
      blockquoteBuffer.push(line.replace(/^>\s?/, "").trim());
      return;
    }

    if (listBuffer) {
      flushList();
    }

    if (blockquoteBuffer.length > 0) {
      flushBlockquote();
    }

    paragraphBuffer.push(line.trim());
  });

  flushParagraph();
  flushList();
  flushBlockquote();

  return blocks;
};

const MarkdownRenderer = ({ markdown, className }: MarkdownRendererProps) => {
  const elements = useMemo(() => normaliseBlocks(markdown), [markdown]);

  return (
    <div className={clsx("prose prose-neutral max-w-none", className)}>
      {elements.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default MarkdownRenderer;
