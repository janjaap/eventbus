import Subscriber from '../../EventBus/Subscriber';

/**
 * ProbingSubscriber class
 * Will poll the event bus for already published messages in the topic it is registering to
 */
class ProbingSubscriber extends Subscriber {
    /**
     * Subscribe to one topic
     *
     * @param {string|string[]} topics
     * @returns {Subscriber}
     */
    subscribeTo(topics) {
        super.subscribeTo(topics);
        const subscribeTopics = Array.isArray(topics) ? topics : [topics];
        const { messagesToListenTo, process, EventBus } = this;

        subscribeTopics.forEach((topic) => {
            messagesToListenTo
                .filter(message => EventBus.messageIsRecorded(message, topic))
                .forEach((message) => {
                    process(message, EventBus.getPayload(message, topic));
                });
        });

        return this;
    }
}

export default ProbingSubscriber;
