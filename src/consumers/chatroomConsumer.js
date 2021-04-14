"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const ip_1 = require("ip");
const readline_1 = __importDefault(require("readline"));
const kafka = new kafkajs_1.Kafka({
    brokers: [`${ip_1.address()}:9092`],
    clientId: 'test-consumer',
});
let loggedInUser;
// topic => chatroom
// consumerGroup => 1 usuario ??
// msg => [key: userId,]
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
const selectChatroom = () => {
    rl.question(`what chatroom do you want to read? \n`, (input) => __awaiter(void 0, void 0, void 0, function* () {
        return rl.question('input name', (name) => __awaiter(void 0, void 0, void 0, function* () {
            loggedInUser = name;
            yield consumeChatroom(input).catch(e => console.error(`[${input}/${loggedInUser}] ${e.message}`, e));
        }));
    }));
};
const consumeChatroom = (topic, fromBeginning = true) => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = kafka.consumer({
        groupId: loggedInUser
    });
    yield consumer.connect();
    yield consumer.subscribe({
        topic,
        fromBeginning
    });
    console.log(`[Conected to ${topic}]`);
    yield consumer.run({
        eachMessage: printMessage,
    });
});
const printMessage = ({ topic, partition, message }) => __awaiter(void 0, void 0, void 0, function* () {
    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
    console.log(`- ${prefix} ~ [From ${message.key}} : ${message.value}`);
});
selectChatroom();
