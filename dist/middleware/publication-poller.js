"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * PublicationPoller Class
 *
 * Hooks into Subscriber.subscribeToOne and Subscriber.subscribeToMany methods and polls for
 * messages that have already been published through the EventBus and, if so, processes those
 * message for the current Subscriber.
 *
 * @class PublicationPoller
 * @namespace Middleware
 */
var PublicationPoller = function () {
    /**
     * Creates an instance of PublicationPoller
     *
     * @param {MessageStore} messageStore - message store object
     *
     * @memberof PublicationPoller
     */
    function PublicationPoller(messageStore) {
        var _this = this;

        _classCallCheck(this, PublicationPoller);

        this.messageStore = messageStore;

        /**
         * Checks the event bus for already published messages for the given target object
         *
         * @param {Object} target - Subscriber object
         * @param {String} topic - the topic to request published messages for
         */
        this.pollPublishedMessages = function (target, topic) {
            target.messagesToListenTo.filter(function (message) {
                return _this.messageStore.messageIsRecorded(message, topic);
            }).forEach(function (message) {
                target.process(message);
            });
        };
    }

    /**
     * Polls for messages in a topic
     *
     * @param {Object} target - reference to Subscriber instance
     * @returns {Function}
     *
     * @memberof PublicationPoller
     */


    _createClass(PublicationPoller, [{
        key: "subscribeToOne",
        value: function subscribeToOne(target) {
            var _this2 = this;

            return function (next) {
                return function (topic) {
                    var result = next(topic);

                    _this2.pollPublishedMessages(target, topic);

                    return result;
                };
            };
        }

        /**
         * Polls for messages in multiple topics
         *
         * @param {Object} target - reference to Subscriber instance
         * @returns {Function}
         *
         * @memberof PublicationPoller
         */

    }, {
        key: "subscribeToMany",
        value: function subscribeToMany(target) {
            var _this3 = this;

            return function (next) {
                return function (topics) {
                    var result = next(topics);

                    topics.forEach(function (topic) {
                        return _this3.pollPublishedMessages(target, topic);
                    });

                    return result;
                };
            };
        }
    }]);

    return PublicationPoller;
}();

exports.default = PublicationPoller;