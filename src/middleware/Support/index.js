import MiddlewareRegistry from '../MiddlewareRegistry';

/**
 * Support mixin
 * To be extended by classes that should allow their methods to be appended or prepended by middleware methods
 *
 * @param {Class} Base
 */
const Support = Base => class extends Base {
    constructor(...args) {
        super(...args);
        this.mwareRegistry = new MiddlewareRegistry();
    }

    /**
     * Get all middleware methods composed into one function call
     *
     * @param {string} method - middleware method for which composition should be performed
     * @returns {function}
     */
    getComposed(method) {
        const middlewares = this.mwareRegistry.getMiddlewares(method);
        const boundMethod = super[method].bind(this);
        const composedMiddlewares = MiddlewareRegistry.compose(middlewares)(boundMethod);

        return composedMiddlewares(boundMethod);
    }

    /**
     * Set middlewares
     *
     * @param {...Middleware} mwares
     */
    use(...mwares) {
        this.mwareRegistry.setMiddlewares(mwares);
    }
};

export default Support;
