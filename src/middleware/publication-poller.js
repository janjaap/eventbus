/**
 * PublicationPoller Class
 *
 * Hooks into Subscriber.subscribeToOne and Subscriber.subscribeToMany methods and polls for
 * messages that have already been published through the EventBus and, if so, processes those
 * message for the current Subscriber.
 *
 * @class PublicationPoller
 * @namespace Middleware
 */
class PublicationPoller {
    /**
     * Creates an instance of PublicationPoller
     *
     * @param {MessageStore} messageStore - message store object
     *
     * @memberof PublicationPoller
     */
    constructor(messageStore) {
        this.messageStore = messageStore;

        /**
         * Checks the event bus for already published messages for the given target object
         *
         * @param {Object} target - Subscriber object
         * @param {String} topic - the topic to request published messages for
         */
        this.pollPublishedMessages = (target, topic) => {
            target.messagesToListenTo
                .filter(message => this.messageStore.messageIsRecorded(message, topic))
                .forEach((message) => {
                    target.process(message);
                });
        };
    }

    /**
     * Polls for messages in a topic
     *
     * @param {Object} target - reference to Subscriber instance
     * @returns {Function}
     *
     * @memberof PublicationPoller
     */
    subscribeToOne(target) {
        return next => (topic) => {
            const result = next(topic);

            this.pollPublishedMessages(target, topic);

            return result;
        };
    }

    /**
     * Polls for messages in multiple topics
     *
     * @param {Object} target - reference to Subscriber instance
     * @returns {Function}
     *
     * @memberof PublicationPoller
     */
    subscribeToMany(target) {
        return next => (topics) => {
            const result = next(topics);

            topics.forEach(topic => this.pollPublishedMessages(target, topic));

            return result;
        };
    }
}

export default PublicationPoller;
