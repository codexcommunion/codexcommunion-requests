import { HumanMessage, AIMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { classificationPrompt } from "./prompts/classificationPrompt";
import { classifierLlm } from "./llm";
import { stringifyMessage } from "./messages";

export type UserIntent = "on_topic" | "neutral" | "off_topic";
const validLabels: UserIntent[] = ["on_topic", "neutral", "off_topic"];

const LOOKBACK_COUNT = 3

export async function classifyInputIntent(
  history: (AIMessage | HumanMessage | SystemMessage | ToolMessage)[],
  currentInput: string
): Promise<UserIntent> {
  const messageObjects = [...history.slice(-1 * LOOKBACK_COUNT), new HumanMessage(currentInput)];
  const chatForClassifier = messageObjects.map(stringifyMessage).join("\n");

  const result = await classifierLlm.invoke([
    new HumanMessage(classificationPrompt(chatForClassifier)),
  ]);

  const label = typeof result.content === "string" ? result.content.trim().toLowerCase() : "";

  return validLabels.includes(label as UserIntent) ? (label as UserIntent) : "on_topic";
}