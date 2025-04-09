import { useRef, useState, useEffect } from "react";
import { Chat } from "./components/chat/Chat";
import { ChatInput } from "./components/chat/ChatInput";
import HeroSection from "./components/HeroSection";
import { useChatAgent } from "./hooks/useChatAgent";
import { ResetChat } from "./components/chat/ResetChat";
import { Authenticator } from "@aws-amplify/ui-react";
import { Predictions } from "@aws-amplify/predictions";
import './App.css';
import outputs from '../amplify_outputs.json';

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

  const spokenMessageIdRef = useRef<string | null>(null);
  const [audioMode, setAudioMode] = useState(false);

  const handleStart = () => {
    onHideInstructions();
    setTimeout(() => {
      chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const voiceId = outputs.custom?.Predictions?.convert?.speechGenerator?.defaults?.voiceId || "Amy";


  // Function to convert text to speech
  const playAudioForMessage = async (text: string) => {
    try {
      const result = await Predictions.convert({
        textToSpeech: {
          source: {
            text: text,
          },
          voiceId: voiceId, 
          //TODO: investigate this
          // it seems like it's limited currently
          // see https://github.com/aws-amplify/amplify-js/issues/11046
          // 
        },
      });

      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(result.audioStream);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error("Error with text-to-speech conversion:", error);
    }
  };

  // Effect to play audio for new messages
  useEffect(() => {
    if (audioMode && !loading && visibleMessages.length > 0) {

      //need to only use ones with clear text content
      // no "thinking" text
      // otherwise keep popping?
      const lastAIMessage = [...visibleMessages]
        .filter((msg) => msg.type === "ai")
        .pop();

      if (
        lastAIMessage &&
        lastAIMessage.id &&
        lastAIMessage.id !== spokenMessageIdRef.current
      ) {
        spokenMessageIdRef.current = lastAIMessage.id;
        playAudioForMessage(lastAIMessage.content);
      }
    }
  }, [visibleMessages, audioMode, loading]);


  return (
    <>
      {showInstructions && <HeroSection onStart={handleStart} />}

      <Authenticator
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800"
      >
        {({ }) => (
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
                  <div className="h-full flex items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={audioMode}
                        onChange={(e) => setAudioMode(e.target.checked)}
                      />
                      <span>Audio Mode</span>
                    </label>
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
        )}
      </Authenticator>
    </>
  );
}
