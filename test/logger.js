'use strict';

let env = process.env.NODE_ENV;

const logger = require('tracer')
  .colorConsole({
    format: [
      `[{{title}}] ({{file}}:{{line}}) {{message}}`,
      { error: `[{{title}}] ({{file}}:{{line}}) {{message}}\nCall Stack:\n{{stack}}` }
    ],
    level: env === 'test' ? 'error' : 'debug'
  });

module.exports = logger;
