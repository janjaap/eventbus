import MemoryEventBus from './';
import MessageRecorder from './MessageRecorder';

let eventBus;
const DEFAULT_TOPIC = 'default';

describe('MemoryEventBus', () => {
    beforeEach(() => {
        eventBus = new MemoryEventBus();
        eventBus.createTopic(DEFAULT_TOPIC);
    });

    describe('Instance', () => {
        it('has a MessageRecorder class var', () => {
            expect(eventBus.messageRecorder).not.toBeUndefined();
            expect(eventBus.messageRecorder instanceof MessageRecorder).toBe(true);
        });

        it('stores a message', () => {
            eventBus.publish('foo', DEFAULT_TOPIC);
            expect(eventBus.messageIsRecorded('foo', DEFAULT_TOPIC)).toBe(true);
        });
    });
});
