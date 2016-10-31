'use strict';

const EventEmitter = require('events');
const WebSocket = require('ws');
const ymppMessage = require('./ympp-message');

class YmppClient extends EventEmitter {

  constructor(conn, id) {
    super();
    this._id = id;
    this._conn = conn;
    this._conn.once('close', () => {
      this._conn.removeAllListeners('message');
      this.removeAllListeners('message');
      this.emit('close');
    });
  }

  receive() {
    this.connection.on('message', (data) => {
      try {
        let message = ymppMessage.decode(data);
        if (message) this.emit('message', message);
      }
      catch (err) {
      }
    });
  }

  send(msg, callback) {
    try {
      let data = ymppMessage.encode(msg);
      if (data) {
        this.connection.send(data, { binary: true }, callback);
      }
    }
    catch (err) {
      if (typeof callback === 'function') {
        callback(err);
      }
    }
  }

  get id() { return this._id; }
  get connection() { return this._conn; }
}

module.exports = function client(conn, id) {
  return new YmppClient(conn, id);
};

module.exports.connect = function (url, id, callback) {
  let ws = new WebSocket(url, ['ympp'], {
    headers: {
      'YMPP-Client-ID': id
    }
  });
  ws.on('open', () => callback(null, new YmppClient(ws, id)));
  ws.on('error', (err) => callback(err));
};
