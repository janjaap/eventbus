/**
 * Publisher class
 * Creates a topic in the event bus and allows for sending messages to the event bus in the topic that it created.
 */
class Publisher {
    /**
     * Creates an instance of Publisher.
     * Will call the 'createTopic' method on the event bus
     *
     * @param {string} topic - identifier of the topic that is to be created in the bus
     * @param {EventBus} EventBus
     */
    constructor(topic, EventBus) {
        this.topic = topic;
        this.EventBus = EventBus;

        if (!this.EventBus.createTopic || !this.EventBus.publish) {
            throw new Error(`[${this.constructor.name}] EventBus object should have 'createTopic' and 'publish' methods`);
        }

        this.EventBus.createTopic(topic);
    }

    /**
     * Sends a message to the event bus for its own topic
     *
     * @param {string} message - the message to send to the bus
     */
    send(message) {
        this.EventBus.publish(message, this.topic);
    }
}

export default Publisher;
