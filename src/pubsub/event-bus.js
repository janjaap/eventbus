/**
 * EventBus class
 *
 * Allows for publishers to create topics and for subscribers to register to those topics.
 * Publishers can send messages that will be distributed by the bus to all subscribers that have
 * subscribed to the topic the message is published in.
 * Any message that is published without a topic will be published in the '__global__' topic.
 *
 * @class EventBus
 * @namespace PubSub
 */
export default class EventBus {
    /**
     * Creates an instance of EventBus.
     *
     * @memberof EventBus
     */
    constructor() {
        this.defaultTopic = '__global__';
        this.topics = {};
        this.topics[this.defaultTopic] = [];
    }

    setDefaultTopic(topic) {
        this.defaultTopic = topic;
    }

    /**
     * Creates a topic
     *
     * @param {String} [topic] - name of the topic
     * @returns {String} topic - name of the topic
     *
     * @memberof EventBus
     */
    createTopic(topic) {
        if (!this.topicIsCreated(topic)) {
            this.topics[topic] = [];
        }

        return topic;
    }

    /**
     * Publish a message in a topic
     * Will send the message to all subscribers that have subscribed to listen for messages in that
     * particular topic.
     *
     * @param {String} message - identifier of the message
     * @param {String} [topic=EventBus.defaultTopic] - name of the topic
     *
     * @memberof EventBus
     */
    publish(message, topic = this.defaultTopic) {
        if (!this.topicIsCreated(topic)) {
            throw new Error(`[EventBus] Cannot publish a message in non-existent topic '${topic}'`);
        }

        const topicSubscribers = this.topics[topic];
        EventBus.notifySubscribers(topicSubscribers, message);
    }

    /**
     * Register a subscriber for a topic
     *
     * @param {Subscriber} subscriber - instance of Subscriber
     * @param {String} [topic=EventBus.defaultTopic] - name of the topic
     *
     * @throws {Error} - Whenever a topic has not been created yet
     * @memberof EventBus
     */
    subscribe(subscriber, topic = this.defaultTopic) {
        if (!this.topicIsCreated(topic)) {
            throw new Error(`[EventBus] Cannot subscribe ${subscriber} to non-existent topic '${topic}'`);
        }

        this.topics[topic].push(subscriber);
    }

    /**
     * Check if a topic has been created
     *
     * @param {String} topic - name of the topic
     * @returns {Boolean}
     *
     * @memberof EventBus
     */
    topicIsCreated(topic) {
        return {}.propertyIsEnumerable.call(this.topics, topic);
    }

    /**
     * Notifies all subscribers if the publication of a specific message
     *
     * @static
     * @param {Array} subscribers - list of subscribers to notify
     * @param {String} message - the message to notify subscribers of
     *
     * @memberof EventBus
     */
    static notifySubscribers(subscribers, message) {
        subscribers.forEach(subscriber => subscriber.process(message));
    }
}
