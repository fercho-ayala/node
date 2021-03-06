'use strict';

const common = require('../common');
const initHooks = require('./init-hooks');
const verifyGraph = require('./verify-graph');
const TIMEOUT = 1;

const hooks = initHooks();
hooks.enable();

setTimeout(common.mustCall(ontimeout), TIMEOUT);
function ontimeout() {
  setTimeout(onsecondTimeout, TIMEOUT + 1);
}

function onsecondTimeout() {
  setTimeout(onthirdTimeout, TIMEOUT + 2);
}

function onthirdTimeout() {}

process.on('exit', onexit);

function onexit() {
  hooks.disable();
  verifyGraph(
    hooks,
    [ { type: 'Timeout', id: 'timeout:1', triggerId: null },
      { type: 'TIMERWRAP', id: 'timer:1', triggerId: null },
      { type: 'Timeout', id: 'timeout:2', triggerId: 'timeout:1' },
      { type: 'TIMERWRAP', id: 'timer:2', triggerId: 'timeout:1' },
      { type: 'Timeout', id: 'timeout:3', triggerId: 'timeout:2' },
      { type: 'TIMERWRAP', id: 'timer:3', triggerId: 'timeout:2' } ]
  );
}
