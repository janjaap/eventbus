// EventBus (instantiated), Publisher, Subscriber and Messagestore
import * as PubSub from './src/pubsub/pubsub';

// Manager, MessageRecorder and PublicationPoller
import * as Middleware from './src/middleware/middleware';

const eventBus = new PubSub.EventBus();
const messageStore = new PubSub.MessageStore(PubSub.EventBus);
const middlewareManager = new Middleware.Manager();

// using the MessageRecorder class to store messages from the EventBus in the MessageStore
middlewareManager.use(
    eventBus,
    new Middleware.MessageRecorder(messageStore),
);

const POLYFILLS_LOADED_TOPIC = 'polyfills';
const MODULES_LOADED_TOPIC = 'modules';

const polyfillPublisher = new PubSub.Publisher(POLYFILLS_LOADED_TOPIC, eventBus);
const modulePublisher = new PubSub.Publisher(MODULES_LOADED_TOPIC, eventBus);

modulePublisher.send('scrollmonitor');

// subscriber that has its callback executed when 'window_matchmedia' or 'scrollmonitor' is published
const newSubscriber = new PubSub.Subscriber(
    ['window_matchmedia', 'scrollmonitor'],
    () => { console.log('done!'); },
    eventBus,
).requireAllMessages(false);

// using the PublicationPoller class to check if messages have already been published
middlewareManager.use(
    newSubscriber,
    new Middleware.PublicationPoller(messageStore),
);

// when using the PublicationPoller, the subscribeToMany method should be called after the middleware
// manager has been instructed to use it, otherwise already published messages will not be picked up
// by the PublicationPoller
newSubscriber.subscribeToMany([POLYFILLS_LOADED_TOPIC, MODULES_LOADED_TOPIC]);

if ('matchMedia' in window) {
    polyfillPublisher.send('window_matchmedia');
}
