'use strict';

const net = require('net');

const ImppServer = require('../../lib/impp-core').ImppServer;
const ImppProtocol = require('../../lib/impp-core').ImppProtocol;
const PresenceManager = require('../../lib/impp-core').PresenceManager;
const MessageProcessor = require('../../lib/impp-core').MessageProcessor;

function createServer(port, callback) {

  let socketServer = net.createServer();

  let imppEchoServer = new ImppServer(
    new PresenceManager(),
    MessageProcessor.create((message, fromClient) => {
      fromClient.send(message, (err) => {
        if (err) console.error(err);
        console.log('message send:', message.trim());
      });
    }),
    ImppProtocol.create({
      handshake: function (conn, callback) {
        let addr = conn.address();
        let id = `${addr.address}:${addr.port}`;
        callback(true, id, conn);
      },
      parseMessage: function (data) {
        return data.toString('utf8');
      },
      serializeMessage: function (message) {
        return new Buffer(message, 'utf8');
      }
    }),
    socketServer
  );

  socketServer.listen(port, callback);

  return imppEchoServer;

}

module.exports = createServer;

if (!module.parent) {
  let port = 6000;
  createServer(port, (err) => {
    if (err) return console.error(err);
    console.log('echo server start at port:', port);
  });
}
