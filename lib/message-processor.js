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

    /**
     * call by:
     *
     *   .use('intent', (msg, cli, srv, next) => { ... })
     *
     * add middleware to process message with specific intent
     */
    if (typeof args[0] === 'string') {

      let intent = args[0];
      let rest = middleware(args.slice(1));
      let mw = function(m, c, s, next) {
        return (m.intent === intent)
          ? rest(m, c, s, next)
          : next();
      };

      this._stack.push(mw);
      return this;
    }
    /**
     * call by:
     *
     *  .use((msg, cli, srv, next) => { ... })
     *
     * add middleware to process all message
     */
    else {
      let mw = middleware(args);
      this._stack.push(mw);
      return this;
    }
  }

  process(message, client, server) {
    
    this.emit('message', message, client, server);

    // process message through the whole stack
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
