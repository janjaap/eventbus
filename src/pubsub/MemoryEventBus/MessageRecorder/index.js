import { Middleware } from '../../../middleware';
import MessageStore from './MessageStore';

/**
 * Message recorder middleware class
 * Hooks into EventBus methods 'createTopic()' and 'publish()'
 */
class MessageRecorder extends Middleware {
    /**
     * Creates an instance of MessageRecorder
     */
    constructor(...args) {
        super(...args);
        this.messageStore = new MessageStore();
    }

    /**
     * Creates a topic in the MessageStore class after the topic has been created in the event bus
     *
     * @returns {function} - the next function in line
     */
    createTopic() {
        return next => (...args) => {
            const result = next(...args);
            this.messageStore.createTopic(...args);

            return result;
        };
    }

    /**
     * Creates a message entry in the MessageStore class before the message has been published in the event bus
     *
     * @returns {function} - the next function in line
     */
    publish() {
        return next => (...args) => {
            this.messageStore.record(...args);

            return next(...args);
        };
    }
}

export default MessageRecorder;
