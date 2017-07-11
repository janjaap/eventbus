import EventBus from '../src/pubsub/event-bus';
import Publisher from '../src/pubsub/publisher';

const assert = require('assert');
const chai = require('chai');

const expect = chai.expect;

const topic = '✨ a topic can be any string ✨';

describe('Publisher', function () {
    describe('Instance', function () {
        it('throws an error when EventBus does not have required methods', function () {
            expect(function () {
                const publisher = new Publisher(topic, {});
            }).to.throw();

            expect(function () {
                const publisher = new Publisher(topic);
            }).to.throw();
        });

        const p = new Publisher(topic, EventBus);
        const peb = p.EventBus;

        it('has a reference to EventBus', function () {
            assert.strictEqual(peb, EventBus);
        });

        it("has a method 'send'", function () {
            expect(p.send).to.be.a('function');
        });
    });
});
