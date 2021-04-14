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
exports.KafkaHandler = void 0;
const kafkajs_1 = require("kafkajs");
class KafkaHandler {
    constructor(config) {
        this.config = config;
        this.client = new kafkajs_1.Kafka(this.config);
    }
    static getInstance(config) {
        this.instance = KafkaHandler.instance || new KafkaHandler(config);
        return this.instance;
    }
    sendEvents(topic, events) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.producer)
                this.producer = this.client.producer();
            const stringifyEventValues = events.map((event) => (Object.assign(Object.assign({}, event), { value: JSON.stringify(event.value) })));
            yield this.producer.connect();
            const saved = yield this.producer.send({
                topic,
                messages: stringifyEventValues,
            });
            yield this.producer.disconnect();
            return saved;
        });
    }
    getConsumerFor(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const consumer = this.client.consumer(config);
            yield consumer.connect();
            yield consumer.subscribe(config);
            return consumer;
        });
    }
    createTopic(topic) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = this.client.admin();
            yield admin.connect();
            const created = yield admin.createTopics({ topics: [{ topic }] });
            yield admin.disconnect();
            return created;
        });
    }
    deleteTopic(topic) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.fetchTopicMetadata(topic);
            if (!data)
                return null;
            const admin = this.client.admin();
            yield admin.connect();
            const deleted = yield admin.deleteTopics({ topics: [topic] });
            yield admin.disconnect();
            return deleted;
        });
    }
    fetchTopicMetadata(topic) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = this.client.admin();
            yield admin.connect();
            try {
                const metadata = yield admin.fetchTopicMetadata({ topics: [topic] });
                return metadata;
            }
            catch (error) {
                yield admin.disconnect();
                return null;
            }
        });
    }
}
exports.KafkaHandler = KafkaHandler;
