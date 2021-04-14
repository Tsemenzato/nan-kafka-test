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
    clientId: 'test-producer',
});
const topic = 'chatroom1';
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
const producer = kafka.producer();
let username = 'anon';
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    const login = (input) => {
        username = input;
        console.log(`welcome, ${username}, type "exit" to leave chat`);
        prompt();
    };
    const sendMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        yield producer.send({
            topic,
            messages: [{
                    key: `${username}`,
                    value: message
                },],
        });
        prompt();
    });
    const endChat = () => {
        sendMessage(`User ${username} left the chat.`);
        rl.close();
    };
    const prompt = () => rl.question(`[${username}]: `, (input) => __awaiter(void 0, void 0, void 0, function* () {
        input !== 'exit' ? sendMessage(input) : endChat();
    }));
    const promptLogin = () => {
        rl.question(`name? leave blank for anon \n`, (input) => __awaiter(void 0, void 0, void 0, function* () {
            input ? yield login(input) : endChat();
        }));
    };
    rl.on("close", function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("\nDisconnected from chat");
            yield producer.disconnect();
            process.exit(0);
        });
    });
    yield producer.connect();
    promptLogin();
});
test();
