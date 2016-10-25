'use strict';

class ClientCollection {

  constructor() {
    this._clients = new Set();
    this._map = new Map();
  }

  add(clientId, client) {
    let coll = this._map.get(clientId) || new Set();
    coll.add(client);
    this._map.set(clientId, coll);
    this._clients.add(client);
    return this;
  }

  remove(clientId, client) {
    this._clients.delete(client);
    let coll = this._map.get(clientId);
    if (coll) coll.delete(client);
    if (coll && coll.size === 0) this._map.delete(clientId);
    return this;
  }

  getClientsById(clientId) {
    return Array.from(this._map.get(clientId) || []);
  }

  toArray() {
    return Array.from(this._clients);
  }

  get size() {
    return this._clients.size;
  }

}

module.exports = ClientCollection;
