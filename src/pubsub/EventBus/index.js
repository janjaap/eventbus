import Publisher from './Publisher';
import Subscriber from './Subscriber';

/**
 * EventBus class
 *
 * Allows for publishers to create topics and for subscribers to register to those topics.
 * Publishers can send messages that will be distributed by the bus to all subscribers that have subscribed to the topic
 * the message is published in.
 */
class EventBus {
    /**
     * Notifies all subscribers if the publication of a specific message
     *
     * @param {array} subscribers - list of subscribers to notify
     * @param {string} message - the message to notify subscribers of
     * @param {*} payload
     */
    static notifySubscribers(subscribers, message, payload) {
        subscribers.forEach(subscriber => subscriber.process(message, payload));
    }

    /**
     * Creates an instance of EventBus
     */
    constructor() {
        this.topics = {};
    }

    /**
     * Creates a topic
     *
     * @param {string} topic - name of the topic
     */
    createTopic(topic) {
        if (!this.topicIsCreated(topic)) {
            this.topics[topic] = [];
        }
    }

    /**
     * Publish a message in a topic
     * Will send the message to all subscribers that have subscribed to listen for messages in that particular topic
     *
     * @param {string} message - identifier of the message
     * @param {string} topic - name of the topic
     * @param {*} payload - payload associated with the message
     */
    publish(message, topic, payload) {
        if (!this.topicIsCreated(topic)) {
            throw new Error(`[${this.constructor.name}] Cannot publish a message in non-existent topic '${topic}'`);
        }

        const topicSubscribers = this.topics[topic];
        EventBus.notifySubscribers(topicSubscribers, message, payload);
    }

    /**
     * Create a Publisher
     *
     * @param {string} topic - Topic to which publisher can publish messages in
     * @returns {Publisher}
     */
    publisher(topic) {
        return new Publisher(topic, this);
    }

    /**
     * Register a subscriber for a topic
     *
     * @param {Subscriber} subscriber - instance of Subscriber
     * @param {string} topic - name of the topic
     *
     * @throws {Error} When a topic has not been created yet
     */
    subscribe(subscriber, topic) {
        if (!this.topicIsCreated(topic)) {
            throw new Error(`[${this.constructor.name}] Cannot subscribe ${subscriber} to non-existent topic '${topic}'`);
        }

        this.topics[topic].push(subscriber);
    }

    /**
     * Create a subscriber
     *
     * @param {string|string[]} message - Single message or list of messages for the subscriber to listen to
     * @param {function} callback - Function that should be called when a message has been published
     * @returns {Subscriber}
     */
    subscriber(messages, callback) {
        return new Subscriber(messages, callback, this);
    }

    /**
     * Check if a topic has been created
     *
     * @param {string} topic - name of the topic
     * @returns {boolean}
     */
    topicIsCreated(topic) {
        return {}.propertyIsEnumerable.call(this.topics, topic);
    }
}

export default EventBus;
