'use strict';

const EventEmitter = require('events');

class MessageProcessor extends EventEmitter {

  constructor(processor) {
    super();
    this._processor = processor;
  }

  process(message, fromClient, atServerNode) {
    if (typeof this._processor === 'function') {
      this._processor(message, fromClient, atServerNode);
    }
  }

  static create(processor) {
    return new DelegatedMessageProcessor(processor);
  }

}

class DelegatedMessageProcessor extends MessageProcessor {

  constructor(processor) {
    super();
    this._processor = processor;
  }

  process(message, fromClient, atServerNode) {
    return this._processor.apply(this, [ message, fromClient, atServerNode ]);
  }

}

module.exports = MessageProcessor;
