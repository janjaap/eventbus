/**
 * MessageStore class
 * Allows for storing messages and their payloads by topics
 */
class MessageStore {
    /**
     * Creates an instance of MessageStore
     */
    constructor() {
        this.messages = {};
        this.payloads = {};
    }

    /**
     * Create a topic
     *
     * @param {string} topic - name of the topic to create
     */
    createTopic(topic) {
        if (!this.topicExists(topic)) {
            this.messages[topic] = [];
            this.payloads[topic] = {};
        }
    }

    /**
     * Record a message in a topic
     *
     * @param {string} message - message to record
     * @param {string} topic - name of the topic to record the message in
     * @param {*} payload - message payload
     *
     * @throws {Error} When an attempt is made to record a message in a non-existent topic
     */
    record(message, topic, payload) {
        if (!this.topicExists(topic)) {
            throw new Error(`[${this.constructor.name}] Cannot record message in non-existent topic '${topic}'`);
        }

        if (!this.messageIsRecorded(message, topic)) {
            this.messages[topic].push(message);

            if (payload) {
                this.payloads[topic][message] = payload;
            }
        }
    }

    /**
     * Check if a topic already exists
     *
     * @param {string} topic - name of the topic
     * @returns {boolean}
     */
    topicExists(topic) {
        return {}.propertyIsEnumerable.call(this.messages, topic);
    }

    /**
     * Get the payload for a stored message
     *
     * @param {string} message - name of the message
     * @param {string} topic - name of the topic
     * @returns {*}
     */
    getPayload = (message, topic) => this.messageIsRecorded(message, topic) && this.payloads[topic][message]

    /**
     * Check if a message has been record in a specific topic
     *
     * @param {string} message - message id to check
     * @param {string} topic - name of the topic
     * @returns {boolean}
     */
    messageIsRecorded = (message, topic) => this.topicExists(topic) && this.messages[topic].includes(message)
}

export default MessageStore;
