import { BaseMessage, BaseMessageFields, MessageType } from "@langchain/core/messages";

export interface ControlMessageFields extends BaseMessageFields {
  content: string;
}

export class ControlMessage extends BaseMessage {
  static lc_name() {
    return "ControlMessage";
  }

  constructor(fields: ControlMessageFields) {
    super({ ...fields, });
  }

  _getType(): MessageType {
    return "generic";
  }
}
