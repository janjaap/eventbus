/**
 * Subscriber class
 * Can register itself to topics that are created in the bus and listen for messages that are published in those topics.
 * All messages listened to, have to be published by the bus before the subscriber's callback method is executed.
 */
class Subscriber {
    /**
     * Creates an instance of Subscriber.
     *
     * @param {(string|string[])} messages - either one message or a list of messages to listen to
     * @param {function} callback - method to be executed when all messages have been published
     * @param {EventBus} EventBus - Bus to which this subscriber registers itself
     */
    constructor(messages, callback, EventBus) {
        this.EventBus = EventBus;

        if (!this.EventBus.subscribe) {
            throw new Error(`[${this.constructor.name}] EventBus should have a 'subscribe' method`);
        }

        this.messagesToListenTo = (Array.isArray(messages) ? messages : [messages])
            .filter(message => message && typeof message === 'string' && message.trim().length > 0);
        this.callback = callback;
        this.process = this.process.bind(this);
        // no messages provided; respond to all messages in the topic this subscriber is listening to
        this.processAllMessages = this.messagesToListenTo.length === 0;
    }

    /**
     * Will change the subscriber's response method; calling processAll will have the subscriber's callback method be
     * executed for all messages that have been published in the topic the subscriber has been subscriber to.
     *
     * @param {boolean} [shouldProcessAll=true]
     * @return {Subscriber}
     */
    processAll(shouldProcessAll = true) {
        this.processAllMessages = shouldProcessAll;
        return this;
    }

    /**
     * Check if this subscriber listens for a specific message to be published
     *
     * @param {string} message - the identifier of the message
     * @returns {boolean}
     */
    listensFor = message => this.processAllMessages || this.messagesToListenTo.includes(message)

    /**
     * Subscribe to one or more topic
     *
     * @param {(string|string[])} topics - single topic or list of topics
     * @return {Subscriber}
     */
    subscribeTo(topics) {
        const subscribeTopics = Array.isArray(topics) ? topics : [topics];

        subscribeTopics.forEach(topic => this.EventBus.subscribe(this, topic));

        return this;
    }

    /**
     * Handle a published message for a topic this subscriber has itself subscribed to
     * Will check if the message is one this subscriber is listening to and when all messages for
     * this subscriber have been published by the bus, executes the callback.
     *
     * @param {string} message - identifier of the message to handle
     * @param {*} payload - payload associated with the message
     */
    process(message, payload) {
        if (this.listensFor(message) === false) {
            return;
        }

        this.callback(message, payload);
    }
}

export default Subscriber;
