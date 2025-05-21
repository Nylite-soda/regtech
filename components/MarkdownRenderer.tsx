// components/MarkdownRenderer.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // import syntax highlighting style

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose rounded-r-lg prose-lg mx-auto max-w-3xl p-6 font-sans text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} className="text-[#AD0000] hover:underline" />
          ),
          code({
            inline,
            className,
            children,
            ...props
          }: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) {
            if (inline) {
              return (
                <code
                  className="bg-gray-200 rounded px-1 py-[0.15rem] font-mono text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre
                className="bg-gray-900 text-white rounded p-4 overflow-x-auto"
                {...props}
              >
                <code className={className}>{children}</code>
              </pre>
            );
          },
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 italic text-gray-600"
              {...props}
            >
              {children}
            </blockquote>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto">
              <table
                className="table-auto border-collapse border border-gray-300"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border border-gray-300 bg-gray-100 px-4 py-2"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-gray-300 px-4 py-2" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content || "No Description Yet"}
      </ReactMarkdown>
    </div>
  );
}
