import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data, agentHandler } from './data/resource';

defineBackend({
  auth,
  data,
  agentHandler
});
