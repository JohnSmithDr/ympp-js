'use strict';

const ympp = require('./protocols/ympp')['ympp'];

function message(props) {
  return new ympp.YmppMessage(props);
}

function header(props) {
  return new ympp.YmppMessage.Header(props);
}

function content(props) {
  return new ympp.YmppMessage.Content(props);
}

function encode(message) {
  return message.encode().toBuffer();
}

function decode(data) {
  return ympp.YmppMessage.decode(data);
}

message.header = header;
message.content = content;
message.encode = encode;
message.decode = decode;

module.exports = message;
