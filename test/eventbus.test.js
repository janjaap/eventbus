import EventBus from '../src/pubsub/event-bus';

const assert = require('assert');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;

chai.use(sinonChai);

const eventBus = new EventBus();
const topic = '✨ a topic can be any string ✨';
const message = '🔗 a message can also be any string 📃';
const unknownTopic = 'Here be a topic that is not created first';

describe('EventBus', function () {
    describe('Instance', function () {
        it('has a default topic', function () {
            const hasDefaultTopic = eventBus.topicIsCreated(eventBus.defaultTopic);

            expect(eventBus.topicIsCreated).to.be.a('function');
            assert.strictEqual(hasDefaultTopic, true);
        });

        it('allows for creating topics', function () {
            const returnedTopic = eventBus.createTopic(topic);

            expect(eventBus.createTopic).to.be.a('function');
            assert.ok(topic === returnedTopic);
        });

        it('stores topics', function () {
            eventBus.createTopic(topic);
            const topicIsCreated = eventBus.topicIsCreated(topic);
            const unknownTopicIsCreated = eventBus.topicIsCreated('🚚');

            assert.strictEqual(topicIsCreated, true);
            assert.notStrictEqual(unknownTopicIsCreated, true);
        });
    });

    describe('Subscribe', function () {
        it('allowed for default topic', function () {
            const subscriber = { process: msg => msg };
            eventBus.subscribe(subscriber);
            const topics = eventBus.topics;
            const defaultTopicSubscribers = topics[eventBus.defaultTopic];

            expect(defaultTopicSubscribers).to.include(subscriber);
        });

        it('throws an error on subscribing to unknown topic', function () {
            const subscriber = { process: msg => msg };
            const spy = sinon.spy(eventBus, 'subscribe');

            eventBus.subscribe.bind(eventBus, subscriber, unknownTopic);

            expect(spy).to.throw();
        });
    });

    describe('Publish', function () {
        it('throws an error on publication in unknown topic', function () {
            const spy = sinon.spy(eventBus, 'publish');
            eventBus.publish.bind(eventBus, message, unknownTopic);

            expect(spy).to.throw(Error);
        });
    });
});
