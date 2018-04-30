import EventBus from './';
import Publisher from './Publisher';
import Subscriber from './Subscriber';

let eventBus;
const DEFAULT_TOPIC = 'default';
const ERROR_TOPIC = 'errors';
const topic = '✨ a topic can be any string ✨';
const message = '🔗 a message can also be any string 📃';
const unknownTopic = 'Here be a topic that is not created first';

describe('EventBus', () => {
    beforeEach(() => {
        eventBus = new EventBus();
        eventBus.createTopic(DEFAULT_TOPIC);
    });

    describe('Instance', () => {
        it('stores topics', () => {
            eventBus.createTopic(topic);
            const topicIsCreated = eventBus.topicIsCreated(topic);
            const unknownTopicIsCreated = eventBus.topicIsCreated('🚚');

            expect(topicIsCreated).toBe(true);
            expect(unknownTopicIsCreated).toBe(false);
        });

        it('returns a Publisher', () => {
            const publisher = eventBus.publisher(topic);
            expect(publisher).toBeInstanceOf(Publisher);
        });

        it('returns a Subscriber', () => {
            const subscriber = eventBus.subscriber(message, () => {});
            expect(subscriber).toBeInstanceOf(Subscriber);
        });
    });

    describe('Subscribe', () => {
        it('allows for subscribing to default topic', () => {
            const subscriber = eventBus.subscriber(message);
            eventBus.subscribe(subscriber, DEFAULT_TOPIC);
            const { topics } = eventBus;
            const topicSubscribers = topics[DEFAULT_TOPIC];

            expect(topicSubscribers.includes(subscriber)).toBe(true);
        });

        it('throws when subscribing to unknown topic', () => {
            const subscriber = eventBus.subscriber(message);

            expect(() => {
                eventBus.subscribe(subscriber, unknownTopic);
            }).toThrow();
        });
    });

    describe('Publish', () => {
        it('throws when publishing in unknown topic', () => {
            expect(() => {
                eventBus.publish(message, unknownTopic);
            }).toThrow();
        });

        it('notifies all subscribers', () => {
            const { process } = Subscriber.prototype;
            Subscriber.prototype.process = jest.fn();

            const s1 = eventBus.subscriber('load', () => {});
            const s2 = eventBus.subscriber('load', () => {});

            eventBus.subscribe(s1, DEFAULT_TOPIC);
            eventBus.subscribe(s2, DEFAULT_TOPIC);

            eventBus.publish('foo', DEFAULT_TOPIC);

            expect(Subscriber.prototype.process).toHaveBeenCalledTimes(2);

            Subscriber.prototype.process = process;
        });

        it('executes subscriber callback functions', () => {
            eventBus.createTopic(ERROR_TOPIC);

            const s3Cb = jest.fn();
            const s4Cb = jest.fn();

            const s3 = eventBus.subscriber('404', s3Cb);
            const s4 = eventBus.subscriber('blah', s4Cb);

            s3.subscribeTo(DEFAULT_TOPIC);
            s4.subscribeTo(ERROR_TOPIC);

            eventBus.publish('404', DEFAULT_TOPIC);

            expect(s3Cb).toHaveBeenCalledTimes(1);
            expect(s4Cb).toHaveBeenCalledTimes(0);
        });
    });
});
