import { a, defineData, defineFunction, type ClientSchema, secret  } from '@aws-amplify/backend';

export const agentHandler = defineFunction({
  name: 'agentHandler',
  entry: '../functions/agentHandler/agentHandler.ts',
  timeoutSeconds: 900, // (max: 900)
  environment: {
    GITHUB_TOKEN: secret('GITHUB_TOKEN'),
    BEDROCK_MODEL_ID: process.env.BEDROCK_MODEL_ID!,
    BEDROCK_AWS_REGION: process.env.BEDROCK_AWS_REGION!,
    BEDROCK_AWS_ACCESS_KEY_ID: secret('BEDROCK_AWS_ACCESS_KEY_ID'),
    BEDROCK_AWS_SECRET_ACCESS_KEY: secret('BEDROCK_AWS_SECRET_ACCESS_KEY'),
    DEFAULT_REPO: process.env.DEFAULT_REPO!,
  },
});

const schema = a.schema({
  Log: a.model({
    id: a.id(),
    message: a.string(),
  })
  .authorization((allow) => [allow.guest()]),

  
  AllowedMessageType: a.enum(["human", "ai", "system", "tool", "generic"]),

  Message: a.customType({
    type: a.ref("AllowedMessageType"),
    content: a.string(),
    tool_call_id: a.string(),
  }),

  AgentResponse: a.customType({
    reply: a.string(),
    messages: a.ref("Message").array(),
  }),

  runAgent: a
    .mutation()
    .arguments({
      input: a.string(),
      history: a.ref("Message").array(),
    })
    .returns(a.ref("AgentResponse"))
    .authorization((allow) => [allow.publicApiKey()])
    // .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(agentHandler)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
