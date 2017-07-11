/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessageStore = exports.Subscriber = exports.Publisher = exports.EventBus = undefined;

var _eventBus = __webpack_require__(1);

var _eventBus2 = _interopRequireDefault(_eventBus);

var _publisher = __webpack_require__(2);

var _publisher2 = _interopRequireDefault(_publisher);

var _subscriber = __webpack_require__(3);

var _subscriber2 = _interopRequireDefault(_subscriber);

var _messageStore = __webpack_require__(4);

var _messageStore2 = _interopRequireDefault(_messageStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.EventBus = _eventBus2.default;
exports.Publisher = _publisher2.default;
exports.Subscriber = _subscriber2.default;
exports.MessageStore = _messageStore2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Subscriber class
 * Can register itself to topics that are created in the bus and listen for messages that are
 * published in those topics. All messages listened to, have to be published by the bus before the
 * subscriber's callback method is executed.
 *
 * @class Subscriber
 * @namespace PubSub
 */
var Subscriber = function () {
    /**
     * Creates an instance of Subscriber.
     *
     * @param {String|Array} messages - either one message or a list of messages to listen to
     * @param {Function} callback - method to be executed when all messages have been published
     * @param {EventBus} EventBus
     * @return {Subscriber} Allows for fluent interface
     *
     * @memberof Subscriber
     */
    function Subscriber(messages, callback, EventBus) {
        _classCallCheck(this, Subscriber);

        this.EventBus = EventBus;

        if (!this.EventBus.subscribe) {
            throw new Error("[Subscriber] EventBus should have a 'subscribe' method");
        }

        this.messagesToListenTo = Array.isArray(messages) ? messages : [messages];
        this.callback = callback;
        this.publishedMessages = [];
        this.needsAllMessagesForCallback = true;

        return this;
    }

    /**
     * Set to true to require all messages to be published before the callback is executed. When set
     * to false, the callback is executed each time one of the messages is published.
     *
     * @memberof Subscriber
     */


    _createClass(Subscriber, [{
        key: "requireAllMessages",
        value: function requireAllMessages(requireAll) {
            this.needsAllMessagesForCallback = requireAll;
        }

        /**
         * Check if all messages that need to be listened to, have been published by the bus.
         *
         * @readonly
         * @memberof Subscriber
         */

    }, {
        key: "setPublished",


        /**
         * Store a published message to track which ones have been published so far
         *
         * @param {String} message - the identifier of the published message to store
         *
         * @memberof Subscriber
         */
        value: function setPublished(message) {
            this.publishedMessages.push(message);
        }

        /**
         * Check if message to listen to has been published by the bus
         *
         * @param {String} message - the identifier of the message
         * @returns {Boolean}
         *
         * @memberof Subscriber
         */

    }, {
        key: "isPublished",
        value: function isPublished(message) {
            return this.publishedMessages.includes(message);
        }

        /**
         * Check if this subscriber listens for a message that has been published
         *
         * @param {String} message - the identifier of the message
         * @returns {Boolean}
         *
         * @memberof Subscriber
         */

    }, {
        key: "listensFor",
        value: function listensFor(message) {
            return this.messagesToListenTo.includes(message);
        }

        /**
         * Subscribe to one topic
         * Will poll the event bus for already published messages in the topic it is registering to
         *
         * @param {String} topic - identifier of the topic to subscribe to
         * @returns {Subscriber}
         *
         * @memberof Subscriber
         */

    }, {
        key: "subscribeToOne",
        value: function subscribeToOne(topic) {
            this.EventBus.subscribe(this, topic);

            return this;
        }

        /**
         * Subscribe to one or more topics
         * Will poll the event bus for already published messages in the topics it is registering to
         *
         * @param {Array} topics - list of topics to subscribe to
         * @returns {Subscriber}
         *
         * @memberof Subscriber
         */

    }, {
        key: "subscribeToMany",
        value: function subscribeToMany(topics) {
            var _this = this;

            topics.forEach(function (topic) {
                _this.EventBus.subscribe(_this, topic);
            });

            return this;
        }

        /**
         * Handle a published message for a topic this subscriber has itself subscribed to
         * Will check if the message is one this subscriber is listening to and when all messages for
         * this subscriber have been published by the bus, executes the callback.
         *
         * @param {String} message - identifier of the message to handle
         *
         * @memberof Subscriber
         */

    }, {
        key: "process",
        value: function process(message) {
            if (this.listensFor(message) && this.isPublished(message) === false) {
                this.setPublished(message);

                if (!this.needsAllMessagesForCallback) {
                    this.callback();
                } else if (this.allMessagesPublished) {
                    this.callback();
                }
            }
        }
    }, {
        key: "allMessagesPublished",
        get: function get() {
            var _this2 = this;

            return this.messagesToListenTo.every(function (message) {
                return _this2.isPublished(message);
            });
        }
    }]);

    return Subscriber;
}();

exports.default = Subscriber;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ })
/******/ ]);