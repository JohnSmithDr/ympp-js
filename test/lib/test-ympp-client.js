'use strict';

const _ = require('lodash');
const EventEmitter = require('events');
const chance = require('chance').Chance();
const expect = require('chai').expect;
const ympp = require('../../lib/');

describe('ympp-client', function () {

  let testConnection;
  let testClient;

  describe('#receive()', function () {

    beforeEach(function () {
      testConnection = new EventEmitter();
      testClient = ympp.client(testConnection, 'anonymous');
    });

    it('should be ok', function () {

      let count = 10;
      let messages = _.range(count).map(() => chance.paragraph());
      let received = [];
      testClient.on('message', x => received.push(x));
      testClient.receive();

      messages.forEach(x => {
        let msg = ympp.message({
          intent: 'test',
          content: {
            data: new Buffer(x)
          }
        });
        let data = ympp.message.encode(msg);
        testConnection.emit('message', data);
      });

      expect(received).to.have.length(10);
      expect(received.map(x => x.content.data.toBuffer().toString())).to.deep.equal(messages);

    });

    it('should emit error for invalid message', function (done) {

      testClient.once('error::receive', (err) => done());
      testClient.receive();
      testConnection.emit('message', 'bad');

    });

  });

  describe('#send()', function () {

    beforeEach(function () {
      testConnection = new EventEmitter();
      testClient = ympp.client(testConnection, 'anonymous');
    });

    it('should be ok', function () {

      let count = 10;
      let messages = _.range(count).map(() => chance.paragraph());
      let sent = [];
      testConnection.send = function (data, flags, callback) {
        let msg = ympp.message.decode(data);
        sent.push(msg);
        callback();
      };

      messages.forEach(x => {
        let msg = ympp.message({
          intent: 'test',
          content: {
            data: new Buffer(x)
          }
        });
        testClient.send(msg, () => { });
      });

      expect(sent).to.have.length(10);
      expect(sent.map(x => x.content.data.toBuffer().toString())).to.deep.equal(messages);

    });

    it('should pass error to callback', function () {

      let t1 = () => new Promise((res, rej) => {
        testClient.send('bad', (err) => {
          if (!err) rej('should not pass');
          expect(err.message).to.match(/message.encode is not a function/i);
          res('pass');
        });
      });

      let t2 = () => new Promise((res, rej) => {
        testClient.send(
          ympp.message({ intent: 'test' }),
          (err) => {
            if (!err) rej('should not pass');
            expect(err.message).to.match(/connection.send is not a function/i);
            res('pass');
          }
        );
      });

      let t3 = () => new Promise((res, rej) => {
        testConnection.send = function (data, flags, callback) {
          callback(Error('oops'));
        };
        testClient.send(
          ympp.message({ intent: 'test' }),
          (err) => {
            if (!err) rej('should not pass');
            expect(err.message).to.equal('oops');
            res('pass');
          }
        );
      });

      return t1().then(() => t2()).then(() => t3());
    });

    it('should emit error for no callback', function () {

      let t1 = () => new Promise((res, rej) => {
        testClient.once('error::send', (err) => {
          if (!err) rej('should not pass');
          expect(err.message).to.match(/message.encode is not a function/i);
          res('pass');
        });
        testClient.send('bad');
      });

      let t2 = () => new Promise((res, rej) => {
        testClient.once('error::send', (err) => {
          if (!err) rej('should not pass');
          expect(err.message).to.match(/connection.send is not a function/i);
          res('pass');
        });
        testClient.send(ympp.message({ intent: 'test' }));
      });

      let t3 = () => new Promise((res, rej) => {
        testConnection.send = function (data, flags, callback) {
          throw Error('oops');
        };
        testClient.once('error::send', (err) => {
          if (!err) rej('should not pass');
          expect(err.message).to.equal('oops');
          res('pass');
        });
        testClient.send(ympp.message({ intent: 'test' }));
      });

      return t1().then(() => t2()).then(() => t3());
    });

  });

  describe('#close()', function () {

    beforeEach(function () {
      testConnection = new EventEmitter();
      testConnection.close = function () {
        testConnection.emit('::close');
        testConnection.emit('close');
      };
      testClient = ympp.client(testConnection, 'anonymous');
    });

    it('should be ok', function () {

      let t1 = new Promise((res) => {
        testConnection.once('::close', () => res('pass'));
      });

      let t2 = new Promise((res) => {
        testClient.once('close', () => res('pass'));
      });

      testClient.close();
      return Promise.all([ t1, t2 ]);
    });

  });

  describe('#terminate()', function () {

    beforeEach(function () {
      testConnection = new EventEmitter();
      testConnection.terminate = function () {
        testConnection.emit('::terminate');
        testConnection.emit('close');
      };
      testClient = ympp.client(testConnection, 'anonymous');
    });

    it('should be ok', function () {

      let t1 = new Promise((res) => {
        testConnection.once('::terminate', () => res('pass'));
      });

      let t2 = new Promise((res) => {
        testClient.once('close', () => res('pass'));
      });

      testClient.terminate();
      return Promise.all([ t1, t2 ]);
    });

  });

  describe('#close', function () {

    beforeEach(function () {
      testConnection = new EventEmitter();
      testClient = ympp.client(testConnection, 'anonymous');
    });

    it('should be ok', function (done) {
      testClient.on('close', done);
      testConnection.emit('close');
    });

  });

});
