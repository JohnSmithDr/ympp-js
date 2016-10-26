'use strict';

function TextWriter() {
  this._buffer = [];
  this._eol = '\r\n';
}

function clear() {
  this._buffer.length = 0;
  return this;
}

function write(str) {
  this._buffer.push(str);
  return this;
}

function writeLine(str) {
  if (str && str.length) this.write(str);
  return this.write(this._eol);
}

function toString() {
  return this._buffer.join('');
}

TextWriter.prototype = { clear, write, writeLine, toString };

TextWriter.create = function create() {
  return new TextWriter();
};

module.exports = TextWriter;
