// 'use strict';
//
// const ympp = require('ympp');
//
// let protocol = ympp.protocol();
//
// protocol.handshake(function (conn, callback) {
//
// });
//
// protocol.on('ympp:present', function (frame, client, server) {
//
// });
//
// protocol.on('ympp:absent', function (frame, client, server) {
//
// });
//
// protocol.on('ympp:ping', function (frame, client, server) {
//
// });
//
// protocol.on('ympp:echo', function (frame, client, server) {
//
// });
//
// protocol.on('ympp:offline', function (frame, client, server) {
//
// });
//
// protocol.on('im', function (frame, client, server) {
//
// });
//
// protocol.on('broadcast', function (frame, client, server) {
//
// });
//
// let server = ympp.createServer(protocol, {
//   transfer: 'net.socket' // or 'ws'
// });
//
// server.listen(3000);

module.exports.server = require('./ympp-server');
module.exports.client = require('./ympp-client');
module.exports.message = require('./ympp-message');
