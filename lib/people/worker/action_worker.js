import { ACTIONS as ACTIONS_COMMON } from '../common/action_common.js';
import { ACTIONS as ACTIONS_PICKUP_DROP } from './action_worker_pickup_drop.js';
import { ACTIONS as ACTIONS_WORKER_PICKUP_EMPTY } from './action_worker_pickup_empty.js';
import { ACTIONS as ACTIONS_WORKER_DI } from './action_worker_di.js';

const ACTIONS = Object.assign({}, ACTIONS_COMMON, ACTIONS_PICKUP_DROP, ACTIONS_WORKER_DI, ACTIONS_WORKER_PICKUP_EMPTY );

ACTIONS.default = {
    init: function (mdc, md, people, scene, person) {
    },
    noPath: function (mdc, md, people, scene, person, opt) {}
};

export { ACTIONS };
