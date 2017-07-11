/* Polyfill Injector */
(function(main) {
    if(/* Array.prototype.includes */!('includes' in Array.prototype)) {
        var js = document.createElement('script');
        js.src = "https://cdn.polyfill.io/v2/polyfill.min.js?features=Array.prototype.includes";
        js.onload = main;
        js.onerror = function() {
            console.error('Could not load polyfills script!');
            main();
        };
        document.head.appendChild(js);
    } else {
        main();
    }
})(function() {
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


var _pubsub = __webpack_require__(1);

var PubSub = _interopRequireWildcard(_pubsub);

var _middleware = __webpack_require__(6);

var Middleware = _interopRequireWildcard(_middleware);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// EventBus (instantiated), Publisher, Subscriber and Messagestore
var messageStore = new PubSub.MessageStore(PubSub.EventBus);

// Manager, MessageRecorder and PublicationPoller

var middlewareManager = new Middleware.Manager();

// using the MessageRecorder class to store messages from the EventBus in the MessageStore
middlewareManager.use(PubSub.EventBus, new Middleware.MessageRecorder(messageStore));

var POLYFILLS_LOADED_TOPIC = 'polyfills';
var MODULES_LOADED_TOPIC = 'modules';

var polyfillPublisher = new PubSub.Publisher(POLYFILLS_LOADED_TOPIC, PubSub.EventBus);
var modulePublisher = new PubSub.Publisher(MODULES_LOADED_TOPIC, PubSub.EventBus);

modulePublisher.send('scrollmonitor');

// subscriber that has its callback executed when 'window_matchmedia' or 'scrollmonitor' is published
var newSubscriber = new PubSub.Subscriber(['window_matchmedia', 'scrollmonitor'], function () {
    console.log('done!');
}, PubSub.EventBus).requireAllMessages(false);

// usgin the PublicationPoller class to check if messages have already been published
middlewareManager.use(newSubscriber, new Middleware.PublicationPoller(messageStore));

// when using the PublicationPoller, the subscribeToMany method should be called after the middleware
// manager has been instructed to use it, otherwise already published messages will not be picked up
// by the PublicationPoller
newSubscriber.subscribeToMany([POLYFILLS_LOADED_TOPIC, MODULES_LOADED_TOPIC]);

if ('matchMedia' in window) {
    polyfillPublisher.send('window_matchmedia');
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessageStore = exports.Subscriber = exports.Publisher = exports.EventBus = undefined;

var _eventBus = __webpack_require__(2);

var _eventBus2 = _interopRequireDefault(_eventBus);

var _publisher = __webpack_require__(3);

var _publisher2 = _interopRequireDefault(_publisher);

var _subscriber = __webpack_require__(4);

var _subscriber2 = _interopRequireDefault(_subscriber);

var _messageStore = __webpack_require__(5);

var _messageStore2 = _interopRequireDefault(_messageStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.EventBus = _eventBus2.default;
exports.Publisher = _publisher2.default;
exports.Subscriber = _subscriber2.default;
exports.MessageStore = _messageStore2.default;

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

        this.defaultTopic = '__global__';
        this.topics = {};
        this.topics[this.defaultTopic] = [];
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
            var topic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaultTopic;

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
            var topic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaultTopic;

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
         * Notifies all subscribers if the publication of a specific message
         *
         * @static
         * @param {Array} subscribers - list of subscribers to notify
         * @param {String} message - the message to notify subscribers of
         *
         * @memberof EventBus
         */

    }], [{
        key: 'notifySubscribers',
        value: function notifySubscribers(subscribers, message) {
            subscribers.forEach(function (subscriber) {
                return subscriber.process(message);
            });
        }
    }]);

    return EventBus;
}();

