import Middleware from '../Middleware';

/**
 * MiddlewareRegistry class
 * Stores middleware class methods in a specific order
 */
class MiddlewareRegistry {
    /**
     * Reduces a list of function to a single function call
     *
     * @static
     * @param {function[]} middlewareFunctions - list of functions
     * @returns {function}
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

    /**
     * Creates an instance of MiddlewareRegistry
     *
     * @param {Middleware[]} [middlewares=[]] - list of Middleware classes to register
     */
    constructor(middlewares = []) {
        this.middlewares = {};
        this.setMiddlewares(middlewares);
    }

    /**
     * Set Middleware
     *
     * @param {Middleware[]} middlewares - list of middleware classes
     */
    setMiddlewares(middlewares) {
        middlewares.forEach(middleware => this.addMiddleware(middleware));
    }

    /**
     * Add Middleware to the chain
     *
     * @param {Middleware} middleware
     * @throws {Error} When the supplied middleware class is not of type Middleware
     */
    addMiddleware(middleware) {
        if (Object.getPrototypeOf(middleware) instanceof Middleware === false) {
            throw new Error('[MiddlewareRegistry] middleware object should be of type Middleware');
        }

        const mwMethodNames = middleware.getClassMethodNames();
        const mwareName = middleware.constructor.name;
        this.createClassEntry(mwareName);

        mwMethodNames.forEach((methodName) => {
            const boundMiddlewareMethod = middleware[methodName].bind(middleware, this);

            this.createMethodEntry(mwareName, methodName);
            this.middlewares[mwareName][methodName].push(boundMiddlewareMethod);
        });
    }

    /**
     * Get all registered middlewares for a specific method
     *
     * @param {string} methodName - name of the method to get registered middlewares for
     * @returns {function[]}
     */
    getMiddlewares = methodName => Object.keys(this.middlewares)
        .map(mwareName => this.middlewares[mwareName][methodName])
        .reduce((prev, curr) => prev.concat(curr));

    /**
     * Creates an entry in the class middlewares store
     *
     * @param {string} mwareClassName - name of the class for which middleware methods should be stored
     */
    createClassEntry(mwareClassName) {
        if ({}.propertyIsEnumerable.call(this.middlewares, mwareClassName) === false) {
            this.middlewares[mwareClassName] = {};
        }
    }

    /**
     * Creates an entry in the middlewareFunctions array to for a class and a method name
     *
     * @param {string} mwareClassName - name of the class for which middleware methods should be stored
     * @param {string} methodName - name of the method
     */
    createMethodEntry(mwareClassName, methodName) {
        if (!this.middlewares[mwareClassName][methodName]) {
            this.middlewares[mwareClassName][methodName] = [];
        }
    }
}

export default MiddlewareRegistry;
