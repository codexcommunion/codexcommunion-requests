import { Message } from "../../types";
import { IconArrowUp } from "@tabler/icons-react";
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  onSend: (message: Message) => void;
}

export const ChatInput: FC<Props> = ({ onSend }) => {
  const [content, setContent] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > 4000) {
      alert("Message limit is 4000 characters");
      return;
    }

    setContent(value);
  };

  const handleSend = () => {
    if (!content.trim()) {
      alert("Please enter a message");
      return;
    }
    onSend({ id: uuidv4(), type: "human", content: content.trim() });
    setContent("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    // if (textareaRef.current) {
    //   textareaRef.current.style.height = "inherit";
    //   textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    // }
  }, [content]);

  return (
    <div className="relative h-full">
      <textarea
        ref={textareaRef}
        className="h-full w-full rounded-lg pl-4 pr-12 py-2 focus:outline-none focus:ring-1 focus:ring-neutral-300 border-2 border-neutral-200 resize-none"
        placeholder="I have an idea to..."
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-blue-500 text-white hover:opacity-80"
      >
        <IconArrowUp className="h-6 w-6" />
      </button>
    </div>
  );
};
