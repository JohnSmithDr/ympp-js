'use strict';

const expect = require('chai').expect;
const middleware = require('../../lib').middleware;

describe('message-middleware', function () {

  it('should be ok with arguments', function (done) {

    let mw = middleware(
      function (x, y, z, next) {
        x.value += 1;
        next();
      },
      function (x, y, z, next) {
        y.value += 2;
        next();
      },
      function (x, y, z, next) {
        z.value += 3;
        next();
      }
    );

    expect(mw).to.be.a('function');

    let x = { value: 0 }
      , y = { value: 0 }
      , z = { value: 0 };

    mw(x, y, z, (err) => {
      if (err) done(err);
      expect(x.value).to.equal(1);
      expect(y.value).to.equal(2);
      expect(z.value).to.equal(3);
      done();
    });

  });

  it('should be ok with array', function (done) {

    function addX(x, y, z, next) {
      x.value += 1;
      next();
    }

    function addY(x, y, z, next) {
      y.value += 2;
      next();
    }

    function addZ(x, y, z, next) {
      z.value += 3;
      next();
    }

    let mw = middleware([ addX, addY, addZ ]);

    expect(mw).to.be.a('function');

    let x = { value: 0 }
      , y = { value: 0 }
      , z = { value: 0 };

    mw(x, y, z, (err) => {
      if (err) done(err);
      expect(x.value).to.equal(1);
      expect(y.value).to.equal(2);
      expect(z.value).to.equal(3);
      done();
    });

  });

  it('should emit errors', function (done) {

    let mw = middleware(
      function (x, y, z, next) {
        next();
      },
      function (x, y, z, next) {
        next();
      },
      function (x, y, z, next) {
        next(Error('oops'));
      }
    );

    expect(mw).to.be.a('function');
    mw(0, 0, 0, (err) => {
      if (err) {
        expect(err.message).to.equal('oops');
        return done();
      }
      done(Error('should not be here'));
    });

  })

});
