'use strict';

const EventEmitter = require('events');

class ImppClient extends EventEmitter {

  constructor(conn, protocol) {
    super();
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
    this.connection.on('data', (data) => {
      try {
        let message = this.protocol.parseMessage(data);
        if (message) this.emit('message', message);
      }
      catch (err) {
      }
    });
  }

  send(message, callback) {
    try {
      let data = this.protocol.serializeMessage(message);
      if (data) {
        this.connection.write(data, callback);
      }
    }
    catch (err) {
      if (typeof callback === 'function') {
        callback(err);
      }
    }
  }

  _onConnectionClosed() {
    this.connection.removeAllListeners('data');
    this.emit('close');
  }

}

module.exports = ImppClient;
