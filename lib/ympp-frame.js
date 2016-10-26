'use strict';

const TextWriter = require('./text-writer');

function YmppFrame (id, headers, body) {
  this._id = id;
  this._headers = headers || {};
  this._body = body;
}

Object.defineProperty(YmppFrame.prototype, 'id', {
  get: function () {
    return this._id;
  }
});

Object.defineProperty(YmppFrame.prototype, 'headers', {
  get: function () {
    return this._headers;
  }
});

Object.defineProperty(YmppFrame.prototype, 'body', {
  get: function () {
    return this._body;
  }
});

YmppFrame.stringify = function (frame) {

  // let writer = TextWriter.create().write('YMPP ').writeLine(frame.id);
  //
  // frame.headers.forEach(header => {
  //   writer.writeLine(`${header[0]}: ${header[1]}`);
  // });
  //
  // writer.writeLine();
  //
  // if (frame.body) {
  //   writer.writeLine(frame.body);
  // }
  //
  // return writer.toString();

};

YmppFrame.parse = function (buffer) {



};

module.exports = YmppFrame;
