import EventBus from '../event-bus';
import Subscriber from '../subscriber';
import Publisher from '../publisher';

const assert = require('assert');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;

chai.use(sinonChai);

const eb = new EventBus();
const topic = '✨ a topic can be any string ✨';
const message = '🔗 a message can also be any string 📃';
const unknownTopic = 'Here be a topic that is not created first';

describe('EventBus', function () {
    describe('Instance', function () {
        it('has a default topic', function () {
            const hasDefaultTopic = eb.topicIsCreated(EventBus.defaultTopic);

            expect(eb.topicIsCreated).to.be.a('function');
            assert.strictEqual(hasDefaultTopic, true);
        });

        it('allows for creating topics', function () {
            const returnedTopic = eb.createTopic(topic);

            expect(eb.createTopic).to.be.a('function');
            assert.ok(topic === returnedTopic);
        });

        it('stores topics', function () {
            eb.createTopic(topic);
            const topicIsCreated = eb.topicIsCreated(topic);
            const unknownTopicIsCreated = eb.topicIsCreated('🚚');

            assert.strictEqual(topicIsCreated, true);
            assert.notStrictEqual(unknownTopicIsCreated, true);
        });
    });

    describe('Subscribe', function () {
        it('allowed for default topic', function () {
            const subscriber = { process: msg => msg };
            eb.subscribe(subscriber);
            const topics = eb.topics;
            const defaultTopicSubscribers = topics[EventBus.defaultTopic];

            expect(defaultTopicSubscribers).to.include(subscriber);
        });

        it('throws an error on subscribing to unknown topic', function () {
            const subscriber = { process: msg => msg };
            const spy = sinon.spy(eb, 'subscribe');

            eb.subscribe.bind(eb, subscriber, unknownTopic);

            expect(spy).to.throw();
        });
    });

    describe('Publish', function () {
        it('throws an error on publication in unknown topic', function () {
            const spy = sinon.spy(eb, 'publish');
            eb.publish.bind(eb, message, unknownTopic);

            expect(spy).to.throw(Error);
        });
    });
});
