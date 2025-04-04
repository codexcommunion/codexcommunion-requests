import { HumanMessage, AIMessage, SystemMessage, ToolMessage, MessageContent } from "@langchain/core/messages";

export function stringifyMessage(msg: AIMessage | HumanMessage | SystemMessage | ToolMessage): string {
  const role = msg._getType().toUpperCase();
  const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
  if (msg instanceof ToolMessage && msg.tool_call_id) {
    return `${role} [${msg.tool_call_id}]: ${content}`;
  }
  return `${role}: ${content}`;
}

export function normalizeAIContent(
  content: MessageContent,
  stripGoalJson: boolean = false
): string {
  let text = "";

  if (Array.isArray(content)) {
    text = content
      .filter(
        (c): c is { type: "text"; text: string } =>
          typeof c === "object" &&
          c.type === "text" &&
          typeof c.text === "string"
      )
      .map((c) => c.text)
      .join("\n")
      .trim();
  } else if (typeof content === "string") {
    text = content.trim();
  }

  if (stripGoalJson) {
    const jsonMatches = text.match(/\{[\s\S]*?"goalAchieved"\s*:\s*true[\s\S]*?\}/g);
    const lastJson = jsonMatches?.[jsonMatches.length - 1];

    if (lastJson) {
      text = text.replace(lastJson, "").trim();
    }
  }

  return text;
}


export function toAllowedType(type: string): "human" | "ai" | "system" | "tool" | "generic" {
  switch (type) {
    case "human":
    case "ai":
    case "system":
    case "tool":
    case "generic":
      return type;
    default:
      return "system";
  }
}