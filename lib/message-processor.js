'use strict';

const _ = require('lodash');
const EventEmitter = require('events');
const middleware = require('./message-middleware');

class MessageProcessor extends EventEmitter {

  constructor() {
    super();
    this._stack = [];
  }

  use() {

    let args = _.flatten(Array.from(arguments));

    if (!args.length) return this;

    if (typeof args[0] === 'string') {

      let rest = middleware(args.slice(1));

      let mw = function (m, c, s, next) {
        return (m.intent === args[0])
          ? rest(m, c, s, next)
          : next();
      };

      this._stack.push(mw);
      return this;
    }
    else {
      let mw = middleware(args.slice(1));
      this._stack.push(mw);
      return this;
    }
  }

  process(message, client, server) {
    middleware
      (this._stack)
      (message, client, server, (err) => {
        if (err) {
          this.emit('error', err);
        }
      });
  }

}

module.exports = MessageProcessor;
