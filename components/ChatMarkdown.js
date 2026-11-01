"use client";
import Markdown from "react-markdown";

/**
 * Renders AI replies as markdown. Raw HTML in the text is never rendered (react-markdown
 * ignores it without rehype-raw), and unsafe link protocols are stripped by its default urlTransform.
 *
 * Imported by: AIChat.js, GenericCropGuide.js
 */
export default function ChatMarkdown({ text, headingClass = "text-green-mid" }) {
  const heading = ({ children }) => <strong className={`block mt-3 mb-1 ${headingClass}`}>{children}</strong>;

  return (
    <div className="chat-content">
      <Markdown
        components={{
          h1: heading,
          h2: heading,
          h3: heading,
          h4: heading,
          h5: heading,
          h6: heading,
          p: ({ children }) => <p className="my-1.5">{children}</p>,
          ul: ({ children }) => <ul className="my-1.5 pl-5 list-disc">{children}</ul>,
          ol: ({ children }) => <ol className="my-1.5 pl-5 list-decimal">{children}</ol>,
          li: ({ children }) => <li className="my-0.5">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="text-left text-[0.85em] border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="border-b px-2 py-1 font-semibold">{children}</th>,
          td: ({ children }) => <td className="border-b px-2 py-1 align-top">{children}</td>,
        }}
      >
        {text}
      </Markdown>
    </div>
  );
}
