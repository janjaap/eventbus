!function(e){if("includes"in Array.prototype)e();else{var r=document.createElement("script");r.src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Array.prototype.includes",r.onload=e,r.onerror=function(){console.error("Could not load polyfills script!"),e()},document.head.appendChild(r)}}(function(){!function(e){function __webpack_require__(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,__webpack_require__),n.l=!0,n.exports}var r={};__webpack_require__.m=e,__webpack_require__.c=r,__webpack_require__.d=function(e,r,t){__webpack_require__.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:t})},__webpack_require__.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return __webpack_require__.d(r,"a",r),r},__webpack_require__.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s="./index.js")}({"./index.js":function(e,r,t){"use strict";function _interopRequireWildcard(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(r[t]=e[t]);return r.default=e,r}var n=t("./src/pubsub/pubsub.js"),s=_interopRequireWildcard(n),i=t("./src/middleware/middleware.js"),u=_interopRequireWildcard(i),o=new s.MessageStore(s.EventBus),a=new u.Manager;a.use(s.EventBus,new u.MessageRecorder(o));var c=new s.Publisher("polyfills",s.EventBus);new s.Publisher("modules",s.EventBus).send("scrollmonitor");var l=new s.Subscriber(["window_matchmedia","scrollmonitor"],function(){console.log("done!")},s.EventBus).requireAllMessages(!1);a.use(l,new u.PublicationPoller(o)),l.subscribeToMany(["polyfills","modules"]),"matchMedia"in window&&c.send("window_matchmedia")},"./src/middleware/manager.js":function(e,r,t){"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&defineProperties(e.prototype,r),t&&defineProperties(e,t),e}}(),s=function(){function Manager(){_classCallCheck(this,Manager),this.middlewareFunctions={}}return n(Manager,[{key:"createClassEntry",value:function(e){!1==={}.propertyIsEnumerable.call(this.middlewareFunctions,e)&&(this.middlewareFunctions[e]=[])}},{key:"createMethodEntry",value:function(e,r){this.middlewareFunctions[e][r]||(this.middlewareFunctions[e][r]=[])}},{key:"use",value:function(e){var r=this,t=e.constructor.name;this.createClassEntry(t);for(var n=arguments.length,s=Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return s.forEach(function(n){Manager.getClassMethodNames(n).forEach(function(s){var i=n[s].bind(n);r.createMethodEntry(t,s),r.middlewareFunctions[t][s].unshift(i(e))})}),Object.keys(this.middlewareFunctions[t]).forEach(function(n){var s=e[n];if(!s)throw new Error("[Manager] Target method '"+n+"' does not exist");var i=s.bind(e),u=r.middlewareFunctions[t][n],o=Manager.compose(u)(i);e[n]=o}),this}}],[{key:"getClassMethodNames",value:function(e){var r=Object.getPrototypeOf(e);return Object.getOwnPropertyNames(r).filter(function(e){return"constructor"!==e})}},{key:"compose",value:function(e){var r=e.length;if(0===r)return function(e){return e};if(1===r)return e[0];var t=e.pop();return function(){return e.reduceRight(function(e,r){return r(e)},t.apply(void 0,arguments))}}}]),Manager}();r.default=s},"./src/middleware/message-recorder.js":function(e,r,t){"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&defineProperties(e.prototype,r),t&&defineProperties(e,t),e}}(),s=function(){function MessageRecorder(e){_classCallCheck(this,MessageRecorder),this.messageStore=e}return n(MessageRecorder,[{key:"createTopic",value:function(){var e=this;return function(r){return function(t){var n=r(t);return e.messageStore.createTopic(t),n}}}},{key:"publish",value:function(){var e=this;return function(r){return function(t,n){return e.messageStore.record(t,n),r(t,n)}}}}]),MessageRecorder}();r.default=s},"./src/middleware/middleware.js":function(e,r,t){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0}),r.PublicationPoller=r.MessageRecorder=r.Manager=void 0;var n=t("./src/middleware/manager.js"),s=_interopRequireDefault(n),i=t("./src/middleware/message-recorder.js"),u=_interopRequireDefault(i),o=t("./src/middleware/publication-poller.js"),a=_interopRequireDefault(o);r.Manager=s.default,r.MessageRecorder=u.default,r.PublicationPoller=a.default},"./src/middleware/publication-poller.js":function(e,r,t){"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&defineProperties(e.prototype,r),t&&defineProperties(e,t),e}}(),s=function(){function PublicationPoller(e){var r=this;_classCallCheck(this,PublicationPoller),this.messageStore=e,this.pollPublishedMessages=function(e,t){e.messagesToListenTo.filter(function(e){return r.messageStore.messageIsRecorded(e,t)}).forEach(function(r){e.process(r)})}}return n(PublicationPoller,[{key:"subscribeToOne",value:function(e){var r=this;return function(t){return function(n){var s=t(n);return r.pollPublishedMessages(e,n),s}}}},{key:"subscribeToMany",value:function(e){var r=this;return function(t){return function(n){var s=t(n);return n.forEach(function(t){return r.pollPublishedMessages(e,t)}),s}}}}]),PublicationPoller}();r.default=s},"./src/pubsub/event-bus.js":function(e,r,t){"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&defineProperties(e.prototype,r),t&&defineProperties(e,t),e}}(),s=function(){function EventBus(){_classCallCheck(this,EventBus),this.defaultTopic="__global__",this.topics={},this.topics[this.defaultTopic]=[]}return n(EventBus,[{key:"createTopic",value:function(e){return this.topicIsCreated(e)||(this.topics[e]=[]),e}},{key:"publish",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.defaultTopic;if(!this.topicIsCreated(r))throw new Error("[EventBus] Cannot publish a message in non-existent topic '"+r+"'");var t=this.topics[r];EventBus.notifySubscribers(t,e)}},{key:"subscribe",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.defaultTopic;if(!this.topicIsCreated(r))throw new Error("[EventBus] Cannot subscribe "+e+" to non-existent topic '"+r+"'");this.topics[r].push(e)}},{key:"topicIsCreated",value:function(e){return{}.propertyIsEnumerable.call(this.topics,e)}}],[{key:"notifySubscribers",value:function(e,r){e.forEach(function(e){return e.process(r)})}}]),EventBus}();r.default=new s},"./src/pubsub/message-store.js":function(e,r,t){"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&defineProperties(e.prototype,r),t&&defineProperties(e,t),e}}(),s=function(){function MessageStore(e){_classCallCheck(this,MessageStore),this.defaultTopic=e.defaultTopic,this.store={},this.store[this.defaultTopic]=[]}return n(MessageStore,[{key:"createTopic",value:function(e){this.topicExists(e)||(this.store[e]=[])}},{key:"record",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.defaultTopic;if(!this.topicExists(r))throw new Error("[MessageStore] Cannot record message in non-existent topic '"+r+"'");this.messageIsRecorded(e,r)||this.store[r].push(e)}},{key:"topicExists",value:function(e){return{}.propertyIsEnumerable.call(this.store,e)}},{key:"messageIsRecorded",value:function(e,r){return this.topicExists(r)&&this.store[r].includes(e)}}]),MessageStore}();r.default=s},"./src/pubsub/publisher.js":function(e,r,t){"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&defineProperties(e.prototype,r),t&&defineProperties(e,t),e}}(),s=function(){function Publisher(e,r){if(_classCallCheck(this,Publisher),this.EventBus=r,!this.EventBus.createTopic||!this.EventBus.publish)throw new Error("[Publisher] EventBus object should have 'createTopic' and 'publish' methods");this.topic=this.EventBus.createTopic(e)}return n(Publisher,[{key:"send",value:function(e){this.EventBus.publish(e,this.topic)}}]),Publisher}();r.default=s},"./src/pubsub/pubsub.js":function(e,r,t){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(r,"__esModule",{value:!0}),r.MessageStore=r.Subscriber=r.Publisher=r.EventBus=void 0;var n=t("./src/pubsub/event-bus.js"),s=_interopRequireDefault(n),i=t("./src/pubsub/publisher.js"),u=_interopRequireDefault(i),o=t("./src/pubsub/subscriber.js"),a=_interopRequireDefault(o),c=t("./src/pubsub/message-store.js"),l=_interopRequireDefault(c);r.EventBus=s.default,r.Publisher=u.default,r.Subscriber=a.default,r.MessageStore=l.default},"./src/pubsub/subscriber.js":function(e,r,t){"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&defineProperties(e.prototype,r),t&&defineProperties(e,t),e}}(),s=function(){function Subscriber(e,r,t){if(_classCallCheck(this,Subscriber),this.EventBus=t,!this.EventBus.subscribe)throw new Error("[Subscriber] EventBus should have a 'subscribe' method");this.messagesToListenTo=Array.isArray(e)?e:[e],this.callback=r,this.publishedMessages=[],this.needsAllMessagesForCallback=!0}return n(Subscriber,[{key:"requireAllMessages",value:function(e){return this.needsAllMessagesForCallback=e,this}},{key:"setPublished",value:function(e){this.publishedMessages.push(e)}},{key:"isPublished",value:function(e){return this.publishedMessages.includes(e)}},{key:"listensFor",value:function(e){return this.messagesToListenTo.includes(e)}},{key:"subscribeToOne",value:function(e){return this.EventBus.subscribe(this,e),this}},{key:"subscribeToMany",value:function(e){var r=this;return e.forEach(function(e){r.EventBus.subscribe(r,e)}),this}},{key:"process",value:function(e){this.listensFor(e)&&!1===this.isPublished(e)&&(this.setPublished(e),this.needsAllMessagesForCallback?this.allMessagesPublished&&this.callback(e):this.callback(e))}},{key:"allMessagesPublished",get:function(){var e=this;return this.messagesToListenTo.every(function(r){return e.isPublished(r)})}}]),Subscriber}();r.default=s}})});