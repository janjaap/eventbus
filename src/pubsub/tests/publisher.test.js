import EventBus from '../event-bus';
import Subscriber from '../subscriber';
import Publisher from '../publisher';

const assert = require('assert');
const chai = require('chai');

const expect = chai.expect;

const topic = '✨ a topic can be any string ✨';
const eb = new EventBus();

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

        const p = new Publisher(topic, eb);
        const peb = p.EventBus;

        it('has a reference to EventBus', function () {
            assert.strictEqual(peb, eb);
        });

        it("has a method 'send'", function () {
            expect(p.send).to.be.a('function');
        });
    });
});
