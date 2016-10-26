'use strict';

const net = require('net');
const _ = require('lodash');
const async = require('async');
const chance = require('chance').Chance();
const expect = require('chai').expect;
const createServer = require('../../examples/impp-echo/server');

describe('impp-echo-server', function () {

  let echoServer, port = 6000;

  before(function (done) {
    echoServer = createServer(port, done);
  });

  it('should be ok', function (done) {

    let received = [];
    let messages = _.range(10).map(() => chance.paragraph());
    let client = net.connect(port);

    echoServer.presenceManager.on('absent', () => {
      expect(received.join('')).to.equal(messages.join(''));
      done();
    });

    echoServer.presenceManager.on('present', () => {

      client.on('data', (data) => {
        let message = data.toString('utf8');
        received.push(message);
      });

      async.eachLimit(messages, 1,
        (x, next) => {
          client.write(new Buffer(x, 'utf8'), (err) => {
            if (err) next(err);
            setTimeout(next, 50);
          });
        },
        (err) => {
          client.end();
          client.destroy();
          if (err) done(err);
        });
    });

  });

});
