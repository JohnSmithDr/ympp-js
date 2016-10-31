'use strict';

const ympp = require('../lib');

function createServer() {

  let server = ympp.server();

  return server
    .on('present', (cli) => {
      console.log('client present:', cli.id);
    })
    .on('absent', (cli) => {
      console.log('client absent:', cli.id);
    })
    .use((msg, cli, srv, next) => {
      console.log('client message:', msg.content.data.toBuffer().toString());
      next();
    })
    .use('echo', function (msg, cli, srv, next) {
      srv.send(msg, (err) => {
        if (err) console.error(err);
        next();
      })
    });
}

module.exports.createServer = createServer;

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
