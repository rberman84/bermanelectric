import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Parse headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h2, h3, h4');
    
    const items: TOCItem[] = Array.from(headings).map((heading) => {
      const text = heading.textContent || '';
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const level = parseInt(heading.tagName.substring(1));
      
      // Add ID to heading for anchor links
      heading.id = id;
      
      return { id, text, level };
    });

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-50px 0px -50px 0px' }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  if (tocItems.length === 0) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="flex items-center gap-2 w-full text-left font-semibold text-gray-900 hover:text-electric-600 transition-colors"
      >
        <List className="w-5 h-5" />
        Table of Contents
        <span className="ml-auto text-sm text-gray-500">
          {isVisible ? '−' : '+'}
        </span>
      </button>
      
      {isVisible && (
        <nav className="mt-4">
          <ul className="space-y-2">
            {tocItems.map((item) => (
              <li
                key={item.id}
                style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
              >
                <a
                  href={`#${item.id}`}
                  className={`block text-sm hover:text-electric-600 transition-colors ${
                    activeId === item.id
                      ? 'text-electric-600 font-medium'
                      : 'text-gray-600'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(item.id);
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default TableOfContents;