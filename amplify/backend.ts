import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { data, agentHandler } from './data/resource';

const backend = defineBackend({
  auth,
  data,
  agentHandler
});

// Configure a policy for the required use case.
// The actions included below cover all supported ML capabilities
backend.auth.resources.authenticatedUserIamRole.addToPrincipalPolicy(
  new PolicyStatement({
    actions: [
      "polly:SynthesizeSpeech",
      "transcribe:StartStreamTranscriptionWebSocket",
    ],
    resources: ["*"],
  })
);

// Grant Bedrock access to the Lambda function
backend.agentHandler.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      "bedrock:InvokeModel",
      "bedrock:ListFoundationModels",
    ],
    resources: ["*"], // Replace with specific Bedrock model ARNs if needed
  })
);

backend.addOutput({
  custom: {
    Predictions: {
      convert: {
        speechGenerator: {
          defaults: {
            voiceId: "Matthew",
            engine: "neural",
          },
          proxy: false,
          region: backend.auth.stack.region,
        },
        transcription: {
          defaults: {
            language: "en-US",
          },
          proxy: false,
          region: backend.auth.stack.region,
        },
      },
    },
  },
});