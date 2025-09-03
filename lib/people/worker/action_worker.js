import { ACTIONS as ACTIONS_COMMON } from '../common/action_common.js';
import { ACTIONS as ACTIONS_PICKUP_DROP } from './action_worker_pickup_drop.js';
import { ACTIONS as ACTIONS_WORKER_PICKUP_EMPTY } from './action_worker_pickup_empty.js';
import { ACTIONS as ACTIONS_WORKER_IDLE  } from './action_worker_di_idle.js';
import { ACTIONS as ACTIONS_WORKER_RETURN  } from './action_worker_di_return.js';
import { ACTIONS as ACTIONS_WORKER_RECYLE_EMPTY  } from './action_worker_di_recycle_empty.js';
import { ACTIONS as ACTIONS_WORKER_DI_PROCESS  } from './action_worker_di_process.js';

const ACTIONS_WORKER = Object.assign( {}, ACTIONS_PICKUP_DROP, ACTIONS_WORKER_PICKUP_EMPTY );
const ACTIONS_DI = Object.assign( {}, ACTIONS_WORKER_IDLE, ACTIONS_WORKER_RETURN, ACTIONS_WORKER_RECYLE_EMPTY, ACTIONS_WORKER_DI_PROCESS );
const ACTIONS = Object.assign({}, ACTIONS_COMMON, ACTIONS_WORKER, ACTIONS_DI );

ACTIONS.default = {
    init: function (mdc, md, people, scene, person) {},
    noPath: function (mdc, md, people, scene, person, opt) {}
};

export { ACTIONS };
