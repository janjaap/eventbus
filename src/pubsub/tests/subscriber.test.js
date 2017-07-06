import EventBus from '../event-bus';
import Subscriber from '../subscriber';
import Publisher from '../publisher';

const assert = require('assert');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;

chai.use(sinonChai);

const message = '🔗 a message can also be any string 📃';
const messages = [
    '🔗 a message can also be any string 📃',
    '🔗 a message can also be any string 2 📃',
    '🔗 a message can also be any string 3 📃',
];
const callback = function () { console.log('yep'); };
let s = null;
const eb = new EventBus();

describe('Subscriber', function () {
    beforeEach(function () {
        s = new Subscriber(message, callback, eb);
    });

    describe('Instance', function () {
        it('throws an error when EventBus does not have required method', function () {
            expect(function () {
                s = new Subscriber(message, callback, {});
            }).to.throw();

            expect(function () {
                s = new Subscriber(message, callback);
            }).to.throw();
        });

        it('can receive a single message to listen to', function () {
            expect(s.listensFor).to.be.a('function');
            assert.strictEqual(s.listensFor(message), true);
        });

        it('can receive an array of messages to listen to', function () {
            s = new Subscriber(messages, callback, eb);

            expect(s.listensFor).to.be.a('function');
            assert.strictEqual(s.listensFor(messages[0]), true);
            assert.strictEqual(s.listensFor(messages[1]), true);
            assert.strictEqual(s.listensFor(messages[2]), true);
        });

        it("has a method 'subscribeToOne'", function () {
            expect(s.subscribeToOne).to.be.a('function');
        });

        it("has a method 'subscribeToMany'", function () {
            expect(s.subscribeToMany).to.be.a('function');
        });

        it("has a method 'process'", function () {
            expect(s.process).to.be.a('function');
        });
    });


    describe('Process', function () {
        it('executes the callback when its message has been published', function () {
            const cb = sinon.spy();
            s = new Subscriber(message, cb, eb);

            expect(cb).to.have.not.been.called;
            s.process(message);
            expect(cb).to.have.been.called;
        });

        it('executes the callback each time a message has been published', function () {
            const cb = sinon.spy();
            s = new Subscriber(messages, cb, eb);

            s.requireAllMessages(false);

            s.process(messages[0]);
            expect(cb).to.have.been.called;

            s.process(messages[1]);
            expect(cb).to.have.been.called;

            s.process(messages[2]);
            expect(cb).to.have.been.called;
        });

        it('executes the callback when all messages have been published', function () {
            const cb = sinon.spy();
            s = new Subscriber(messages, cb, eb);

            s.process(messages[0]);
            expect(cb).to.have.not.been.called;

            s.process(messages[1]);
            expect(cb).to.have.not.been.called;

            s.process(messages[2]);
            expect(cb).to.have.been.called;

            assert.strictEqual(s.allMessagesPublished, true);
        });
    });
});
