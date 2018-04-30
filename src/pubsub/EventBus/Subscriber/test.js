import EventBus from '../';
import Subscriber from './';

const eventBus = new EventBus();
const DEFAULT_TOPIC = 'default';
eventBus.createTopic(DEFAULT_TOPIC);
const topic = '✨ a topic can be any string ✨';
const messages = [
    '🔗 a message can also be any string 📃',
    '🔗 a message can also be any string 2 📃',
    '🔗 a message can also be any string 3 📃',
];
const message = messages[0];
const callback = () => {};

describe('Subscriber', () => {
    describe('Instance', () => {
        it('throws an error when EventBus does not have required method', () => {
            expect(() => {
                const s = new Subscriber(message, callback, {}); // eslint-disable-line no-unused-vars
            }).toThrow();

            expect(() => {
                const s = new Subscriber(message, callback); // eslint-disable-line no-unused-vars
            }).toThrow();
        });

        it('can receive a single message to listen to', () => {
            const s = new Subscriber(message, callback, eventBus);

            expect(typeof s.listensFor).toBe('function');
            expect(s.listensFor(message)).toBe(true);
        });

        it('can receive an array of messages to listen to', () => {
            const s = new Subscriber(messages, callback, eventBus);

            expect(s.listensFor(messages[0])).toBe(true);
            expect(s.listensFor(messages[1])).toBe(true);
            expect(s.listensFor(messages[2])).toBe(true);
        });

        it('routes a subscription to the eventbus', () => {
            const s = new Subscriber(messages, callback, eventBus);
            s.subscribeTo(DEFAULT_TOPIC);
            const topicSubscribers = s.EventBus.topics[DEFAULT_TOPIC];

            expect(topicSubscribers.includes(s)).toBe(true);
        });

        it('routes multiple subscriptions to the eventbus', () => {
            const s = new Subscriber(messages, callback, eventBus);
            s.subscribeTo(DEFAULT_TOPIC);
            s.EventBus.createTopic(topic);
            s.subscribeTo(topic);

            const topicSubscribers = s.EventBus.topics[DEFAULT_TOPIC];
            const otherTopicSubscribers = s.EventBus.topics[topic];

            expect(topicSubscribers.includes(s)).toBe(true);
            expect(otherTopicSubscribers.includes(s)).toBe(true);
        });
    });

    describe('Process', () => {
        it('executes the callback when its message has been published', () => {
            const cb = jest.fn();
            const s = new Subscriber(message, cb, eventBus);

            expect(cb).toHaveBeenCalledTimes(0);
            s.process(message);
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('executes callback as many times as a message is published', () => {
            const cb = jest.fn();
            const s = new Subscriber(message, cb, eventBus);

            s.process(message);
            s.process(message);
            s.process(message);
            expect(cb).toHaveBeenCalledTimes(3);
        });

        it('filters out falsy values', () => {
            const s1 = new Subscriber([false, null, '', NaN], () => {}, eventBus);
            expect(s1.messagesToListenTo).toHaveLength(0);
            expect(s1.processAllMessages).toBe(true);

            const s2 = new Subscriber([false, null, 'foo', NaN], () => {}, eventBus);
            expect(s2.messagesToListenTo).toHaveLength(1);
            expect(s2.processAllMessages).toBe(false);
        });

        it('executes callback every time a message is published', () => {
            const cb = jest.fn();
            const s = new Subscriber([], cb, eventBus);
            const FAKE_NEWS = 'fake news!!!1!';

            eventBus.createTopic(FAKE_NEWS);
            eventBus.subscribe(s, FAKE_NEWS);
            s.processAll();

            eventBus.publish(messages[0], FAKE_NEWS);
            eventBus.publish(messages[1], FAKE_NEWS);
            eventBus.publish(messages[2], FAKE_NEWS);
            expect(cb).toHaveBeenCalledTimes(3);
        });
    });
});
