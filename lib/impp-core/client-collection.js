'use strict';

class ClientCollection {

  constructor() {
    this._clients = new Set();
    this._map = new Map();
  }

  get toArray() {
    return Array.from(this._clients);
  }

  add(clientId, client) {
    let coll = this._map.get(clientId) || new Set();
    coll.add(client);
    this._map.set(clientId, coll);
    this._clients.add(client);
  }

  remove(clientId, client) {
    this._clients.delete(client);

    if (!this._map.has(clientId)) return;

    let coll = this._map.get(clientId);
    coll.delete(value);

    if (coll.size === 0) this._map.delete(clientId);
  }

  getClientsById(clientId) {
    return Array.from(this._map(clientId) || []);
  }

}

module.exports = ClientCollection;
