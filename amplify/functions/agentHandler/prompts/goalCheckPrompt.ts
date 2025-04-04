export const goalCheckPrompt = (messages: string) => `
You are a smart classifier who will assess whether a conversation between a human and another AI assistant has acheived a goal.

Recent conversation history:
${messages}

Evaluate the conversation snippet above. The goal is:
- Understand user's idea.
- Take action using a tool to submit the idea or add comment to an existing idea.
- Provide the user with a link to the created issue, or created comment.

Respond with this JSON:
{
  "goalAchieved": true | false, // only true if the conversation should end now
  "needsMoreInfo": true | false, // if we still need more information from the human to acheive our goal
  "nextMessage": "..." // OPTIONAL suggestion for next AI response (if more info is needed)
}
`.trim();
