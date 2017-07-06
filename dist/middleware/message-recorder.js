"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Message recorder middleware class
 * Hooks into EventBus methods 'createTopic()' and 'publish()'
 *
 * @class MessageRecorder
 * @namespace Middleware
 */
var MessageRecorder = function () {
    /**
     * Creates an instance of MessageRecorder
     *
     * @param {MessageStore} messageStore - store to register messages in
     *
     * @memberof MessageRecorder
     */
    function MessageRecorder(messageStore) {
        _classCallCheck(this, MessageRecorder);

        this.messageStore = messageStore;
    }

    /**
     * Creates a topic in the MessageStore class after the topic has been created in the event bus
     *
     * @returns {Function} - the next function in line
     *
     * @memberof MessageRecorder
     */


    _createClass(MessageRecorder, [{
        key: "createTopic",
        value: function createTopic() {
            var _this = this;

            return function (next) {
                return function (topic) {
                    var result = next(topic);
                    _this.messageStore.createTopic(topic);
                    return result;
                };
            };
        }

        /**
         * Creates a message entry in the MessageStore class before the message has been published in
         * the event bus
         *
         * @returns {Function} - the next function in line
         *
         * @memberof MessageRecorder
         */

    }, {
        key: "publish",
        value: function publish() {
            var _this2 = this;

            return function (next) {
                return function (message, topic) {
                    _this2.messageStore.record(message, topic);

                    return next(message, topic);
                };
            };
        }
    }]);

    return MessageRecorder;
}();

exports.default = MessageRecorder;