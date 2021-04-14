import {KafkaHandler} from "../handler";
import {EventOption, KafkaAction, KafkaTopic} from "../handler/types";
import {address} from "ip";
import {logLevel} from "kafkajs";

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

it("should produce an event", async (done) => {
  const saved = await handler.sendEvents(topic, [event]);

  expect(saved[0].errorCode).toEqual(0);
  expect(saved[0].topicName).toEqual(topic);

  done();
});
