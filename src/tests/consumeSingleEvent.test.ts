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

beforeEach(async () => {
  await handler.createTopic(topic);
}, 15000);

afterEach(async () => {
  await handler.deleteTopic(topic);
}, 15000);

it("should consume an event", async (done) => {
  const consumer = await handler.getConsumerFor({
    topic,
    groupId: "consumerDelTest",
  });

  await consumer.run({
    eachMessage: async ({topic, message}: EachMessagePayload) => {
      const key = message.key.toString();
      const value = JSON.parse(message.value!.toString());

      consumer
        .disconnect()
        .then(() => {
          expect(topic).toEqual(topic);
          expect(key).toEqual(event.key);
          expect(value).toMatchObject(event.value);
          done();
        })
        .catch((e) => {
          throw new Error(`Consumer disconnect error: ${e.message}`);
        });
    },
  });

  await handler.sendEvents(topic, [event]);
}, 10000);
