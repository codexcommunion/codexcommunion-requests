import { ChatBedrockConverse } from "@langchain/aws";

export const llm = new ChatBedrockConverse({
  model: process.env.BEDROCK_MODEL_ID!,
  region: process.env.BEDROCK_AWS_REGION!,
  temperature: 0.01,
  topP: 0.9,
});

export const classifierLlm = new ChatBedrockConverse({
  model: process.env.BEDROCK_MODEL_ID!,
  region: process.env.BEDROCK_AWS_REGION!,
});