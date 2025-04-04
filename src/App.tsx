import { useRef } from "react";
import { Chat } from "./components/chat/Chat";
import { ChatInput } from "./components/chat/ChatInput";
import HeroSection from "./components/HeroSection";
import { useChatAgent } from "./hooks/useChatAgent";
import { ResetChat } from "./components/chat/ResetChat";

type AppProps = {
  showInstructions: boolean;
  onHideInstructions: () => void;
};


export default function App({ showInstructions, onHideInstructions }: AppProps) {
  const {
    visibleMessages,
    loading,
    handleSend,
    handleReset,
    chatEndRef,
    goalAchieved,
    setGoalAchieved
  } = useChatAgent();

  const chatSectionRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    onHideInstructions();
    setTimeout(() => {
      chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };



  return (
    <>
      {showInstructions && <HeroSection onStart={handleStart} />}

      <div
        ref={chatSectionRef}
        className={`flex-1 transition-all duration-700 ease-in-out transform ${
          showInstructions
            ? "translate-y-10 opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 min-h-[70vh]">
          <div className="max-w-3xl mx-auto">
            <Chat messages={visibleMessages} loading={loading} />
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="flex-1 max-w-3xl mx-auto">
          {!goalAchieved ? (
            <div className="flex flex-row gap-3 items-stretch min-h-[60px]">
              <div className="h-full">
                <ResetChat onReset={handleReset} />
              </div>
              <div className="flex-1 h-full">
                <ChatInput onSend={handleSend} />
              </div>
            </div>
          
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <button
                onClick={handleReset}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded shadow"
              >
                Submit another idea
              </button>
              <button
                onClick={() => setGoalAchieved(false)}
                className="bg-neutral-100 hover:bg-neutral-200 text-black font-medium px-4 py-2 rounded border border-neutral-300"
              >
                Wait… I’m not done with the previous one yet
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
