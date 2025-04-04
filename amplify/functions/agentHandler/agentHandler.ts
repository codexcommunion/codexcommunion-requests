import type { Schema } from "../../data/resource";
import {
  HumanMessage,
  AIMessage,
  ToolMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { llm } from "./llm";
import { classifyInputIntent, UserIntent } from "./classifier";
import { runGoalCheck } from "./goalChecker";
import { toAllowedType, normalizeAIContent } from "./messages";
import { systemPrompt } from "./prompts/agentSystemPrompt";

import { createIssueTool } from "./tools/createIssueTool";
import { getIssueTool } from "./tools/getIssueTool";
import { listIssuesTool } from "./tools/listIssuesTool";
import { addIssueCommentTool } from "./tools/addIssueCommentTool";
import { searchIssuesTool } from "./tools/searchIssuesTool";

const tools = [
  createIssueTool,
  getIssueTool,
  listIssuesTool,
  addIssueCommentTool,
  searchIssuesTool,
];

const toolMap = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
const llmWithTools = llm.bindTools(tools);

export const handler: Schema["runAgent"]["functionHandler"] = async (
  event,
  context
) => {
  try {
    const input = event.arguments.input;
    const history = event.arguments.history ?? [];

    const validHistory = history.filter(
      (msg): msg is NonNullable<typeof msg> =>
        msg != null && msg.type !== "tool"
    );

    const messages = [
      ...(!validHistory.some((msg) => msg.type === "system")
        ? [new SystemMessage(systemPrompt)]
        : []),
      ...validHistory.map((msg) => {
        const content = msg.content ?? "[missing content]";
        switch (msg.type) {
          case "human":
            return new HumanMessage(content);
          case "ai":
            return new AIMessage(content);
          case "tool":
            return new ToolMessage({
              tool_call_id: msg.tool_call_id ?? "unknown-tool",
              content,
            });
          case "system":
            return new SystemMessage(content);
          default:
            throw new Error(`Unknown or missing message type: ${msg.type}`);
        }
      }),
    ];

    if (!input) throw new Error("Missing input");
    messages.push(new HumanMessage(input));

    const intent: UserIntent = await classifyInputIntent(messages, input);

    let reply: string = "";

    switch (intent) {
      case "off_topic":
        reply = "Sorry, I can only help with capturing new ideas for software/digital products and I'm confused by what you said. You can restart the chat or try to clarify with a new message.";
        break;
      case "on_topic":
      case "neutral":
        reply = "";
        break;
    }


    if (reply === "") {
      while (true) {
        const aiMessage = await llmWithTools.invoke(messages);

        reply = normalizeAIContent(aiMessage.content, true);

        //we will need to put a more user-friendly message without JSON to the history
        messages.push(
          new AIMessage({
            ...aiMessage,
            content: reply, // override just the content
          })
        );

        const toolCalls = aiMessage.tool_calls ?? [];

        if (toolCalls.length === 0) break;

        const toolMessages: ToolMessage[] = [];

        for (const call of toolCalls) {
          const tool = toolMap[call.name];
          if (!tool) continue;

          const toolResult = await tool.invoke(call);
          const toolMessage = new ToolMessage({
            tool_call_id: call.id ?? call.name,
            content: toolResult,
          });

          toolMessages.push(toolMessage);
        }

        messages.push(...toolMessages);
      }

      //we need to check if the LLM thinks the goal has been acheived now:
        // so we can end the conversation in the UI
        // otherwise keep chatting
        const goalResult = await runGoalCheck(messages);
        if (goalResult.goalAchieved && goalResult.controlMessage) {

          //the goal has been acheived, inform the message thread
          messages.push(goalResult.controlMessage);
        }
        else if(goalResult.needsMoreInfo){
          console.debug("goal checker thinks more info needed");
          // if(goalResult.nextMessageText){
          //   messages.push(new AIMessage(goalResult.nextMessageText));
          // }
          // else{
          //   messages.push(new AIMessage("OK, let's continue"));
          // }
        }

    } else {
      messages.push(new AIMessage(reply));
    }

    return {
      reply,
      messages: messages.map((m) => ({
        type: toAllowedType(m._getType()),
        content:
          typeof m.content === "string"
            ? m.content
            : JSON.stringify(m.content),
        ...(m instanceof ToolMessage && m.tool_call_id
          ? { tool_call_id: m.tool_call_id }
          : {}),
      })),
    };
  } catch (err: any) {
    console.error("Unhandled Lambda error", err);
    throw new Error("Unhandled exception in runAgent: " + err?.message);
  }
};
