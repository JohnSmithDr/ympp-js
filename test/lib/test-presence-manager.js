'use strict';

const expect = require('chai').expect;
const PresenceManager = require('../../lib/presence-manager');

describe('presence-manager', function () {

  let clients = [
    { id: 'foo', name: 'fooA' },
    { id: 'foo', name: 'fooB' },
    { id: 'foo', name: 'fooC' },
    { id: 'bar', name: 'bar0' },
    { id: 'gee', name: 'gee0' }
  ];

  let pm = new PresenceManager();

  describe('#present()', function () {

    it('should be ok', function () {

      let arr = [];

      pm.on('present', (x) => arr.push(x));
      clients.forEach(x => pm.present(x));

      expect(pm.count).to.equal(clients.length);
      expect(arr).to.deep.equal(clients);

    });

  });

  describe('#getClients()', function () {

    it('should be ok', function () {

      let arr = pm.getClients();
      expect(arr.map(x => x.id).sort()).to.deep.equal([ 'bar', 'foo', 'foo', 'foo', 'gee' ]);
      expect(arr.map(x => x.name).sort()).to.deep.equal([ 'bar0', 'fooA', 'fooB', 'fooC', 'gee0' ]);

    });

  });

  describe('#getClientsOfUser()', function () {

    it('should be ok', function () {

      let arr = pm.getClientsOfUser('foo');
      expect(arr.map(x => x.id).sort()).to.deep.equal([ 'foo', 'foo', 'foo' ]);
      expect(arr.map(x => x.name).sort()).to.deep.equal([ 'fooA', 'fooB', 'fooC' ]);

      arr = pm.getClientsOfUser('bar');
      expect(arr.map(x => x.id).sort()).to.deep.equal([ 'bar' ]);
      expect(arr.map(x => x.name).sort()).to.deep.equal([ 'bar0' ]);

      arr = pm.getClientsOfUser('gee');
      expect(arr.map(x => x.id).sort()).to.deep.equal([ 'gee' ]);
      expect(arr.map(x => x.name).sort()).to.deep.equal([ 'gee0' ]);

      arr = pm.getClientsOfUser('anonymous');
      expect(arr).to.be.an('array').and.have.length(0);

    });

  });

  describe('#absent()', function () {

    it('should be ok', function () {

      let arr = [];

      pm.on('absent', (x) => arr.push(x));
      clients.forEach(x => pm.absent(x));

      expect(pm.count).to.equal(0);
      expect(arr).to.deep.equal(clients);

    });

  });

});
