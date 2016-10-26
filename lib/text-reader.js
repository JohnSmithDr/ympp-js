'use strict';

function TextReader(text) {
  this._text = text;
  this._position = 0;
  this._eol = '\r\n';
}

function position() {
  return this._position;
}

function available() {
  return this._position < this._text.length
    ? this._text.length - this._position
    : 0;
}

function peek(count) {
  count = count || 1;
  return this._text.substring(this._position, this._position + count);
}

function read(count) {
  count = count || 1;
  let chunk = this._text.substring(this._position, this._position + count);
  this._position += chunk.length;
  return chunk;
}

function readToEnd() {
  let chunk = this._text.substring(this._position);
  this._position += chunk.length;
  return chunk;
}

function readLine() {
  let nextPos = this._text.indexOf(this._eol, this._position);
  if (nextPos < 0) return this.readToEnd();
  let chunk = this._text.substring(this._position, nextPos);
  this._position = this._position + chunk.length + this._eol.length;
  return chunk;
}

TextReader.prototype = { position, available, peek, read, readToEnd, readLine };

TextReader.create = function create(text) {
  return new TextReader(text);
};

module.exports = TextReader;