exports.default = new EventBus();

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
/* 4 */
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

            return this;
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
                    this.callback(message);
                } else if (this.allMessagesPublished) {
                    this.callback(message);
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
/* 5 */
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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PublicationPoller = exports.MessageRecorder = exports.Manager = undefined;

var _manager = __webpack_require__(7);

var _manager2 = _interopRequireDefault(_manager);

var _messageRecorder = __webpack_require__(8);

var _messageRecorder2 = _interopRequireDefault(_messageRecorder);

var _publicationPoller = __webpack_require__(9);

var _publicationPoller2 = _interopRequireDefault(_publicationPoller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Manager = _manager2.default;
exports.MessageRecorder = _messageRecorder2.default;
exports.PublicationPoller = _publicationPoller2.default;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Middleware manager class
 *
 * Manage and apply middlewares for an object.
 * Middleware functions are functions that have access to the target function and it's arguments,
 * and the target object and the next middleware function in the target function cycle.
 * The next middleware function is commonly denoted by a variable named next.
 *
 * @class Manager
 * @namespace Middleware
 *
 * @see https://gist.github.com/unbug/dd596d79b5eace7d245f0a4db6cd2be5
 */
var Manager = function () {
    /**
     * Creates an instance of Manager
     *
     * @memberof Manager
     */
    function Manager() {
        _classCallCheck(this, Manager);

        this.middlewareFunctions = {};
    }

    /**
     * Creates an entry in the middlewareFunctions array to store override methods in
     *
     * @param {String} className - name of the target object class
     *
     * @memberof Manager
     */


    _createClass(Manager, [{
        key: 'createClassEntry',
        value: function createClassEntry(className) {
            if ({}.propertyIsEnumerable.call(this.middlewareFunctions, className) === false) {
                this.middlewareFunctions[className] = [];
            }
        }

        /**
         * Creates an entry in the middlewareFunctions array to for a class and a method name
         *
         * @param {String} className - name of the target object class
         * @param {String} methodName - name of the method for which middleware methods should be stored
         *
         * @memberof Manager
         */

    }, {
        key: 'createMethodEntry',
        value: function createMethodEntry(className, methodName) {
            if (!this.middlewareFunctions[className][methodName]) {
                this.middlewareFunctions[className][methodName] = [];
            }
        }

        /**
         * Register middleware for a target object
         * The middleware class instances that are passed in, are applied from right to left
         *
         * @param {Object} target - Class instance to which the middleware needs to be applied to
         * @param {Array} ...middlewares - list of middleware class objects
         *
         * @memberof Manager
         */

    }, {
        key: 'use',
        value: function use(target) {
            var _this = this;

            var className = target.constructor.name;
            this.createClassEntry(className);

            // register all middleware methods for the given target

            for (var _len = arguments.length, middlewares = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                middlewares[_key - 1] = arguments[_key];
            }

            middlewares.forEach(function (middleware) {
                var mwMethodNames = Manager.getClassMethodNames(middleware);
                mwMethodNames.forEach(function (methodName) {
                    var boundMiddlewareMethod = middleware[methodName].bind(middleware);
                    _this.createMethodEntry(className, methodName);

                    _this.middlewareFunctions[className][methodName].unshift(boundMiddlewareMethod(target));
                });
            });

            // replace target methods with middleware methods
            var classMethodNames = Object.keys(this.middlewareFunctions[className]);
            classMethodNames.forEach(function (classMethodName) {
                var targetProto = Object.getPrototypeOf(target);
                var targetMethod = targetProto.classMethodName || targetProto[classMethodName];

                if (!targetMethod) {
                    throw new Error('[Manager] Target method \'' + classMethodName + '\' does not exist');
                }

                var boundTargetMethod = targetMethod.bind(target);
                var methodMiddlewares = _this.middlewareFunctions[className][classMethodName];
                var replacement = Manager.compose(methodMiddlewares)(boundTargetMethod);

                // temporarily disable linter to override target method
                // eslint-disable-next-line no-param-reassign
                target[classMethodName] = replacement;
            });

            // allow for fluent interface
            return this;
        }

        /**
         * Return all method names, excluding the constructor, from a class object
         *
         * @static
         * @param {Object} classObj - object to retrieve method names from
         * @returns {Array}
         *
         * @memberof Manager
         */

    }], [{
        key: 'getClassMethodNames',
        value: function getClassMethodNames(classObj) {
            var mwProto = Object.getPrototypeOf(classObj);
            var mwMethods = Object.getOwnPropertyNames(mwProto);

            return mwMethods.filter(function (method) {
                return method !== 'constructor';
            });
        }

        /**
         * Reduces a list of function to a single function call
         *
         * @static
         * @param {Array} middlewareFunctions - list of functions
         * @returns {Function} A function obtained by composing the argument functions from right to
         * left. For example, compose(f, g, h) is identical to doing (...args) => f(g(h(...args)))
         *
         * @see https://medium.com/@dtipson/creating-an-es6ish-compose-in-javascript-ac580b95104a
         * @memberof Manager
         */

    }, {
        key: 'compose',
        value: function compose(middlewareFunctions) {
            var numFunctions = middlewareFunctions.length;

            if (numFunctions === 0) {
                return function (arg) {
                    return arg;
                };
            } else if (numFunctions === 1) {
                return middlewareFunctions[0];
            }

            var last = middlewareFunctions.pop();

            return function () {
                return middlewareFunctions.reduceRight(function (v, fn) {
                    return fn(v);
                }, last.apply(undefined, arguments));
            };
        }
    }]);

    return Manager;
}();

exports.default = Manager;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

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
     * @param {Object} target - the actual objec that this middleware class hooks into
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
         * @param {Object} target - the actual objec that this middleware class hooks into
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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * PublicationPoller Class
 *
 * Hooks into Subscriber.subscribeToOne and Subscriber.subscribeToMany methods and polls for
 * messages that have already been published through the EventBus and, if so, processes those
 * message for the current Subscriber.
 *
 * @class PublicationPoller
 * @namespace Middleware
 */
var PublicationPoller = function () {
    /**
     * Creates an instance of PublicationPoller
     *
     * @param {MessageStore} messageStore - message store object
     *
     * @memberof PublicationPoller
     */
    function PublicationPoller(messageStore) {
        var _this = this;

        _classCallCheck(this, PublicationPoller);

        this.messageStore = messageStore;

        /**
         * Checks the event bus for already published messages for the given target object
         *
         * @param {Object} target - Subscriber object
         * @param {String} topic - the topic to request published messages for
         */
        this.pollPublishedMessages = function (target, topic) {
            target.messagesToListenTo.filter(function (message) {
                return _this.messageStore.messageIsRecorded(message, topic);
            }).forEach(function (message) {
                target.process(message);
            });
        };
    }

    /**
     * Polls for messages in a topic
     *
     * @param {Object} target - the actual objec that this middleware class hooks into
     * @returns {Function}
     *
     * @memberof PublicationPoller
     */


    _createClass(PublicationPoller, [{
        key: "subscribeToOne",
        value: function subscribeToOne(target) {
            var _this2 = this;

            return function (next) {
                return function (topic) {
                    var result = next(topic);

                    _this2.pollPublishedMessages(target, topic);

                    return result;
                };
            };
        }

        /**
         * Polls for messages in multiple topics
         *
         * @param {Object} target - the actual objec that this middleware class hooks into
         * @returns {Function}
         *
         * @memberof PublicationPoller
         */

    }, {
        key: "subscribeToMany",
        value: function subscribeToMany(target) {
            var _this3 = this;

            return function (next) {
                return function (topics) {
                    var result = next(topics);

                    topics.forEach(function (topic) {
                        return _this3.pollPublishedMessages(target, topic);
                    });

                    return result;
                };
            };
        }
    }]);

    return PublicationPoller;
}();

exports.default = PublicationPoller;

/***/ })
/******/ ]);
});