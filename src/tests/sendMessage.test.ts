import {KafkaHandler} from "../handler";
import {EventOption, KafkaAction, KafkaTopic} from "../handler/types";
import {address} from "ip";
import {EachMessagePayload, logLevel} from "kafkajs";

const handler = KafkaHandler.getInstance({
  brokers: [`${address()}:9092`],
  logLevel: logLevel.NOTHING,
});

const topic = KafkaTopic.USER_ACTIVITY;
const event: EventOption = {
  key: "test",
  value: {
    user: {
      id: "test1",
      name: "Mati",
    },
    action: KafkaAction.USER_LOGIN,
    timestamp: 2,
  },
};

it("should send an event", async (done) => {
  const saved = await handler.sendEvents(topic, [event]);

  expect(saved[0].errorCode).toEqual(0);
  expect(saved[0].topicName).toEqual(topic);

  done();
}, 15000);

it("should consume an event", async (done) => {
  // jest.useFakeTimers();

  const consumer = await handler.getConsumerFor({
    topic,
    groupId: "consumerDelTest",
  });

  await consumer.run({
    eachMessage: async ({topic, partition, message}: EachMessagePayload) => {
      const key = message.key.toString();
      const value = JSON.parse(message.value!.toString());

      await consumer.disconnect();
      console.log(event.value);
      expect(key).toEqual(event.key);
      expect(value).toMatchObject(event.value);
      done();
    },
  });
}, 15000);
