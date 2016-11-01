'use strict';

const ympp = require('../../lib');

function createServer() {

  let server = ympp.server({
    handshake: function (conn, callback) {
      let headers = (conn.upgradeReq && conn.upgradeReq.headers) || {};
      let id = headers['ympp-client-id'];
      return callback(id ? true : false, id);
    }
  });

  return server
    .on('present', (cli) => {
      console.log('client present:', cli.id);
    })
    .on('absent', (cli) => {
      console.log('client absent:', cli.id);
    })
    .use((msg, cli, srv, next) => {
      console.log('message from client %s:', cli.id, msg.content.data.toBuffer().toString());
      next();
    })
    .use('echo', function (msg, cli, srv, next) {
      cli.send(msg, (err) => {
        if (err) console.error(err);
        next();
      });
    });
}

module.exports.create = createServer;

if (!module.parent) {
  createServer()
    .listen(3000, (err) => {
      if (err) {
        console.error(err);
        process.exit(-1);
      }
      console.log('server start at port 3000');
    });
}
