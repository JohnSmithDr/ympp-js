'use strict';

const EventEmitter = require('events');
const ImppClient = require('./impp-client');

class ImppServer extends EventEmitter {

  constructor(presenceManager, messageProcessor, protocol, server) {
    super();
    this._presenceManager = presenceManager;
    this._messageProcessor = messageProcessor;
    this._protocol = protocol;
    this._server = server;
    this._server.on('connection', (conn) => this._onConnection(conn));
  }

  get presenceManager() {
    return this._presenceManager;
  }

  get messageProcessor() {
    return this._messageProcessor;
  }

  get protocol() {
    return this._protocol;
  }

  _onConnection(conn) {

    this.protocol.handshake(conn, (success) => {

      // shutdown connection if handshake is failed
      if (!success) {
        conn.end();
        conn.destroy();
        return;
      }

      // upgrade connection
      let imppClient = new ImppClient(conn, this.protocol);
      imppClient.on('message', (message) => this.messageProcessor.process(message, imppClient, this));
      imppClient.on('close', () => this.presenceManager.absent(imppClient));

      // notify client presence
      this.presenceManager.present(imppClient);

      // start process incoming message
      imppClient.receive();

    });

  }

}

module.exports = ImppServer;
