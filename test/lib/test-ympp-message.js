'use strict';

const expect = require('chai').expect;
const ympp = require('../../lib/');
const logger = require('../logger');

describe('ympp-message', function () {

  it('should be ok', function () {

    let time = +Date.now();

    let msg = ympp.message({
      intent: 'greeting',
      header: {
        id: '1',
        from: ['alice'],
        to: ['bob', 'carter'],
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
        data: new Buffer('Hello World', 'utf8')
      }
    });

    let encoded = ympp.message.encode(msg);
    let decoded = ympp.message.decode(encoded);

    logger.debug(encoded.length);
    logger.debug(encoded);
    logger.debug(decoded);

    expect(decoded.intent).to.equal('greeting');
    expect(decoded.header.id).to.equal('1');
    expect(decoded.header.from).to.include('alice');
    expect(decoded.header.to).to.include.members(['bob', 'carter']);
    expect(decoded.header.channel).to.equal('101');
    expect(decoded.header.time.toNumber()).to.equal(time);
    expect(decoded.header.extra.get('foo')).to.equal('FOO');
    expect(decoded.header.extra.get('bar')).to.equal('BAR');
    expect(decoded.content.encoding).to.equal('plain');
    expect(decoded.content.charset).to.equal('utf8');
    expect(decoded.content.type).to.equal('text/plain');
    expect(decoded.content.data.toBuffer().toString()).to.equal('Hello World');
  });

});
