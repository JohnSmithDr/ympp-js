'use strict';

const net = require('net');

const ImppServer = require('../../lib/impp-core').ImppServer;
const ImppProtocol = require('../../lib/impp-core').ImppProtocol;
const PresenceManager = require('../../lib/impp-core').PresenceManager;
const MessageProcessor = require('../../lib/impp-core').MessageProcessor;

function createServer(port) {

  let socketServer = net.createServer();

  let imppEchoServer = new ImppServer(
    new PresenceManager(),
    new MessageProcessor((message, fromClient) => {
      fromClient.send(message, (err, r) => {
        if (err) console.error(err);
        console.log('message send:', r);
      });
    }),
    ImppProtocol.create({
      handshake: function (conn, callback) {
        callback(true, conn);
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

  socketServer.listen(port, (err) => {
    if (err) return console.error(err);
    console.log('echo server start at port:', port);
  });

}

createServer(6000);
