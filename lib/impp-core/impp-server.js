'use strict';

const EventEmitter = require('events');

class ImppServer extends EventEmitter {

  constructor(presenceManager, messageProcessor, protocol, server) {
    this._presenceManager = presenceManager;
    this._messageProcessor = messageProcessor;
    this._protocol = protocol;
    this._server = server;

    this._server.on(
      this.protocol.connectionEventName,
      (conn) => this._onConnection(conn));
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
        conn.shutdown();
        return;
      }

      // upgrade connection
      let imppClient = new ImppClient(conn, this.protocol);

      imppClient.on(
        this.protocol.messageEventName,
        (message) => this.messageProcessor.process(message, imppClient, this));

      imppClient.on(
        this.protocol.connectionClosedEventName,
        () => this.presenceManager.absent(imppClient));

      // notify client presence
      this.presenceManager.present(imppClient);

      // start process incoming message
      imppClient.receive();

    });

  }

}

module.exports = ImppServer;
