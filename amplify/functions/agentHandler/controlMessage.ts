import { BaseMessage, BaseMessageFields, MessageType } from "@langchain/core/messages";
import { v4 as uuid } from "uuid";

export interface ControlMessageFields extends BaseMessageFields {
  content: string;
}

export class ControlMessage extends BaseMessage {
  static lc_name() {
    return "ControlMessage";
  }

  constructor(fields: ControlMessageFields) {
    const id = fields.id ?? uuid();
    super({ ...fields, });
  }

  _getType(): MessageType {
    return "generic";
  }
}
