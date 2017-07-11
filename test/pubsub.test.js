import EventBus from '../src/pubsub/event-bus';
import Subscriber from '../src/pubsub/subscriber';
import Publisher from '../src/pubsub/publisher';

const assert = require('assert');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;

chai.use(sinonChai);

const topic = '✨ a topic can be any string ✨';
const message = '🔗 a message can also be any string 📃';

describe('PubSub', function () {
    describe('Publisher', function () {
        const p = new Publisher(topic, EventBus);
        const pt = p.topic;
        const peb = p.EventBus;

        it('routes topic creation to the EventBus', function () {
            assert.strictEqual(peb.topicIsCreated(pt), true);
        });

        it('routes sent messages to the eventbus', function () {
            p.send(message);

            expect(EventBus.publish).to.have.been.calledWith(message, pt);
        });

        it('sends messages that has the EventBus call all of its topic subscribers', function () {
            const callbackSpy1 = sinon.spy();
            const callbackSpy2 = sinon.spy();

            const s1 = new Subscriber(message, callbackSpy1, EventBus);
            const s2 = new Subscriber(message, callbackSpy2, EventBus);

            const topic2 = `${topic}2`;

            // create a subscriber that doesn't receive the message
            EventBus.createTopic(topic2);
            EventBus.subscribe(s2, topic2);

            // subscriber that should receive the message
            EventBus.subscribe(s1);
            EventBus.publish(message);

            expect(callbackSpy1).to.have.been.called;
            expect(callbackSpy2).to.have.not.been.called;
        });
    });

    describe('Subscriber', function () {
        let s = null;

        beforeEach(function () {
            s = new Subscriber(message, function () { }, EventBus);
        });

        it('routes a subscription to the eventbus', function () {
            s.subscribeToOne(EventBus.defaultTopic);
            const defaultTopicSubscribers = s.EventBus.topics[EventBus.defaultTopic];

            expect(s.subscribeToOne).to.be.a('function');
            expect(defaultTopicSubscribers).to.include(s);
        });

        it('routes multiple subscriptions to the eventbus', function () {
            s.subscribeToOne(EventBus.defaultTopic);
            s.EventBus.createTopic(topic);
            s.subscribeToOne(topic);

            const defaultTopicSubscribers = s.EventBus.topics[EventBus.defaultTopic];
            const otherTopicSubscribers = s.EventBus.topics[topic];

            expect(s.subscribeToMany).to.be.a('function');
            expect(defaultTopicSubscribers).to.include(s);
            expect(otherTopicSubscribers).to.include(s);
        });
    });
});
