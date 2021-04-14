import {
  ConsumerConfig,
  ConsumerSubscribeTopic,
  Kafka,
  KafkaConfig,
  Producer,
} from "kafkajs";
import {KafkaTopic, EventOption} from "./types";

export class KafkaHandler {
  private static instance: KafkaHandler;
  private producer: Producer | undefined;
  private config: KafkaConfig;
  private client: Kafka;

  private constructor(config: KafkaConfig) {
    this.config = config;
    this.client = new Kafka(this.config);
  }

  static getInstance(config: KafkaConfig): KafkaHandler {
    this.instance = KafkaHandler.instance || new KafkaHandler(config);

    return this.instance;
  }

  async sendEvents(topic: KafkaTopic, events: EventOption[]) {
    if (!this.producer) this.producer = this.client.producer();

    const stringifyEventValues = events.map((event) => ({
      ...event,
      value: JSON.stringify(event.value),
    }));

    await this.producer.connect();

    const saved = await this.producer.send({
      topic,
      messages: stringifyEventValues,
    });

    await this.producer.disconnect();

    return saved;
  }

  async getConsumerFor(config: ConsumerConfig & ConsumerSubscribeTopic) {
    const consumer = this.client.consumer(config);
    await consumer.connect();
    await consumer.subscribe(config);

    return consumer;
  }
}
