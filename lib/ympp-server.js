'use strict';

const EventEmitter = require('events');
const MessageProcessor = require('./message-processor');
const PresenceManager = require('./presence-manager');
const client = require('./ympp-client');
const transfers = require('./transfers');

const defaultServerOpts = {
  handshake: function (conn, callback) {
    callback(true, '*')
  }
};

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
    });
    this._presenceManager.on('present', (cli) => this.emit('present', cli, this));
    this._presenceManager.on('absent', (cli) => this.emit('absent', cli, this));
  }

  use() {
    this.messageProcessor.use.apply(
      this.messageProcessor,
      Array.from(arguments));
    return this;
  }

  listen(port, callback) {
    this._server.listen(port, callback);
    return this;
  }

  get presenceManager() { return this._presenceManager; }
  get messageProcessor() { return this._messageProcessor; }

}

module.exports = function server(opts) {
  let args = Object.assign({}, defaultServerOpts, opts);
  let server = args.server || transfers.ws();
  return new YmppServer(server, args.handshake);
};
