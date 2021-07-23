"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaAction = exports.KafkaTopic = void 0;
var KafkaTopic;
(function (KafkaTopic) {
    KafkaTopic["USER_ACTIVITY"] = "user_activity_topic";
})(KafkaTopic = exports.KafkaTopic || (exports.KafkaTopic = {}));
var KafkaUserAction;
(function (KafkaUserAction) {
    KafkaUserAction["USER_LOGIN"] = "login";
    KafkaUserAction["USER_LOGOUT"] = "logout";
})(KafkaUserAction || (KafkaUserAction = {}));
exports.KafkaAction = Object.assign({}, KafkaUserAction);
