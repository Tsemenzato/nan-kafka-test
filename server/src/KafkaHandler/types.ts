import {Message} from "kafkajs";
import {User} from "../types";

export enum KafkaTopic {
  USER_LOGIN = "user_login_topic",
  USER_LOGOUT = "user_login_topic",
}

enum KafkaUserAction {
  USER_LOGIN = "login",
  USER_LOGOUT = "logout",
}

interface UserMessage extends Omit<Message, "value"> {
  value: {
    user: User;
    action: KafkaUserAction;
    timestamp: number;
  };
}

export type MessageOption = UserMessage;

export interface KafkaMessage {
  topic: KafkaTopic;
  messages: MessageOption[];
}

export const KafkaAction = {...KafkaUserAction};
