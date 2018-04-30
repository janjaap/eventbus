/**
 * Middleware class
 * Allows retrieving method names of extending classes. These method names can then be hooked into by the extending
 * class.
 */
class Middleware {
    /**
     * Return all method names, excluding the constructor, from a class object
     *
     * @returns {string[]}
     */
    getClassMethodNames() {
        const mwProto = Object.getPrototypeOf(this);
        const mwMethods = Object.getOwnPropertyNames(mwProto);

        return mwMethods.filter(method => method !== 'constructor');
    }
}

export default Middleware;
