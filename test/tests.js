'use strict';

describe('tests', function () {

  describe('ympp-core', function () {
    require('./lib/test-message-middleware');
    require('./lib/test-message-processor');
    require('./lib/test-presence-manager');
    require('./lib/test-ympp-message');
    require('./lib/test-ympp-client');
  });

  describe('examples', function () {

  });

});
