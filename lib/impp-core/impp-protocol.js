'use strict';

class ImppProtocol {

  get connectionEventName() {
    return 'impp_connection';
  }

  get connectionClosedEventName() {
    return 'impp_connection_closed';
  }

  get messageEventName() {
    return 'impp_message';
  }

  get receiveMessageErrorEventName() {
    return 'impp_receive_message_error';
  }

  handshake(conn, callback) {
    // TODO: process handshake with client connection
    throw Error('Not Implemented');
  }

  parseMessage(data) {
    // TODO: parse received data into protocol message
    throw Error('Not Implemented');
  }

  serializeMessage(message) {
    // TODO: serialize protocol message into data to send
    throw Error('Not Implemented');
  }

}

module.exports = ImppProtocol;
