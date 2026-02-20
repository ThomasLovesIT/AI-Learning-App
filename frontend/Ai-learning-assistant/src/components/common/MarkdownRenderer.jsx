import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="markdown-content text-sm leading-relaxed overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Styling code blocks (syntax highlighting)
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="my-3 rounded-lg overflow-hidden shadow-sm border border-gray-700">
                <div className="bg-gray-800 px-4 py-1.5 text-[10px] text-gray-400 font-mono border-b border-gray-700 flex justify-between items-center">
                  <span>{match[1].toUpperCase()}</span>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.85rem',
                    backgroundColor: '#1e1e1e',
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-xs border border-gray-200" {...props}>
                {children}
              </code>
            );
          },
          // Custom styles for other elements
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 border-b pb-1">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-md font-bold mb-2 mt-2">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-600 my-3">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="bg-gray-50 px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">{children}</th>,
          td: ({ children }) => <td className="px-4 py-2 text-sm border-b border-gray-100">{children}</td>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;