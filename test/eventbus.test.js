import EventBus from '../src/pubsub/event-bus';

const assert = require('assert');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;

chai.use(sinonChai);

const topic = '✨ a topic can be any string ✨';
const message = '🔗 a message can also be any string 📃';
const unknownTopic = 'Here be a topic that is not created first';

describe('EventBus', function () {
    describe('Instance', function () {
        it('has a default topic', function () {
            const hasDefaultTopic = EventBus.topicIsCreated(EventBus.defaultTopic);

            expect(EventBus.topicIsCreated).to.be.a('function');
            assert.strictEqual(hasDefaultTopic, true);
        });

        it('allows for creating topics', function () {
            const returnedTopic = EventBus.createTopic(topic);

            expect(EventBus.createTopic).to.be.a('function');
            assert.ok(topic === returnedTopic);
        });

        it('stores topics', function () {
            EventBus.createTopic(topic);
            const topicIsCreated = EventBus.topicIsCreated(topic);
            const unknownTopicIsCreated = EventBus.topicIsCreated('🚚');

            assert.strictEqual(topicIsCreated, true);
            assert.notStrictEqual(unknownTopicIsCreated, true);
        });
    });

    describe('Subscribe', function () {
        it('allowed for default topic', function () {
            const subscriber = { process: msg => msg };
            EventBus.subscribe(subscriber);
            const topics = EventBus.topics;
            const defaultTopicSubscribers = topics[EventBus.defaultTopic];

            expect(defaultTopicSubscribers).to.include(subscriber);
        });

        it('throws an error on subscribing to unknown topic', function () {
            const subscriber = { process: msg => msg };
            const spy = sinon.spy(EventBus, 'subscribe');

            EventBus.subscribe.bind(EventBus, subscriber, unknownTopic);

            expect(spy).to.throw();
        });
    });

    describe('Publish', function () {
        it('throws an error on publication in unknown topic', function () {
            const spy = sinon.spy(EventBus, 'publish');
            EventBus.publish.bind(EventBus, message, unknownTopic);

            expect(spy).to.throw(Error);
        });
    });
});
