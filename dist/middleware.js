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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PublicationPoller = exports.MessageRecorder = exports.Manager = undefined;

var _manager = __webpack_require__(6);

var _manager2 = _interopRequireDefault(_manager);

var _messageRecorder = __webpack_require__(7);

var _messageRecorder2 = _interopRequireDefault(_messageRecorder);

var _publicationPoller = __webpack_require__(8);

var _publicationPoller2 = _interopRequireDefault(_publicationPoller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Manager = _manager2.default;
exports.MessageRecorder = _messageRecorder2.default;
exports.PublicationPoller = _publicationPoller2.default;

/***/ }),
/* 6 */
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

                    _this.middlewareFunctions[className][methodName].push(boundMiddlewareMethod(target));
                });
            });

            // replace target methods with middleware methods
            var classMethodNames = Object.keys(this.middlewareFunctions[className]);
            classMethodNames.forEach(function (classMethodName) {
                var targetMethod = target[classMethodName];
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
/* 7 */
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
     * @param {Object} target - reference to Subscriber instance
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
         * @param {Object} target - reference to Subscriber instance
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