'use strict';

const EventEmitter = require('events');
const ClientCollection = require('./client-collection');

class PresenceManager extends EventEmitter {

  constructor() {
    this._clients = new ClientCollection();
  }

  present(client) {
    this._clients.add(client.id, client);
    this.emit('present', client);
  }

  absent(client) {
    this._clients.remove(client.id, client);
    this.emit('absent', client);
  }

  getClients() {
    return this._clients.toArray();
  }

  getClientsOfUser(id) {
    return this._clients.getClientsById(id);
  }

}
