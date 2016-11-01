'use strict';

const _ = require('lodash');

module.exports = function middleware() {

  let fn = _.flatten(Array.from(arguments));

  return function (message, client, server, next) {

    let i = 0;

    let callback = (err) => {

      // get error
      if (err) return next(err);

      // no more handler to forward
      if (i >= fn.length) return next();

      try {
        return fn[i++](message, client, server, callback);
      }
      catch(err) {
        return next(err);
      }
    };

    callback();
  }

};
