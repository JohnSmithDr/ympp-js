'use strict';

const EventEmitter = require('events');

class PresenceManager extends EventEmitter {

  constructor() {
    super();
    this._clients = new Set();
    this._clientsMap = new Map();
  }

  present(client) {
    this._addClient(client.id, client);
    this.emit('present', client);
  }

  absent(client) {
    this._removeClient(client.id, client);
    this.emit('absent', client);
  }

  getClients() {
    return Array.from(this._clients);
  }

  getClientsOfUser(id) {
    return Array.from(this._clientsMap.get(id) || []);
  }

  _addClient(id, client) {
    let coll = this._clientsMap.get(id) || new Set();
    coll.add(client);
    this._clientsMap.set(id, coll);
    this._clients.add(client);
    return this;
  }

  _removeClient(id, client) {
    this._clients.delete(client);
    let coll = this._clientsMap.get(id);
    if (coll) coll.delete(client);
    if (coll && coll.size === 0) this._clientsMap.delete(id);
    return this;
  }

  get count() {
    return this._clients.size;
  }

}

module.exports = PresenceManager;
