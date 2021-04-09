import {
  Consumer,
  EachMessagePayload,
  Kafka
} from "kafkajs";
import {
  address
} from 'ip';
import ReadLine from 'readline';

const kafka = new Kafka({
  brokers: [`${address()}:9092`],
  clientId: 'test-consumer',
})

let loggedInUser: string

// topic => chatroom
// consumerGroup => 1 usuario ??
// msg => [key: userId,]

const rl = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

const selectChatroom = () => {
  rl.question(`what chatroom do you want to read? \n`, async (input: string) =>
    rl.question('input name', async (name)=> {
      loggedInUser = name
      await consumeChatroom(input).catch(e => console.error(`[${input}/${loggedInUser}] ${e.message}`, e))})
    )
  }

const consumeChatroom = async (topic: string, fromBeginning: boolean = true): Promise < void > => {
  const consumer: Consumer = kafka.consumer({
    groupId: loggedInUser
  })
  await consumer.connect()
  await consumer.subscribe({
    topic,
    fromBeginning
  })
  console.log(`[Conected to ${topic}]`)
  await consumer.run({
    eachMessage: printMessage,
  })
}

const printMessage = async ({
  topic,
  partition,
  message
}: EachMessagePayload) => {
  const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
  console.log(`- ${prefix} ~ [From ${message.key}} : ${message.value}`)
}

selectChatroom()
