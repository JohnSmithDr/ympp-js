'use strict';

const expect = require('chai').expect;
const ympp = require('../../lib/');

describe('ympp-message', function () {

  describe('.message()', function () {

    it('should be ok', function () {

      let time = +Date.now();

      let msg = ympp.message({
        intent: 'greeting',
        header: {
          id: '1',
          to: ['bob', 'carter'],
          from: 'alice',
          channel: '101',
          time: time,
          extra: {
            foo: 'FOO',
            bar: 'BAR'
          }
        },
        content: {
          encoding: 'plain',
          charset: 'utf8',
          type: 'text/plain',
          data: new Buffer('Hello !!!', 'utf8')
        }
      });

      let encoded = ympp.message.encode(msg);
      let decoded = ympp.message.decode(encoded);

      expect(decoded.intent).to.equal('greeting');
      expect(decoded.header.id).to.equal('1');
      expect(decoded.header.to).to.include.members(['bob', 'carter']);
      expect(decoded.header.from).to.equal('alice');
      expect(decoded.header.channel).to.equal('101');
      expect(decoded.header.time.toNumber()).to.equal(time);
      expect(decoded.header.extra.get('foo')).to.equal('FOO');
      expect(decoded.header.extra.get('bar')).to.equal('BAR');
      expect(decoded.content.encoding).to.equal('plain');
      expect(decoded.content.charset).to.equal('utf8');
      expect(decoded.content.type).to.equal('text/plain');
      expect(decoded.content.data.toBuffer().toString()).to.equal('Hello !!!');

    });

  });

  describe('.header()', function () {

    it('should be ok', function () {

      let time = +Date.now();

      let msg = ympp.message({
        intent: 'present'
      });

      msg.header = ympp.message.header({
        to: ['bob', 'carter'],
        from: 'alice',
        time: time
      });

      let encoded = ympp.message.encode(msg);
      let decoded = ympp.message.decode(encoded);

      expect(decoded.header.to).to.include.members(['bob', 'carter']);
      expect(decoded.header.from).to.equal('alice');
      expect(decoded.header.time.toNumber()).to.equal(time);

    });

  });

  describe('.content()', function () {

    it('should be ok', function () {

      let d = { message: 'Hello !!!' };
      let time = +Date.now();

      let msg = ympp.message({
        intent: 'im',
        header: {
          to: ['bob'],
          from: 'alice',
          time: time
        }
      });

      msg.content = ympp.message.content({
        encoding: 'plain',
        charset: 'utf8',
        type: 'application/json',
        data: new Buffer(JSON.stringify(d), 'utf8')
      });

      let encoded = ympp.message.encode(msg);
      let decoded = ympp.message.decode(encoded);

      expect(decoded.content.encoding).to.equal('plain');
      expect(decoded.content.charset).to.equal('utf8');
      expect(decoded.content.type).to.equal('application/json');
      expect(JSON.parse(decoded.content.data.toBuffer().toString())).to.deep.equal(d);

    });

  });

});
