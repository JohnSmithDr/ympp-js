'use strict';

const expect = require('chai').expect;
const MessageProcessor = require('../../lib/message-processor');

describe('message-processor', function () {


  describe('#use()', function () {

    it('should be ok with common handler', function (done) {

      let mp = new MessageProcessor();

      mp.use(
          (m, c, s, next) => {
            m.value = 0;
            next();
          })
        .use(
          (m, c, s, next) => {
            m.value += 1;
            next();
          },
          (m, c, s, next) => {
            m.value += 2;
            next();
          },
          (m, c, s, next) => {
            m.value += 3;
            next();
          });

      expect(mp._stack).to.have.length(2);

      let m = { value: null };

      mp.process(m, 0, 0, (err) => {
        if (err) return done(err);
        expect(m.value).to.equal(6);
        done();
      });

    });

    it('should be ok with specific handler', function () {

      let mp = new MessageProcessor();

      mp.use('foo', (m, c, s, next) => {
          m.value += 10;
          next();
        })
        .use('bar', (m, c, s, next) => {
          m.value += 100;
          next();
        });

      expect(mp._stack).to.have.length(2);

      let t1 = new Promise((res, rej) => {
        let m = { intent: 'foo', value: 0 };
        mp.process(m, 0, 0, (err) => {
          if (err) return rej(err);
          expect(m.value).to.equal(10);
          res(1);
        });
      });

      let t2 = new Promise((res, rej) => {
        let m = { intent: 'bar', value: 0 };
        mp.process(m, 0, 0, (err) => {
          if (err) return rej(err);
          expect(m.value).to.equal(100);
          res(1);
        });
      });

      return Promise.all([ t1, t2 ]);

    });

  });

  describe('#process()', function () {

    it('should be ok', function () {

      let mp = new MessageProcessor();

      mp.use((m, c, s, next) => {
          m.value = 0;
          next();
        })
        .use('foo', (m, c, s, next) => {
          m.value += 10;
          next();
        })
        .use('bar', (m, c, s, next) => {
          m.value += 100;
          next();
        })
        .use('else', () => {
          throw Error('oops');
        })
        .use((m, c, s, next) => {
          m.value += 1;
          next();
        });

      expect(mp._stack).to.have.length(5);

      let t1 = new Promise((res, rej) => {
        let m = { intent: 'foo', value: -1 };
        mp.process(m, 0, 0, (err) => {
          if (err) return rej(err);
          expect(m.value).to.equal(11);
          res('pass foo');
        });
      });

      let t2 = new Promise((res, rej) => {
        let m = { intent: 'bar', value: -1 };
        mp.process(m, 0, 0, (err) => {
          if (err) return rej(err);
          expect(m.value).to.equal(101);
          res('pass bar');
        });
      });

      let t3 = new Promise((res, rej) => {
        let m = { intent: 'else', value: -1 };
        mp.process(m, 0, 0, (err) => {
          if (err) {
            expect(err.message).to.equal('oops');
            return res('pass else');
          }
          rej(Error('should not go here'));
        });
      });

      return Promise.all([ t1, t2, t3 ]);


    });

  });

});
