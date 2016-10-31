'use strict';

const EventEmitter = require('events');
const MessageProcessor = require('./message-processor');
const PresenceManager = require('./presence-manager');
const client = require('./ympp-client');

class YmppServer extends EventEmitter {

  constructor(server, handshake) {
    super();
    this._messageProcessor = new MessageProcessor();
    this._presenceManager = new PresenceManager();
    this._handshake = handshake;
    this._server = server;
    this._server.on('connection', (conn) => {

      this._handshake(conn, (success, id) => {

        // shutdown connection if handshake is failed
        if (!success) {
          conn.end();
          conn.destroy();
          return;
        }

        // upgrade connection
        let cli = client(conn, id)
          .on('message', (message) => {
            this.messageProcessor.process(message, cli, this);
          })
          .once('close', () => {
            this.presenceManager.absent(cli);
          });

        // notify client presence
        this.presenceManager.present(cli);

        // start process incoming message
        cli.receive();

      });

    })
  }

  use() {
    this.messageProcessor.use.apply(
      this.messageProcessor,
      Array.from(arguments));
    return this;
  }

  get presenceManager() { return this._presenceManager; }
  get messageProcessor() { return this._messageProcessor; }

}

module.exports = function server(opts) {
  return new YmppServer();
};
