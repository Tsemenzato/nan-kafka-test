import {
  KafkaHandler
} from '../handler';
import {
  KafkaAction,
  KafkaTopic
} from '../handler/types';
import {
  address
} from 'ip';
import { EachMessagePayload } from 'kafkajs';


const handler = KafkaHandler.getInstance({
  brokers: [`${address()}:9092`]
});

handler?.sendEvents(KafkaTopic.USER_ACTIVITY, [{
  key: 'test',
  value: {
    user: {
      id: 'test1',
      name: 'Mati'
    },
    action: KafkaAction.USER_LOGIN,
    timestamp: 2
  }
}])

test('message recieved', async () => {
  const consumer = await handler?.getConsumerFor({
    topic: KafkaTopic.USER_ACTIVITY,
    groupId: 'consumerDelTest'
  });
  consumer!.run({
    eachMessage: async (payload: EachMessagePayload) => {
      expect(payload.message.value).toEqual({
        user: {
          id: 'test1',
          name: 'Mati'
        }
      })

    }
  })
})
