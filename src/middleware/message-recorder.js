/**
 * Message recorder middleware class
 * Hooks into EventBus methods 'createTopic()' and 'publish()'
 *
 * @class MessageRecorder
 * @namespace Middleware
 */
class MessageRecorder {
    /**
     * Creates an instance of MessageRecorder
     *
     * @param {MessageStore} messageStore - store to register messages in
     *
     * @memberof MessageRecorder
     */
    constructor(messageStore) {
        this.messageStore = messageStore;
    }

    /**
     * Creates a topic in the MessageStore class after the topic has been created in the event bus
     *
     * @returns {Function} - the next function in line
     *
     * @memberof MessageRecorder
     */
    createTopic() {
        return next => (topic) => {
            const result = next(topic);
            this.messageStore.createTopic(topic);
            return result;
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
    publish() {
        return next => (message, topic) => {
            this.messageStore.record(message, topic);

            return next(message, topic);
        };
    }
}

export default MessageRecorder;
