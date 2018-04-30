import EventBus from '../';
import Publisher from './';

const eventBus = new EventBus();
const topic = '✨ a topic can be any string ✨';
const message = '🔗 a message can also be any string 📃';

describe('Publisher', () => {
    describe('Instance', () => {
        it('throws an error when EventBus does not have required methods', () => {
            expect(() => {
                const publisher = new Publisher(topic, {}); // eslint-disable-line no-unused-vars
            }).toThrow();

            expect(() => {
                const publisher = new Publisher(topic); // eslint-disable-line no-unused-vars
            }).toThrow();
        });

        const p = new Publisher(topic, eventBus);
        const pt = p.topic;
        const peb = p.EventBus;

        it('has a reference to EventBus', () => {
            expect(peb).toBe(eventBus);
        });

        it("has a method 'send'", () => {
            expect(typeof p.send).toBe('function');
        });

        it('routes topic creation to the EventBus', () => {
            expect(peb.topicIsCreated(pt)).toBe(true);
        });

        it('routes sent messages to the eventbus', () => {
            EventBus.prototype.publish = jest.fn();
            p.send(message);

            expect(EventBus.prototype.publish).toHaveBeenCalledWith(message, pt);
        });
    });
});
