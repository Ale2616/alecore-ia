import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

/**
 * MarkdownRenderer - Renderiza markdown con soporte para GFM y bloques de código
 */
const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  return (
    <div className="markdown-content text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks → custom CodeBlock component
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');

            if (!inline && (match || String(children).includes('\n'))) {
              return (
                <CodeBlock language={match ? match[1] : undefined}>
                  {children}
                </CodeBlock>
              );
            }

            // Inline code
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },

          // Links open in new tab
          a({ children, href, ...props }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            );
          },

          // Paragraphs
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },

          // Lists
          ul({ children }) {
            return <ul className="mb-2 pl-5 space-y-1 list-disc">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="mb-2 pl-5 space-y-1 list-decimal">{children}</ol>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
