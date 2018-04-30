import EventBus from '../EventBus';
import { Support } from '../../middleware';
import PollingSubscriber from './Subscriber';
import MessageRecorder from './MessageRecorder';

/**
 * MemoryEventBus class
 *
 * Can store published messages for later use. This allows subscribers that have subscribed, after a message has been
 * published, to have their callback functions be processed.
 * For that to work, the middleware MessageRecorder is used. This hooks into the event bus' createTopic and publish
 * methods.
 */
class MemoryEventBus extends Support(EventBus) {
    /**
     * Creates an instance of MemoryEventBus
     */
    constructor() {
        super();
        this.messageRecorder = new MessageRecorder();
        this.use(this.messageRecorder);
    }

    /**
     * Create a topic in the event bus as well as in the message recorder
     *
     * @param {string} topic - name of the topic
     */
    createTopic(topic) {
        this.getComposed('createTopic')(topic);
    }

    /**
     * Publish a message through the event bus and store it in the message recorder
     *
     * @param {string} message - identifier of the message
     * @param {string} topic - name of the topic
     * @param {*} payload - payload associated with the message
     */
    publish(message, topic, payload) {
        this.getComposed('publish')(message, topic, payload);
    }

    /**
     * Check if message is recorded
     *
     * @param {string} message
     * @param {string} topic
     * @returns {boolean}
     */
    messageIsRecorded(message, topic) {
        return this.messageRecorder.messageStore.messageIsRecorded(message, topic);
    }

    /**
     * Get the payload of a stored message, if any
     *
     * @param {string} message
     * @param {string} topic
     * @returns {*}
     */
    getPayload(message, topic) {
        return this.messageRecorder.messageStore.getPayload(message, topic);
    }

    /**
     * Create a subscriber
     *
     * @param {string} message
     * @param {function} callback
     * @returns {PollingSubscriber}
     */
    subscriber(messages, callback) {
        return new PollingSubscriber(messages, callback, this);
    }
}

export default MemoryEventBus;
