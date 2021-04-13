// import * as path from "path";
import {createServer} from "http";
import {Server, Socket} from "socket.io";
import {kafkaConfig} from "./config";
import {KafkaHandler} from "./KafkaHandler";
import {
  KafkaAction,
  KafkaMessage,
  KafkaTopic,
  UserMessage,
} from "./KafkaHandler/types";
import {User} from "./types";

const port = process.env.PORT || 5000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {origin: "*"},
});

interface MySocket extends Socket {
  userData?: User;
}

const getUsersOnline = (io: Server) => {
  return Array.from(
    io.sockets.sockets.values(),
    (socket: MySocket) => socket.userData
  );
};

io.on("connection", (socket: MySocket) => {
  console.log("Socket connected", socket.id);
  const kafka = KafkaHandler.getInstance(kafkaConfig);

  socket.on("userLogin", (payload: string) => {
    const event: KafkaMessage = JSON.parse(payload);
    kafka?.sendMessages(event.topic, event.messages);

    socket.userData = event.messages[0].value.user;

    const users = getUsersOnline(io);
    io.emit("userOnline", users);
  });

  socket.on("userLogout", (payload: string) => {
    const event: KafkaMessage = JSON.parse(payload);
    kafka?.sendMessages(event.topic, event.messages);

    const users = getUsersOnline(io);
    io.emit("userOnline", users);
  });

  socket.on("test", (data) => {
    console.log(data);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket ${socket.id} disconnected: ${reason}`);

    const message: UserMessage = {
      key: socket.userData!.id,
      value: {
        action: KafkaAction.USER_LOGOUT,
        user: socket.userData!,
        timestamp: Date.now(),
      },
    };

    kafka?.sendMessages(KafkaTopic.USER_ACTIVITY, [message]);

    const users = getUsersOnline(io);
    io.emit("userOnline", users);
  });
});

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
