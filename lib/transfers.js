'use strict';

const http = require('http');
const WebSocketServer = require('ws').Server;

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
