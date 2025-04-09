// src/hooks/useChatAgent.ts
import { useState, useRef, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { Message } from "../types";

export function useChatAgent() {
  const [history, setHistory] = useState<Message[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [goalAchieved, setGoalAchieved] = useState(false);


  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages]);

  const handleSend = async (message: Message) => {
    const newVisibleMessages = [...visibleMessages, message];
    setVisibleMessages(newVisibleMessages);
    setLoading(true);

    try {
      const client = generateClient<Schema>({
        authMode: 'userPool'
      });
      const { data, errors } = await client.mutations.runAgent({
        input: message.content,
        history: history,
      });

      if (errors || !data) throw new Error("Error in runAgent mutation");

      const updatedFullHistory = data.messages as Message[];

      const lastMessage = updatedFullHistory[updatedFullHistory.length - 1];

      // Filter out the "goodbye" control message before updating visible history
      let cleanedHistory = updatedFullHistory;

      if (lastMessage?.type === "generic" && lastMessage?.content === "goodbye") {
        setGoalAchieved(true);

        // Remove the goodbye message from the history
        cleanedHistory = updatedFullHistory.slice(0, -1);
      }

      setHistory(cleanedHistory);

      setVisibleMessages(
        updatedFullHistory.filter(
          (m) => m.type === "ai" || m.type === "human"
        )
      );





    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHistory([]);
    setVisibleMessages([]);
    setGoalAchieved(false);
  };

  return {
    history,
    visibleMessages,
    loading,
    handleSend,
    handleReset,
    chatEndRef,
    goalAchieved,
    setGoalAchieved
  };
}
