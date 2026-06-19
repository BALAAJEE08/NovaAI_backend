import { Check, Clipboard } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

export const MarkdownMessage = ({ content }) => (
  <div className="prose prose-slate max-w-none dark:prose-invert prose-pre:p-0 prose-pre:bg-transparent">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const code = String(children).replace(/\n$/, "");
          if (inline) {
            return <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800" {...props}>{children}</code>;
          }
          return <CodeBlock language={match?.[1] || "text"} code={code} />;
        }
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

const CodeBlock = ({ language, code }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-white/10 bg-slate-950">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-slate-300">
        <span>{language}</span>
        <button className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 hover:bg-white/15" type="button" onClick={copy}>
          {copied ? <Check className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter language={language} style={oneDark} customStyle={{ margin: 0, background: "transparent" }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
