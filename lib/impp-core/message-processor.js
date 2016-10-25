'use strict';

const EventEmitter = require('events');

class MessageProcessor extends EventEmitter {

  process(message, fromClient, atServerNode) {
    // TODO: to process incoming message
  }

}

module.exports = MessageProcessor;
