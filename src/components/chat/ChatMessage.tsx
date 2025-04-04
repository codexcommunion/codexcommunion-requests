import { Message } from "../../types";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import type { Components } from "react-markdown";

const linkRenderer: Components = {
  a: ({ node, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline hover:opacity-80"
    />
  ),
};


function ThinkingBlock({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-2 text-sm text-gray-600">
      <button
        className="text-blue-500 underline"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Hide AI Thinking" : "Show AI Thinking"}
      </button>
      {expanded && (
        <div className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded">
          <ReactMarkdown components={linkRenderer}>
            {text}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
export function ChatMessage({ message }: { message: Message }) {
  const isAI = message.type === "ai";

  let rawContent = message.content;
  try {
    const parsed = JSON.parse(rawContent);
    if (Array.isArray(parsed) && parsed.every((p) => typeof p?.text === "string")) {
      rawContent = parsed.map((p) => p.text).join("\n");
    }
  } catch {
    // Leave rawContent as-is
  }

  const thinkingMatches = [...rawContent.matchAll(/<thinking>([\s\S]*?)<\/thinking>/g)];
  const thinkingBlocks = thinkingMatches.map((m) => m[1]?.trim()).filter(Boolean);
  const strippedContent = rawContent
    .replace(/<thinking>[\s\S]*?<\/thinking>/g, "")
    .replace(/<\/?[\w:-]+>/g, "")
    .trim();

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`w-full max-w-[80%] ${
          !isAI ? "rounded-2xl px-4 py-2 bg-blue-500 text-white whitespace-pre-wrap" : ""
        }`}
      >
        {isAI ? (
          <div className="prose prose-lg sm:prose-base prose-neutral dark:prose-invert">
            {thinkingBlocks.map((text, i) => (
              <ThinkingBlock key={i} text={text} />
            ))}
            <ReactMarkdown components={linkRenderer}>{strippedContent}</ReactMarkdown>
          </div>
        ) : (
          // non-AI messages (human/tool/etc) with no prose styling
          <div className="whitespace-pre-wrap">
            <ReactMarkdown components={linkRenderer}>{strippedContent}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
