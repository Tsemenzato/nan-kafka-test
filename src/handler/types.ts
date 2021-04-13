import {Message} from "kafkajs";

export enum KafkaTopic {
  USER_ACTIVITY = "user_activity_topic",
}

enum KafkaUserAction {
  USER_LOGIN = "login",
  USER_LOGOUT = "logout",
}

export interface UserEvent extends Omit<Message, "value"> {
  value: {
    user: User;
    action: KafkaUserAction;
    timestamp: number;
  };
}

export type EventOption = UserEvent;

export interface KafkaEvent {
  topic: KafkaTopic;
  messages: EventOption[];
}

export const KafkaAction = {...KafkaUserAction};

export type User = {
  id: string;
  name: string;
};
