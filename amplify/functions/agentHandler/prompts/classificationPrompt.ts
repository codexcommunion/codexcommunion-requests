export function classificationPrompt(history: string): string {
  return `
You are a classifier evaluating the most recent snippet of conversation between a user and an AI assistant.

Here is the recent conversation history:

${history}

Classify the most recent user message using the following labels:

- "on_topic": the user is actively describing an idea, goal, or project they want to pursue, or is trying to move the conversation forward (even if frustrated or vague)
- "neutral": the message is polite, conversational, or filler (e.g., "ok", "thanks", "maybe"), and does not help or hurt the conversation
- "off_topic": the message is clearly unrelated to idea submission, or intentionally disruptive (e.g., spam, asking the assistant personal questions, or being intentionally abusive)

Reply with just one label.
  `.trim();
}
