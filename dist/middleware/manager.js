'use strict';

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