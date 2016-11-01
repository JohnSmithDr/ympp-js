'use strict';

const http = require('http');
const WebSocket = require('ws');
const WebSocketServer = require('ws').Server;

WebSocket.prototype.end = function () {
  return this.close.apply(this, Array.from(arguments));
};

WebSocket.prototype.destroy = function () {
  return this.terminate();
};

WebSocketServer.prototype.listen = function (port, callback) {
  this._server.listen(port, callback);
};

module.exports.ws = function ws() {
  return new WebSocketServer({
    server: http.createServer()
  });
};

module.exports.uws = function uws() {
  throw Error('Not supported yet !!!');
};
