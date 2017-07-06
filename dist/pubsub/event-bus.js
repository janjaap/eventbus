'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * EventBus class
 *
 * Allows for publishers to create topics and for subscribers to register to those topics.
 * Publishers can send messages that will be distributed by the bus to all subscribers that have
 * subscribed to the topic the message is published in.
 * Any message that is published without a topic will be published in the '__global__' topic.
 *
 * @class EventBus
 * @namespace PubSub
 */
var EventBus = function () {
    /**
     * Creates an instance of EventBus.
     *
     * @memberof EventBus
     */
    function EventBus() {
        _classCallCheck(this, EventBus);

        this.topics = {};
        this.topics[EventBus.defaultTopic] = [];
    }

    /**
     * Creates a topic
     *
     * @param {String} [topic] - name of the topic
     * @returns {String} topic - name of the topic
     *
     * @memberof EventBus
     */


    _createClass(EventBus, [{
        key: 'createTopic',
        value: function createTopic(topic) {
            if (!this.topicIsCreated(topic)) {
                this.topics[topic] = [];
            }

            return topic;
        }

        /**
         * Publish a message in a topic
         * Will send the message to all subscribers that have subscribed to listen for messages in that
         * particular topic.
         *
         * @param {String} message - identifier of the message
         * @param {String} [topic=EventBus.defaultTopic] - name of the topic
         *
         * @memberof EventBus
         */

    }, {
        key: 'publish',
        value: function publish(message) {
            var topic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EventBus.defaultTopic;

            if (!this.topicIsCreated(topic)) {
                throw new Error('[EventBus] Cannot publish a message in non-existent topic \'' + topic + '\'');
            }

            var topicSubscribers = this.topics[topic];
            EventBus.notifySubscribers(topicSubscribers, message);
        }

        /**
         * Register a subscriber for a topic
         *
         * @param {Subscriber} subscriber - instance of Subscriber
         * @param {String} [topic=EventBus.defaultTopic] - name of the topic
         *
         * @throws {Error} - Whenever a topic has not been created yet
         * @memberof EventBus
         */

    }, {
        key: 'subscribe',
        value: function subscribe(subscriber) {
            var topic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EventBus.defaultTopic;

            if (!this.topicIsCreated(topic)) {
                throw new Error('[EventBus] Cannot subscribe ' + subscriber + ' to non-existent topic \'' + topic + '\'');
            }

            this.topics[topic].push(subscriber);
        }

        /**
         * Check if a topic has been created
         *
         * @param {String} topic - name of the topic
         * @returns {Boolean}
         *
         * @memberof EventBus
         */

    }, {
        key: 'topicIsCreated',
        value: function topicIsCreated(topic) {
            return {}.propertyIsEnumerable.call(this.topics, topic);
        }

        /**
         * Get the default topic
         *
         * @readonly
         * @static
         *
         * @memberof EventBus
         */

    }], [{
        key: 'notifySubscribers',


        /**
         * Notifies all subscribers if the publication of a specific message
         *
         * @static
         * @param {Array} subscribers - list of subscribers to notify
         * @param {String} message - the message to notify subscribers of
         *
         * @memberof EventBus
         */
        value: function notifySubscribers(subscribers, message) {
            subscribers.forEach(function (subscriber) {
                return subscriber.process(message);
            });
        }
    }, {
        key: 'defaultTopic',
        get: function get() {
            return '__global__';
        }
    }]);

    return EventBus;
}();

exports.default = EventBus;