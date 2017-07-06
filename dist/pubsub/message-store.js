"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * MessageStore class
 *
 * Allows for storing messages by topics
 *
 * @class MessageStore
 * @namespace PubSub
 */
var MessageStore = function () {
    /**
     * Creates an instance of MessageStore
     * @param {EventBus} EventBus
     *
     * @memberof MessageStore
     */
    function MessageStore(eventBus) {
        _classCallCheck(this, MessageStore);

        this.defaultTopic = eventBus.defaultTopic;
        this.store = {};
        this.store[this.defaultTopic] = [];
    }

    /**
     * Create a topic
     *
     * @param {String} topic - name of the topic to create
     *
     * @memberof MessageStore
     */


    _createClass(MessageStore, [{
        key: "createTopic",
        value: function createTopic(topic) {
            if (!this.topicExists(topic)) {
                this.store[topic] = [];
            }
        }

        /**
         * Record a message in a topic
         *
         * @param {String} message - string to record
         * @param {String} [topic=this.defaultTopic] - name of the topic to record the message in
         * @throws {Error} When an attempt is made to record a message in a non-existent topic
         *
         * @memberof MessageStore
         */

    }, {
        key: "record",
        value: function record(message) {
            var topic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaultTopic;

            if (!this.topicExists(topic)) {
                throw new Error("[MessageStore] Cannot record message in non-existent topic '" + topic + "'");
            }

            if (!this.messageIsRecorded(message, topic)) {
                this.store[topic].push(message);
            }
        }

        /**
         * Check if a topic already exists
         *
         * @param {String} topic - name of the topic
         * @returns {Boolean}
         *
         * @memberof MessageStore
         */

    }, {
        key: "topicExists",
        value: function topicExists(topic) {
            return {}.propertyIsEnumerable.call(this.store, topic);
        }

        /**
         * Check if a message has been record in a specific topic
         *
         * @param {String} message - message id to check
         * @param {String} topic - name of the topic
         * @returns {Boolean}
         *
         * @memberof MessageStore
         */

    }, {
        key: "messageIsRecorded",
        value: function messageIsRecorded(message, topic) {
            return this.topicExists(topic) && this.store[topic].includes(message);
        }
    }]);

    return MessageStore;
}();

exports.default = MessageStore;