// import * as path from "path";
import {createServer} from "http";
import {Server, Socket} from "socket.io";
import {kafkaConfig} from "./config";
import {KafkaHandler} from "./KafkaHandler";
import {KafkaMessage} from "./KafkaHandler/types";

const port = process.env.PORT || 5000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {origin: "*"},
});

io.on("connection", (socket: Socket) => {
  console.log("Socket connected", socket.id);
  const kafka = KafkaHandler.getInstance(kafkaConfig);

  socket.on("loginMessage", (payload: string) => {
    const event: KafkaMessage = JSON.parse(payload);
    kafka?.sendMessages(event.topic, event.messages);
  });
});

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
