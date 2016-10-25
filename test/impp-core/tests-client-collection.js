'use strict';

const expect = require('chai').expect;
const ClientCollection = require('../../lib/impp-core').ClientCollection;

describe('client-collection', function () {

  it('should be ok', function () {

    let coll = new ClientCollection();
    coll.add('foo', 'fooA');
    coll.add('foo', 'fooB');
    coll.add('foo', 'fooC');
    coll.add('bar', 'bar');
    coll.add('gee', 'gee');

    expect(coll.size).to.equal(5);
    expect(coll.toArray()).to.include.members(['fooA', 'fooB', 'fooC', 'bar', 'gee']);
    expect(coll.getClientsById('foo')).to.include.members(['fooA', 'fooB', 'fooC']);

    expect(coll.remove('foo', 'fooD').size).to.equal(5);
    expect(coll.remove('foo', 'fooC').size).to.equal(4);
    expect(coll.remove('foo', 'fooB').size).to.equal(3);
    expect(coll.remove('foo', 'fooA').size).to.equal(2);
    expect(coll.remove('foo', 'fooA').size).to.equal(2);
    expect(coll.remove('bar', 'bar').size).to.equal(1);
    expect(coll.remove('gee', 'gee').size).to.equal(0);

  });

});
