import MessageStore from './';

let messageStore = null;
const DEFAULT_TOPIC = 'default';

describe('MessageStore', () => {
    beforeEach(() => {
        messageStore = new MessageStore();
        messageStore.createTopic(DEFAULT_TOPIC);
    });

    describe('Instance', () => {
        it('can store a topic', () => {
            expect(messageStore.topicExists(DEFAULT_TOPIC)).toBe(true);
        });

        it.skip('can store a message', () => {
            expect(messageStore.messageIsRecorded('foo', DEFAULT_TOPIC)).toBe(true);
        });

        it('can store a message with payload', () => {
            const payload = { foo: 'bar' };
            messageStore.record('foo', DEFAULT_TOPIC, payload);
            expect(messageStore.getPayload('foo', DEFAULT_TOPIC)).toBe(payload);
        });
    });
});
