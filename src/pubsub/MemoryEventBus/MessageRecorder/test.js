import MessageRecorder from './';
import MessageStore from './MessageStore';

const recorder = new MessageRecorder();

describe('MessageRecorder', () => {
    describe('Instance', () => {
        it('has a MessageStore class var', () => {
            expect(recorder.messageStore instanceof MessageStore).toBe(true);
        });

        it('has publish and createTopic methods', () => {
            expect(typeof recorder.createTopic).toBe('function');
            expect(typeof recorder.publish).toBe('function');
        });
    });
});
