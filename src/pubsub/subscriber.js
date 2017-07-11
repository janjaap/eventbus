/**
 * Subscriber class
 * Can register itself to topics that are created in the bus and listen for messages that are
 * published in those topics. All messages listened to, have to be published by the bus before the
 * subscriber's callback method is executed.
 *
 * @class Subscriber
 * @namespace PubSub
 */
export default class Subscriber {
    /**
     * Creates an instance of Subscriber.
     *
     * @param {String|Array} messages - either one message or a list of messages to listen to
     * @param {Function} callback - method to be executed when all messages have been published
     * @param {EventBus} EventBus
     * @return {Subscriber} Allows for fluent interface
     *
     * @memberof Subscriber
     */
    constructor(messages, callback, EventBus) {
        this.EventBus = EventBus;

        if (!this.EventBus.subscribe) {
            throw new Error("[Subscriber] EventBus should have a 'subscribe' method");
        }

        this.messagesToListenTo = Array.isArray(messages) ? messages : [messages];
        this.callback = callback;
        this.publishedMessages = [];
        this.needsAllMessagesForCallback = true;
    }

    /**
     * Set to true to require all messages to be published before the callback is executed. When set
     * to false, the callback is executed each time one of the messages is published.
     *
     * @memberof Subscriber
     */
    requireAllMessages(requireAll) {
        this.needsAllMessagesForCallback = requireAll;

        return this;
    }

    /**
     * Check if all messages that need to be listened to, have been published by the bus.
     *
     * @readonly
     * @memberof Subscriber
     */
    get allMessagesPublished() {
        return this.messagesToListenTo.every(message => this.isPublished(message));
    }

    /**
     * Store a published message to track which ones have been published so far
     *
     * @param {String} message - the identifier of the published message to store
     *
     * @memberof Subscriber
     */
    setPublished(message) {
        this.publishedMessages.push(message);
    }

    /**
     * Check if message to listen to has been published by the bus
     *
     * @param {String} message - the identifier of the message
     * @returns {Boolean}
     *
     * @memberof Subscriber
     */
    isPublished(message) {
        return this.publishedMessages.includes(message);
    }

    /**
     * Check if this subscriber listens for a message that has been published
     *
     * @param {String} message - the identifier of the message
     * @returns {Boolean}
     *
     * @memberof Subscriber
     */
    listensFor(message) {
        return this.messagesToListenTo.includes(message);
    }

    /**
     * Subscribe to one topic
     * Will poll the event bus for already published messages in the topic it is registering to
     *
     * @param {String} topic - identifier of the topic to subscribe to
     * @returns {Subscriber}
     *
     * @memberof Subscriber
     */
    subscribeToOne(topic) {
        this.EventBus.subscribe(this, topic);

        return this;
    }

    /**
     * Subscribe to one or more topics
     * Will poll the event bus for already published messages in the topics it is registering to
     *
     * @param {Array} topics - list of topics to subscribe to
     * @returns {Subscriber}
     *
     * @memberof Subscriber
     */
    subscribeToMany(topics) {
        topics.forEach((topic) => {
            this.EventBus.subscribe(this, topic);
        });

        return this;
    }

    /**
     * Handle a published message for a topic this subscriber has itself subscribed to
     * Will check if the message is one this subscriber is listening to and when all messages for
     * this subscriber have been published by the bus, executes the callback.
     *
     * @param {String} message - identifier of the message to handle
     *
     * @memberof Subscriber
     */
    process(message) {
        if (this.listensFor(message) && this.isPublished(message) === false) {
            this.setPublished(message);

            if (!this.needsAllMessagesForCallback) {
                this.callback(message);
            } else if (this.allMessagesPublished) {
                this.callback(message);
            }
        }
    }
}
