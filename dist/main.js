!function(e){if("includes"in Array.prototype)e();else{var t=document.createElement("script");t.src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Array.prototype.includes",t.onload=e,t.onerror=function(){console.error("Could not load polyfills script!"),e()},document.head.appendChild(t)}}(function(){!function(e){function __webpack_require__(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,__webpack_require__),n.l=!0,n.exports}var t={};__webpack_require__.m=e,__webpack_require__.c=t,__webpack_require__.d=function(e,t,r){__webpack_require__.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},__webpack_require__.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=0)}([function(e,t,r){"use strict";function _interopRequireWildcard(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}var n=r(1),i=_interopRequireWildcard(n),s=r(6),o=_interopRequireWildcard(s),u=new i.MessageStore(i.EventBus),a=new o.Manager;a.use(i.EventBus,new o.MessageRecorder(u));var c=new i.Publisher("polyfills",i.EventBus);new i.Publisher("modules",i.EventBus).send("scrollmonitor");var l=new i.Subscriber(["window_matchmedia","scrollmonitor"],function(){console.log("done!")},i.EventBus).requireAllMessages(!1);a.use(l,new o.PublicationPoller(u)),l.subscribeToMany(["polyfills","modules"]),"matchMedia"in window&&c.send("window_matchmedia")},function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.MessageStore=t.Subscriber=t.Publisher=t.EventBus=void 0;var n=r(2),i=_interopRequireDefault(n),s=r(3),o=_interopRequireDefault(s),u=r(4),a=_interopRequireDefault(u),c=r(5),l=_interopRequireDefault(c);t.EventBus=i.default,t.Publisher=o.default,t.Subscriber=a.default,t.MessageStore=l.default},function(e,t,r){"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),i=function(){function EventBus(){_classCallCheck(this,EventBus),this.defaultTopic="__global__",this.topics={},this.topics[this.defaultTopic]=[]}return n(EventBus,[{key:"createTopic",value:function(e){return this.topicIsCreated(e)||(this.topics[e]=[]),e}},{key:"publish",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.defaultTopic;if(!this.topicIsCreated(t))throw new Error("[EventBus] Cannot publish a message in non-existent topic '"+t+"'");var r=this.topics[t];EventBus.notifySubscribers(r,e)}},{key:"subscribe",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.defaultTopic;if(!this.topicIsCreated(t))throw new Error("[EventBus] Cannot subscribe "+e+" to non-existent topic '"+t+"'");this.topics[t].push(e)}},{key:"topicIsCreated",value:function(e){return{}.propertyIsEnumerable.call(this.topics,e)}}],[{key:"notifySubscribers",value:function(e,t){e.forEach(function(e){return e.process(t)})}}]),EventBus}();t.default=new i},function(e,t,r){"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),i=function(){function Publisher(e,t){if(_classCallCheck(this,Publisher),this.EventBus=t,!this.EventBus.createTopic||!this.EventBus.publish)throw new Error("[Publisher] EventBus object should have 'createTopic' and 'publish' methods");this.topic=this.EventBus.createTopic(e)}return n(Publisher,[{key:"send",value:function(e){this.EventBus.publish(e,this.topic)}}]),Publisher}();t.default=i},function(e,t,r){"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),i=function(){function Subscriber(e,t,r){if(_classCallCheck(this,Subscriber),this.EventBus=r,!this.EventBus.subscribe)throw new Error("[Subscriber] EventBus should have a 'subscribe' method");this.messagesToListenTo=Array.isArray(e)?e:[e],this.callback=t,this.publishedMessages=[],this.needsAllMessagesForCallback=!0}return n(Subscriber,[{key:"requireAllMessages",value:function(e){return this.needsAllMessagesForCallback=e,this}},{key:"setPublished",value:function(e){this.publishedMessages.push(e)}},{key:"isPublished",value:function(e){return this.publishedMessages.includes(e)}},{key:"listensFor",value:function(e){return this.messagesToListenTo.includes(e)}},{key:"subscribeToOne",value:function(e){return this.EventBus.subscribe(this,e),this}},{key:"subscribeToMany",value:function(e){var t=this;return e.forEach(function(e){t.EventBus.subscribe(t,e)}),this}},{key:"process",value:function(e){this.listensFor(e)&&!1===this.isPublished(e)&&(this.setPublished(e),this.needsAllMessagesForCallback?this.allMessagesPublished&&this.callback(e):this.callback(e))}},{key:"allMessagesPublished",get:function(){var e=this;return this.messagesToListenTo.every(function(t){return e.isPublished(t)})}}]),Subscriber}();t.default=i},function(e,t,r){"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),i=function(){function MessageStore(e){_classCallCheck(this,MessageStore),this.defaultTopic=e.defaultTopic,this.store={},this.store[this.defaultTopic]=[]}return n(MessageStore,[{key:"createTopic",value:function(e){this.topicExists(e)||(this.store[e]=[])}},{key:"record",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.defaultTopic;if(!this.topicExists(t))throw new Error("[MessageStore] Cannot record message in non-existent topic '"+t+"'");this.messageIsRecorded(e,t)||this.store[t].push(e)}},{key:"topicExists",value:function(e){return{}.propertyIsEnumerable.call(this.store,e)}},{key:"messageIsRecorded",value:function(e,t){return this.topicExists(t)&&this.store[t].includes(e)}}]),MessageStore}();t.default=i},function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.PublicationPoller=t.MessageRecorder=t.Manager=void 0;var n=r(7),i=_interopRequireDefault(n),s=r(8),o=_interopRequireDefault(s),u=r(9),a=_interopRequireDefault(u);t.Manager=i.default,t.MessageRecorder=o.default,t.PublicationPoller=a.default},function(e,t,r){"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),i=function(){function Manager(){_classCallCheck(this,Manager),this.middlewareFunctions={}}return n(Manager,[{key:"createClassEntry",value:function(e){!1==={}.propertyIsEnumerable.call(this.middlewareFunctions,e)&&(this.middlewareFunctions[e]=[])}},{key:"createMethodEntry",value:function(e,t){this.middlewareFunctions[e][t]||(this.middlewareFunctions[e][t]=[])}},{key:"use",value:function(e){var t=this,r=e.constructor.name;this.createClassEntry(r);for(var n=arguments.length,i=Array(n>1?n-1:0),s=1;s<n;s++)i[s-1]=arguments[s];return i.forEach(function(n){Manager.getClassMethodNames(n).forEach(function(i){var s=n[i].bind(n);t.createMethodEntry(r,i),t.middlewareFunctions[r][i].unshift(s(e))})}),Object.keys(this.middlewareFunctions[r]).forEach(function(n){var i=e[n];if(!i)throw new Error("[Manager] Target method '"+n+"' does not exist");var s=i.bind(e),o=t.middlewareFunctions[r][n],u=Manager.compose(o)(s);e[n]=u}),this}}],[{key:"getClassMethodNames",value:function(e){var t=Object.getPrototypeOf(e);return Object.getOwnPropertyNames(t).filter(function(e){return"constructor"!==e})}},{key:"compose",value:function(e){var t=e.length;if(0===t)return function(e){return e};if(1===t)return e[0];var r=e.pop();return function(){return e.reduceRight(function(e,t){return t(e)},r.apply(void 0,arguments))}}}]),Manager}();t.default=i},function(e,t,r){"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),i=function(){function MessageRecorder(e){_classCallCheck(this,MessageRecorder),this.messageStore=e}return n(MessageRecorder,[{key:"createTopic",value:function(){var e=this;return function(t){return function(r){var n=t(r);return e.messageStore.createTopic(r),n}}}},{key:"publish",value:function(){var e=this;return function(t){return function(r,n){return e.messageStore.record(r,n),t(r,n)}}}}]),MessageRecorder}();t.default=i},function(e,t,r){"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),i=function(){function PublicationPoller(e){var t=this;_classCallCheck(this,PublicationPoller),this.messageStore=e,this.pollPublishedMessages=function(e,r){e.messagesToListenTo.filter(function(e){return t.messageStore.messageIsRecorded(e,r)}).forEach(function(t){e.process(t)})}}return n(PublicationPoller,[{key:"subscribeToOne",value:function(e){var t=this;return function(r){return function(n){var i=r(n);return t.pollPublishedMessages(e,n),i}}}},{key:"subscribeToMany",value:function(e){var t=this;return function(r){return function(n){var i=r(n);return n.forEach(function(r){return t.pollPublishedMessages(e,r)}),i}}}}]),PublicationPoller}();t.default=i}])});