import { Consumer, EachMessagePayload, Kafka } from "kafkajs";
import { address } from 'ip';

const kafka = new Kafka({
  brokers: [`${address()}:9092`],
  clientId: 'test-producer',
})

const loggedInUser: string = 'Admin';
const topic: string = 'chatroom1'
const consumer: Consumer = kafka.consumer({ groupId: loggedInUser })
// topic => chatroom
// consumerGroup => 1 usuario ??
// msg => [key: userId,]
const consumeChatroom = async (topic: string, fromBeginning: boolean = true): Promise<void> => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning })
  console.log(`[Conected to ${topic}]`)
  await consumer.run({
    eachMessage: printMessage,
  })
}

const printMessage = async ({ topic, partition, message }:EachMessagePayload) => {
  const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
  console.log(`- ${prefix} ~ [From ${message.key}} : ${message.value}`)
}

consumeChatroom(topic).catch(e => console.error(`[${topic}/${loggedInUser}] ${e.message}`, e))
