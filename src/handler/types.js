"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.KafkaAction = __assign({}, KafkaUserAction);
