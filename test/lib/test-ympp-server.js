'use strict';

const _ = require('lodash');
const async = require('async');
const chance = require('chance').Chance();
const expect = require('chai').expect;
const ympp = require('../../lib/index');

describe('ympp-server', function () {

  describe('echo', function () {

    function createServer() {

      return ympp
        .server({
          handshake: function (conn, callback) {
            let headers = (conn.upgradeReq && conn.upgradeReq.headers) || {};
            let id = headers['ympp-client-id'];
            return callback(id ? true : false, id);
          }
        })
        .use('echo', function (msg, cli, srv, next) {
          cli.send(msg, () => {
            next();
          });
        });
    }

    function sendMessages(client, messages, callback) {
      async.eachLimit(messages, 1,
        (x, next) => {
          let msg = ympp.message({
            intent: 'echo',
            content: {
              data: new Buffer(x)
            }
          });
          client.send(msg, (err) => {
            return err ? next(err) : next();
          });
        },
        callback);
    }

    let server, client, port = 6000;
    let messages = _.range(10).map(() => chance.paragraph());

    before(function (done) {
      server = createServer()
        .listen(port, (err) => {
          return err ? done(err) : done();
        });
    });

    it('should be ok', function (done) {

      let received = [];

      ympp.client.connect(
        {
          id: 'anonymous',
          token: 'none',
          url: `ws://localhost:${port}`
        },
        (err, cli) => {

          if (err) return done(err);

          client = cli;

          client.receive();

          client.on('message', (msg) => {
            let txt = msg.content.data.toBuffer().toString();
            received.push(txt);

            if (received.length === messages.length) {
              client.close();
              expect(received).to.deep.equal(messages);
              done();
            }
          });

          sendMessages(client, messages, (err) => {
            if (err) done(err);
          });
        }
      );

    });

  });

});
