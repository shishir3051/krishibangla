/**
 * ChatMarkdown — renders an AI reply as markdown. Raw HTML in the text is skipped (no rehype-raw),
 * and react-markdown's default urlTransform strips unsafe link protocols such as javascript:.
 */
import Markdown, { type Components } from 'react-markdown';

const heading: Components['h1'] = ({ children }) => <p className="mt-3 mb-1 font-semibold text-brand">{children}</p>;

const components: Components = {
  h1: heading,
  h2: heading,
  h3: heading,
  h4: heading,
  h5: heading,
  h6: heading,
  p: ({ children }) => <p className="my-1.5">{children}</p>,
  ul: ({ children }) => <ul className="my-1.5 list-disc space-y-0.5 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-1.5 list-decimal space-y-0.5 pl-5">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-2">
      {children}
    </a>
  ),
  blockquote: ({ children }) => <blockquote className="my-2 border-l-2 border-line pl-3 text-fg-muted">{children}</blockquote>,
  code: ({ children }) => <code className="rounded bg-surface px-1 py-0.5 text-[0.9em]">{children}</code>,
  pre: ({ children }) => <pre className="my-2 overflow-x-auto rounded-lg bg-surface p-3 text-xs">{children}</pre>,
  hr: () => <hr className="my-3 border-line" />,
  img: () => null,
};

export function ChatMarkdown({ text }: { text: string }) {
  return (
    <div className="break-words [&>:first-child]:mt-0 [&>:last-child]:mb-0">
      <Markdown components={components} skipHtml>
        {text}
      </Markdown>
    </div>
  );
}
