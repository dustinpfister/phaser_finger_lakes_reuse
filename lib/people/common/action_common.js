import { ACTIONS as ACTIONS_PICKUP } from './action_common_pickup.js';
import { ACTIONS as ACTIONS_DROP } from './action_common_drop.js';
import { ACTIONS as ACTIONS_GOTO_MAP } from './action_common_goto_map.js';

const ACTIONS = Object.assign({}, ACTIONS_PICKUP, ACTIONS_DROP, ACTIONS_GOTO_MAP );
ACTIONS.default = {
    init: function (mdc, md, people, scene, person) {
    },
    noPath: function (mdc, md, people, scene, person, opt) {}
};
ACTIONS.player_control = {
    init: function (mdc, md, people, scene, person) {}
};
ACTIONS.wonder = {
    opt: {
        next_spot: false,
        pause : 1200,
        t: 0,
        getOut : function(mdc, md, people, scene, person, opt){
            return false
        }
    },
    update: function (mdc, md, people, scene, person, opt, delta) {
        const action = person.getData('act');
        opt.t -= delta;
        opt.t = opt.t < 0 ? 0 : opt.t;
        if( opt.getOut(mdc, md, people, scene, person, opt) ){
            action.setDone('get_func_true');
        } 
    },
    noPath: function (mdc, md, people, scene, person, opt) {
        if(!opt.next_spot){
           opt.t = opt.pause;
           opt.next_spot = true;
        }
        if(opt.next_spot && opt.t === 0){
            const tile = md.getRandomWalkTo();
            person.setPath(scene, md, tile.x, tile.y);
            opt.next_spot = false
        }
    }
};
export { ACTIONS };
