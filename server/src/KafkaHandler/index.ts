import {
  ConsumerConfig,
  ConsumerSubscribeTopic,
  Kafka,
  KafkaConfig,
  Producer,
} from "kafkajs";
import {KafkaTopic, MessageOption} from "./types";

export class KafkaHandler {
  private static instance: KafkaHandler;
  private producer: Producer | undefined;
  private config: KafkaConfig;
  private client: Kafka;

  private constructor(config: KafkaConfig) {
    this.config = config;
    this.client = new Kafka(this.config);
  }

  static getInstance(config: KafkaConfig): KafkaHandler | null {
    try {
      this.instance = KafkaHandler.instance || new KafkaHandler(config);

      return this.instance;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async sendMessages(topic: KafkaTopic, messages: MessageOption[]) {
    if (!this.producer) this.producer = this.client.producer();

    const stringifyMessageValues = messages.map((message) => ({
      ...message,
      value: JSON.stringify(message.value),
    }));

    await this.producer.connect();

    await this.producer.send({topic, messages: stringifyMessageValues});
  }

  async getConsumerFor(config: ConsumerConfig & ConsumerSubscribeTopic) {
    const consumer = this.client.consumer(config);
    await consumer.connect();
    await consumer.subscribe(config);

    return consumer;
  }
}
