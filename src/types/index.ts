
  
  export interface Message {
    id: string;
    type: AllowedMessageTypes;
    content: string;
    tool_call_id?: string;
  }
  
  export type AllowedMessageTypes = "human" | "ai" | "system" | "tool" | "generic";