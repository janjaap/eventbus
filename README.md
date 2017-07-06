# Eventbus
The EventBus package enables asynchronous message handling and features two different modules; the PubSub module and the Middleware module. Asynchronous messages can be used to overcome dependencies between  (stateful) modules on a page or to prevent [callback hell](http://callbackhell.com/).

## PubSub module
This module consists of three core classes; EventBus, Publisher, Subscriber and a helper class; MessageStore. The EventBus is responsible for registering topics (or message categories), keeping track of subscribers and routing published messages to those subscribers that have a subscription that matches the published message.

A publisher is nothing more than a topic owner. All messages that are published by a particular publisher, will only be available in the topic that is owned by that publisher.

A subscriber can subscribe its callback to any number of topics and any number of messages.

The MessageStore can record messages and can be used as middleware for the EventBus.

---

### Example (synchronous messaging)
#### Flow
```
- Instantiate EventBus
- Create topic
- Subscribe to topic
- Publish message
- Execute callback

              process message
      +-----------------------------+
      |                             |
+-----v------+                      |
|            |  subscribe           |
| Subscriber +-------------+        |
|            |             |        |
+------------+             |  +-----+----+
                           |  |          |
                           +--+ EventBus |
                              |          |
                              +---^--^---+
                                  |  |
   +-----------+  create topic    |  |
   |           +------------------+  |
   | Publisher |                     |
   |           +---------------------+
   +-----------+  publish message

```

#### 1. Instantiate the EventBus
```javascript
const eventBus = new PubSub.EventBus();
```

#### 2. Create topics
```javascript
/**
 * A topic can be any string and will act as a container in which messages can be published
 */
const POLYFILLS_LOADED_TOPIC = '✨polyfills✨';
const THIRD_PARTY_LOADED_TOPIC = '3rd-party';
const UI_TOPIC = 'user_interactions';
```

#### 3. Create publishers
```javascript
/**
 * A Publisher object takes two arguments; the topic and an EventBus instance. The Publisher will
 * register the topic in the EventBus. Any messages that are published by a Publisher will only be
 * published in the topic that the Publisher registered in the event bus.
 */
const polyfillPublisher = new PubSub.Publisher(POLYFILLS_LOADED_TOPIC, eventBus);
const thirdPartyPublisher = new PubSub.Publisher(THIRD_PARTY_LOADED_TOPIC, eventBus);
const guiPublisher = new PubSub.Publisher(UI_TOPIC, eventBus);
```

It is not strictly necessary to use a Publisher object to have messages published with the EventBus. The above three publishers will, on instantiation, call the EventBus to create a topic and, on publishing messages, call the EventBus again. Thus, the above example could also be:

```javascript
eventBus.createTopic(POLYFILLS_LOADED_TOPIC);
eventBus.createTopic(THIRD_PARTY_LOADED_TOPIC);
eventBus.createTopic(UI_TOPIC);
```

#### 4. Create a subscriber
```javascript
/**
 * A Subscriber can subscribe itself to one or more topics and listen for publication of one
 * or more messages that are published in those topics.
 *
 * The scrollDetectorSubscriber subscriber will:
 * - subscribe itself to the topics '✨polyfills✨' and '3rd-party'
 * - listen for the publication of the messages 'window_matchmedia' and 'scrollmonitor'
 * - execute its callback when both messages have been published
 */
const scrollDetectorSubscriber = new PubSub.Subscriber(
    ['window_matchmedia', 'scrollmonitor'],
    () => debugger,
).subscribeToMany([POLYFILLS_LOADED_TOPIC, THIRD_PARTY_LOADED_TOPIC]);

/**
 * The userClickedSubscriber subscriber will:
 * - subscribe itself to the topic 'user_interactionss'
 * - listen for the publication of the messages 'button_clicked' and 'checkbox_checked'
 * - execute its callback when each of those messages has been published
 */
const userClickedSubscriber = new PubSub.Subscriber(['button_clicked', 'checkbox_checked'],
    () => { console.log('Button clicked!'); },
).subscribeToOne(UI_TOPIC)
    .requireAllMessages(false);
```

Note that, in order to register a subscriber with the EventBus, the topic (or topics) that the subscriber subscribes itself to, have to already be created in the EventBus.

#### 5. Publish messages
```javascript
// feature detecting
if ('matchMedia' in window) {
    polyfillPublisher.send('window_matchmedia');
}

// 3rd-party dependency loading, in this example with loadJS
window.loadJS('//cdnjs.cloudflare.com/ajax/libs/scrollmonitor/1.2.0/scrollMonitor.js', () =>
    thirdPartyPublisher.send('scrollmonitor');
);

// interacting with GUI elements
buttonElement.addEventListener('click', () => guiPublisher.send('button_clicked'));
checkboxElement.addEventListener('change', () => guiPublisher.send('checkbox_checked'));
```

As with creating publishers aa topic owners, it's also not required to have messages published by means of a Publisher object. The EventBus can be called directly, like so:
```javascript
eventBus.publish('window_matchmedia', POLYFILLS_LOADED_TOPIC);
eventBus.publish('scrollmonitor', THIRD_PARTY_LOADED_TOPIC);
```

Publishing messages before subscribers have subscribed to them will not lead to the subscriber callback being called. This asynchronous behaviour can be achieved by making use of the middleware module.

## Middleware module
The Middleware module has a Manager class that allows for middleware class objects to hook into other classes so that actions can be performed before or after the original class method has executed. It's also possible to complete override the class method.
Next to the Manager class, the Middleware module has the MessageRecorder as well as the PublicationPoller helper classes.

---

### Using the middleware manager

The middleware manager chains its middleware class instances so that they are executed in the order they are defined in the manager's `use` method. Each middleware class has access to the target object.

Take the following (simplified) example:
```javascript
// class responsible for storing topics
class EventBus {
    constructor() {
        this.subscribers = [];
    }

    publish(message) {
        this.subscribers.forEach(subscriber => subscriber.process(message));
    }
}

// class responsible for storing messages
class MessageStore {
    constructor() {
        this.messages = [];
    }

    record(message) {
        this.messages.push(message);
    }
}

// middleware class
class MessageVerifier {
    // replace invalid characters in messages
    publish(target) {
        return next => (message, topic) => {
            message = message.replace(/[\|&;\$%@"<>\(\)\+,]/g, '');

            return next(message, topic);
        };
    }
}

// middleware class
class MessageRecorder {
    constructor(messageStor) {
        this.messageStore = messageStore;
    }

    // store published messages in a separate store
    publish(target) {
        return next => (message, topic) => {
            const result = next(topic);

            this.messageStore.record(message);

            return result;
        };
    }
}

const eventBus = new EventBus();

middlewareManager.use(
    eventBus,
    MessageVerifier,
    MessageRecorder,
);
```

Both middleware classes hook into the EventBus' `publish()` method. The `MessageVerifier` middleware class prepends its functionality by removing invalid charactes from the passed in `message` parameter value and then passing that value on to the next middleware class in line. If a middleware class object is the last in line, calling `next()` will be equal to calling the method of the target object that the middleware class hooks into. Returning `false` from any method in a middleware class will break the chain and stop execution.

The `MessageRecorder` middleware class appends its functionality to the target method by calling `next()` first, storing the value for the `message` parameter and then returning the result of the call to `next()`.

### Example (Asynchronous messaging)

Subscribers can subscribe to messages that have already been published in a topic that a subscriber creates a subscription for. Messages that a subscriber wants to listen to can be stored in a separate message store, so that any subscriber can be notified whenever it subscribes to a topic where messages, that it wants to listen to, have already been published.

#### Flow
```
- Instantiate EventBus
- Publish message
- Create topic
- Publish message
- Subscribe to topic
- Execute callback

                                 process message
              +----------------------------^---------------------+
              |                            |                     |
              |                            |                     |
              |                            |                     |
        +-----v------+           +---------+---------+           |
        |            | subscribe |                   |           |
        | Subscriber +-----------> PublicationPoller +--+        |
        |            |           |                   |  |        |
        +------------+           +---------+---------+  |        |
                                           |            |        |
                                           |            |   +----+-----+
                                           |            |   |          |
                                   isMessageRecorded    +---+ EventBus |
                                           |                |          |
                                           |                +--^----^--+
                                           |                   |    |
+-----------+    create topic     +--------v--------+          |    |
|           +--------------------->                 +----------+    |
| Publisher |                     | MessageRecorder |               |
|           +--------------------->                 +---------------+
+-----------+   publish message   +----+--------+---+
                                       |        |
                                     create   publish
                                     topic    message
                                       |        |
                                    +--v--------v--+
                                    |              |
                                    | MessageStore |
                                    |              |
                                    +--------------+
```

#### 1. Main actors
```javascript
const eventBus = new PubSub.EventBus();
const middlewareManager = new Middleware.Manager();
const messageStore = new PubSub.MessageStore(eventBus);
const publicationPoller = new Middleware.PublicationPoller(messageStore);

// topics
const POLYFILLS_LOADED_TOPIC = '✨polyfills✨';
const THIRD_PARTY_LOADED_TOPIC = '3rd-party';
const UI_TOPIC = 'user_interactions';

// publishers
const polyfillPublisher = new PubSub.Publisher(POLYFILLS_LOADED_TOPIC, eventBus);
const thirdPartyPublisher = new PubSub.Publisher(THIRD_PARTY_LOADED_TOPIC, eventBus);
const guiPublisher = new PubSub.Publisher(UI_TOPIC, eventBus);

// subscriber
const otherSubscriber = new PubSub.Subscriber(
    ['message#1', 'message#2'],
    () => debugger,
).subscribeToMany([POLYFILLS_LOADED_TOPIC, THIRD_PARTY_LOADED_TOPIC]);
```

#### 2. Using the middleware manager
The middleware manager's main method is `use(target, ...middlewares)`. The first parameter is the target that the rest of the parameters will act as middleware for.

A middleware class object should contain all those methods that it needs to hook into from the target object.

```javascript
/**
 * First, we'll hook a middleware class into the EventBus class instance so that we can catch all
 * the messages that are published through the bus.
 * The MessageRecorder class uses the MessageStore instance to record all the messages
 */
middlewareManager.use(
    eventBus,
    new Middleware.MessageRecorder(messageStore),
);

/**
 * Then we hook a PublicationPoller middleware class instance into the previously created subscriber
 * and pass in the same MessageStore class instance to the PublicationPoller.
 */
middlewareManager.use(
    otherSubscriber,
    new Middleware.PublicationPoller(messageStore),
);
```

The above construct will persist messages for later use. However, messages will only be persisted when the `MessageRecorder` middleware class instance has been hooked into the EventBus. Messages that are published before that, are lost and cannot be acted upon at a later point in time.



