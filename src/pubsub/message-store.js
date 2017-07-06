/**
 * MessageStore class
 *
 * Allows for storing messages by topics
 *
 * @class MessageStore
 * @namespace PubSub
 */
class MessageStore {
    /**
     * Creates an instance of MessageStore
     * @param {EventBus} EventBus
     *
     * @memberof MessageStore
     */
    constructor(eventBus) {
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
    createTopic(topic) {
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
    record(message, topic = this.defaultTopic) {
        if (!this.topicExists(topic)) {
            throw new Error(`[MessageStore] Cannot record message in non-existent topic '${topic}'`);
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
    topicExists(topic) {
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
    messageIsRecorded(message, topic) {
        return this.topicExists(topic) && this.store[topic].includes(message);
    }
}

export default MessageStore;
