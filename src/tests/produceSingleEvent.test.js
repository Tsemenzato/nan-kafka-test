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
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("../handler");
const types_1 = require("../handler/types");
const ip_1 = require("ip");
const kafkajs_1 = require("kafkajs");
const handler = handler_1.KafkaHandler.getInstance({
    brokers: [`${ip_1.address()}:9092`],
    logLevel: kafkajs_1.logLevel.NOTHING,
});
const topic = types_1.KafkaTopic.USER_ACTIVITY;
const event = {
    key: "test",
    value: {
        user: {
            id: "test1",
            name: "Mati",
        },
        action: types_1.KafkaAction.USER_LOGIN,
        timestamp: 2,
    },
};
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield handler.createTopic(topic);
}), 15000);
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield handler.deleteTopic(topic);
}), 15000);
it("should produce an event", (done) => __awaiter(void 0, void 0, void 0, function* () {
    const saved = yield handler.sendEvents(topic, [event]);
    expect(saved[0].errorCode).toEqual(0);
    expect(saved[0].topicName).toEqual(topic);
    done();
}));
