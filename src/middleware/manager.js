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
export default class Manager {
    /**
     * Creates an instance of Manager
     *
     * @memberof Manager
     */
    constructor() {
        this.middlewareFunctions = {};
    }

    /**
     * Creates an entry in the middlewareFunctions array to store override methods in
     *
     * @param {String} className - name of the target object class
     *
     * @memberof Manager
     */
    createClassEntry(className) {
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
    createMethodEntry(className, methodName) {
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
    use(target, ...middlewares) {
        const className = target.constructor.name;
        this.createClassEntry(className);

        // register all middleware methods for the given target
        middlewares.forEach((middleware) => {
            const mwMethodNames = Manager.getClassMethodNames(middleware);
            mwMethodNames.forEach((methodName) => {
                const boundMiddlewareMethod = middleware[methodName].bind(middleware);
                this.createMethodEntry(className, methodName);

                this.middlewareFunctions[className][methodName].unshift(boundMiddlewareMethod(target));
            });
        });

        // replace target methods with middleware methods
        const classMethodNames = Object.keys(this.middlewareFunctions[className]);
        classMethodNames.forEach((classMethodName) => {
            const targetMethod = target.classMethodName;

            if (!targetMethod) {
                throw new Error(`[Manager] Target method '${classMethodName}' does not exist`);
            }

            const boundTargetMethod = targetMethod.bind(target);
            const methodMiddlewares = this.middlewareFunctions[className][classMethodName];
            const replacement = Manager.compose(methodMiddlewares)(boundTargetMethod);

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
    static getClassMethodNames(classObj) {
        const mwProto = Object.getPrototypeOf(classObj);
        const mwMethods = Object.getOwnPropertyNames(mwProto);

        return mwMethods.filter(method => method !== 'constructor');
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
    static compose(middlewareFunctions) {
        const numFunctions = middlewareFunctions.length;

        if (numFunctions === 0) {
            return arg => arg;
        } else if (numFunctions === 1) {
            return middlewareFunctions[0];
        }

        const last = middlewareFunctions.pop();

        return (...args) => middlewareFunctions.reduceRight((v, fn) => fn(v), last(...args));
    }
}
