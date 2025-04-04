import { Message } from "../../types";
import { ChatMessage } from "./ChatMessage";
import { ChatLoader } from "./ChatLoader";

interface Props {
  messages: Message[];
  loading: boolean;
}

export function Chat({ messages, loading }: Props) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
        </div>
      ))}

      {loading && (
        <div>
          <ChatLoader />
        </div>
      )}
    </div>
  );
}
