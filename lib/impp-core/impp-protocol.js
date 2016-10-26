'use strict';

class ImppProtocol {

  handshake(conn, callback) {
    return callback(true);
  }

  parseMessage(data) {
    return data;
  }

  serializeMessage(message) {
    return message;
  }

  static create(delegates) {
    return new DelegatedImppProtocol(delegates);
  }

}

class DelegatedImppProtocol extends ImppProtocol {

  constructor(delegates) {
    super();
    this._delegates = delegates || {};
  }

  handshake(conn, callback) {
    return this._invokeDelegatedMethod('handshake', [ conn, callback ]);
  }

  parseMessage(data) {
    return this._invokeDelegatedMethod('parseMessage', [ data ]);
  }

  serializeMessage(message) {
    return this._invokeDelegatedMethod('serializeMessage', [ message ]);
  }

  _invokeDelegatedMethod(methodName, args) {
    return typeof this._delegates[methodName] === 'function'
      ? this._delegates[methodName].apply(this, args)
      : this._noop();
  }

  _noop() {

  }
}

module.exports = ImppProtocol;
