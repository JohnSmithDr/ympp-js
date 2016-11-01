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

module.exports.connect = function (args, callback) {
  let ws = new WebSocket(args['url'], ['ympp'], {
    headers: {
      'YMPP-Client-Id': args['id'],
      'YMPP-Client-Token': args['token']
    }
  });
  ws.on('open', () => callback(null, new YmppClient(ws, args['id'])));
  ws.on('error', (err) => callback(err));
};
