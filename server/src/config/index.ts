import {address} from "ip";
import {KafkaConfig} from "kafkajs";

const network = address();

export const kafkaConfig: KafkaConfig = {
  brokers: [`${network}:9092`],
  clientId: "kafka-chat-poc",
};
