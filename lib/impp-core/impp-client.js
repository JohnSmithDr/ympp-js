'use strict';

const EventEmitter = require('events');

class ImppClient extends EventEmitter {

  constructor(conn, protocol) {
    this._protocol = protocol;
    this._conn = conn;
    this._conn.once('close', () => this._onConnectionClosed());
  }

  get connection() {
    return this._conn;
  }

  get protocol() {
    return this._protocol;
  }

  receive() {
    this._conn.on('message', (message) => {
      try {
        let protocolMessage = this.protocol.parseMessage(message);
        if (protocolMessage) {
          this.emit(this.protocol.messageEventName, protocolMessage);
        }
      }
      catch (err) {
        this.emit(this.protocol.receiveMessageErrorEventName, err);
      }
    });
  }

  send(message, callback) {
    try {
      let data = this.protocol.serializeMessage(message);
      if (data) {
        this._conn.send(data, callback);
      }
    }
    catch (err) {
      if (typeof callback === 'function') {
        callback(err);
      }
    }
  }

  _onConnectionClosed() {
    this._conn.removeAllListeners('message');
    this.emit(this.protocol.connectionClosedEventName);
  }

}

module.exports = ImppClient;
