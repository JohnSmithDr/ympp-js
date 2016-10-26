'use strict';

const expect = require('chai').expect;
const EventEmitter = require('events');
const ImppClient = require('../../lib/impp-core').ImppClient;
const ImppProtocol = require('../../lib/impp-core').ImppProtocol;

describe('impp-client', function () {

  let testConnection = new EventEmitter();
  let testProtocol = new ImppProtocol();
  let testClient = new ImppClient(testConnection, testProtocol);

  describe('#receive()', function () {

    it('should be ok', function () {

      let messages = ['foo', 'bar', 'gee'];
      let received = [];
      testClient.on('message', x => received.push(x));
      testClient.receive();

      messages.forEach(x => {
        testConnection.emit('data', x);
      });

      expect(received).to.deep.equal(messages);

    });

  });

  describe('#send()', function () {

    it('should be ok', function () {

      let messages = ['foo', 'bar', 'gee'];
      let sent = [];
      testConnection.write = function (data, callback) {
        sent.push(data);
        callback();
      };

      messages.forEach(x => {
        testClient.send(x);
      });

      expect(sent).to.deep.equal(messages);

    });

  });

  describe('#close', function () {

    it('should be ok', function (done) {
      testClient.on('close', done);
      testConnection.emit('close');
    });

  });

});
