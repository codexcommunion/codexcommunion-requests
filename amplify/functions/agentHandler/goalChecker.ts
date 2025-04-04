import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { MessageContent } from "@langchain/core/messages";
import { normalizeAIContent } from "./messages";
import { ControlMessage } from "./controlMessage";
import { goalCheckPrompt } from "./prompts/goalCheckPrompt";
import { classifierLlm } from "./llm";
import { stringifyMessage } from "./messages";

interface GoalSignalPayload {
  goalAchieved: true;
  issueUrl?: string;
}

const LOOKBACK_COUNT = 5
const CONVERSATION_CLOSER = "goodbye";

async function fallbackGoalAnalysis(messages: (HumanMessage | AIMessage | SystemMessage | ToolMessage)[]): Promise<{ goalAchieved: boolean, needsMoreInfo?: boolean, nextMessageText?: string }> {

  const serializedMessages = [...messages.slice(-1 * LOOKBACK_COUNT)].map(stringifyMessage).join("\n");
  const response = await classifierLlm.invoke([
      new HumanMessage(goalCheckPrompt(serializedMessages)),
    ]);

  try {
    const responseContent = typeof response.content === "string" ? response.content.trim() : "";
    console.log(responseContent);
    const parsed = JSON.parse(responseContent);
      // {
      //   "goalAchieved": true | false,
      //   "needsMoreInfo": true | false,
      //   "nextMessage": "..." // suggestion for next AI response
      // }
    return {
      goalAchieved: parsed.goalAchieved === true,
      needsMoreInfo: parsed.needsMoreInfo === true,
      nextMessageText: parsed.nextMessage ?? "",
    };
  } catch (err) {
    console.warn("GoalCheck fallback failed to parse LLM response:", response.content);
    return { goalAchieved: false };
  }
}

export async function runGoalCheck(
  messages: (HumanMessage | AIMessage | SystemMessage | ToolMessage)[]
): Promise<{ goalAchieved: boolean; controlMessage?: ControlMessage, needsMoreInfo?: boolean, nextMessageText?: string }> {

  if( messages.length <= 3){
    //early abort, no way it's done yet
    return { goalAchieved: false };
  }

  const reversed = [...messages].reverse();
  const lastAiMessage = reversed.find((m): m is AIMessage => m instanceof AIMessage);

  if (!lastAiMessage) {
    console.warn("runGoalCheck: No AI message found.");
    return { goalAchieved: false };
  }

  const rawText = normalizeAIContent(lastAiMessage.content as MessageContent);

  const jsonMatches = rawText.match(/\{[\s\S]*?\}/g);
  const lastJsonCandidate = jsonMatches?.[jsonMatches.length - 1];

  if (!lastJsonCandidate) {
    //use the fallback check to see the progress of the conversation so far
    const fallbackResult = await fallbackGoalAnalysis(messages);
    if (fallbackResult.goalAchieved){
      return {
        goalAchieved: true,
        controlMessage: new ControlMessage({
          content: CONVERSATION_CLOSER
        }),
      };
    }
    else{
      return fallbackResult;
    }
  }

  try {
    const parsed = JSON.parse(lastJsonCandidate) as GoalSignalPayload;

    if (parsed.goalAchieved === true) {
      const issueUrl = parsed.issueUrl ?? "";
      return {
        goalAchieved: true,
        controlMessage: new ControlMessage({
          content: CONVERSATION_CLOSER
        }),
      };
    }
    else{
      return { goalAchieved: false };
    }

  } catch (err) {
    console.warn("runGoalCheck: JSON parsing failed:", lastJsonCandidate, err);

    // fallback if structured JSON failed
    const fallbackResult = await fallbackGoalAnalysis(messages);
    if (fallbackResult.goalAchieved) {
      return {
        goalAchieved: true,
        controlMessage: new ControlMessage({
          content: CONVERSATION_CLOSER
        }),
      };
    } else {
      return fallbackResult;
    }
  }
}
