/**
 * Publisher class
 * Creates a topic in the event bus and allows for sending messages to the event bus in the topic
 * that it created.
 *
 * @class Publisher
 * @namespace PubSub
 */
class Publisher {
    /**
     * Creates an instance of Publisher.
     * Will call the 'createTopic' method on the eventbus and get the value of 'topic' returned
     *
     * @param {String} topic - identifier of the topic that is to be created in the bus
     * @param {EventBus} EventBus
     *
     * @memberof Publisher
     */
    constructor(topic, EventBus) {
        this.EventBus = EventBus;

        if (!this.EventBus.createTopic || !this.EventBus.publish) {
            throw new Error("[Publisher] EventBus object should have 'createTopic' and 'publish' methods");
        }

        this.topic = this.EventBus.createTopic(topic);
    }

    /**
     * Sends a message to the event bus for its own topic
     *
     * @param {String} message - the message to send to the bus
     *
     * @memberof Publisher
     */
    send(message) {
        this.EventBus.publish(message, this.topic);
    }
}

export default Publisher;
