import {kafkaConfig} from "./config";
import {Consumer, EachMessagePayload, Kafka} from "kafkajs";
import {KafkaTopic} from "./KafkaHandler/types";

const printMessage = async ({
  topic,
  partition,
  message,
}: EachMessagePayload) => {
  const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
  console.log(`- ${prefix} ~ [From ${message.key}} : ${message.value}`);
};

(async () => {
  const kafka = new Kafka(kafkaConfig);

  const consumer: Consumer = kafka.consumer({
    groupId: "test-consumer",
  });
  await consumer.connect();
  await consumer.subscribe({
    topic: KafkaTopic.USER_LOGIN,
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: printMessage,
  });
})();
