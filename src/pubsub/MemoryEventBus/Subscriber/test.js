import MemoryEventBus from '../';
import ProbingSubscriber from './';

const eventBus = new MemoryEventBus();
const topic = '✨ a topic can be any string ✨';
const messages = [
    '🔗 a message can also be any string 📃',
    '🔗 a message can also be any string 2 📃',
    '🔗 a message can also be any string 3 📃',
];

describe('ProbingSubscriber', () => {
    describe('Instance', () => {
        it('checks if message is recorded on subscribing to topic', () => {
            eventBus.createTopic(topic);
            const s = new ProbingSubscriber(messages, () => {}, eventBus);

            eventBus.messageIsRecorded = jest.fn();

            s.subscribeTo(topic);

            expect(eventBus.messageIsRecorded).toHaveBeenCalledTimes(3);
        });
    });
});
