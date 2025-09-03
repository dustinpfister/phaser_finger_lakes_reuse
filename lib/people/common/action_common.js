import { ACTIONS as ACTIONS_PICKUP } from './action_common_pickup.js';
import { ACTIONS as ACTIONS_DROP } from './action_common_drop.js';
import { ACTIONS as ACTIONS_GOTO_MAP } from './action_common_goto_map.js';
import { ACTIONS as ACTIONS_WONDER } from './action_wonder.js';

const ACTIONS = Object.assign({}, ACTIONS_PICKUP, ACTIONS_DROP, ACTIONS_GOTO_MAP, ACTIONS_WONDER );

ACTIONS.player_control = {
    init: function (mdc, md, people, scene, person) {}
};

export { ACTIONS };
