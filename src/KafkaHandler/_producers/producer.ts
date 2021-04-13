import {
  Producer,
  Kafka
} from "kafkajs";
import {
  address
} from 'ip';
import ReadLine from 'readline';

const kafka = new Kafka({
  brokers: [`${address()}:9092`],
  clientId: 'test-producer',
})

const topic: string = 'chatroom1'

const rl = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout
});


const producer: Producer = kafka.producer()

let username: string = 'anon'



const test = async () => {
  const login = (input: string) => {
    username = input
    console.log(`welcome, ${username}, type "exit" to leave chat`)

    prompt()
  }
  const sendMessage = async (message: string) => {
    await producer.send({
      topic,
      messages: [{
        key: `${username}`,
        value: message
      }, ],
    })
    prompt();
  }

  const endChat = () => {
    sendMessage(`User ${username} left the chat.`)
    rl.close()
  };

  const prompt = () => rl.question(`[${username}]: `, async (input: string) => {
    input !== 'exit' ? sendMessage(input) : endChat()
  })

  const promptLogin = () => {
    rl.question(`name? leave blank for anon \n`, async (input: string) => {
      input ? await login(input) : endChat()
    })
  }

  rl.on("close", async function () {
    console.log("\nDisconnected from chat");
    await producer.disconnect()
    process.exit(0);
  });

  await producer.connect()
  promptLogin()

}
test()
