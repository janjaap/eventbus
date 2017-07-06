"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Publisher class
 * Creates a topic in the event bus and allows for sending messages to the event bus in the topic
 * that it created.
 *
 * @class Publisher
 * @namespace PubSub
 */
var Publisher = function () {
    /**
     * Creates an instance of Publisher.
     * Will call the 'createTopic' method on the eventbus and get the value of 'topic' returned
     *
     * @param {String} topic - identifier of the topic that is to be created in the bus
     * @param {EventBus} EventBus
     *
     * @memberof Publisher
     */
    function Publisher(topic, EventBus) {
        _classCallCheck(this, Publisher);

        this.EventBus = EventBus;

        if (!this.EventBus.createTopic || !this.EventBus.publish) {
            throw new Error("[Publisher] EventBus object should have 'createTopic' and 'publish' methods");
        }

        this.topic = this.EventBus.createTopic(topic);
    }

    /**
     * Sends a message to the event bus for its own topic
     *
     * @param {String} message - the message to send to the bus
     *
     * @memberof Publisher
     */


    _createClass(Publisher, [{
        key: "send",
        value: function send(message) {
            this.EventBus.publish(message, this.topic);
        }
    }]);

    return Publisher;
}();

exports.default = Publisher;