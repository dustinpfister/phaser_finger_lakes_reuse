import { ConsoleLogger } from '../message/message.js';
const log = new ConsoleLogger({
    cat: 'lib',
    id: 'task'
});
const TASKS_DEFAULT = {};
TASKS_DEFAULT.default = {
    init: function (mdc, md, people, scene, person) {
        const pType = person.getData('type'),
        psType = person.getData('subType');
        if(pType === 'worker'){
            people.setTask(scene, mdc, md, person, 'di' );
        }
        
        if(pType === 'customer' && psType === 'donator'){
            people.setTask(scene, mdc, md, person, 'donate' );
        }
        
        if(pType === 'customer' && psType === 'shopper'){
            //log( person.name, psType );
            people.setTask(scene, mdc, md, person, 'shopping' );
        }
        
        
    },
    update: (mdc, md, people, scene, person) => {
    
    }
};
TASKS_DEFAULT.player_control = {
    init: (mdc, md, people, scene, person) => {
        people.setAction(scene, mdc, md, person, 'player_control' );
    },
    update: (mdc, md, people, scene, person) => {}
};
TASKS_DEFAULT.di = {
    init: (mdc, md, people, scene, person, opt) => {
        people.setAction(scene, mdc, md, person, 'worker_di_idle' );    
    },
    update: (mdc, md, people, scene, person, opt, delta) => {
    
    
        const done = person.getData('action_done');
        const oh = person.getData('onHand');
        const moh = person.getData('maxOnHand');
        const action = person.getData('act');
        const item = oh[0];
        // for one reason or another a worker finds themselves to be idle
        // while working di. There are a few outcomes here that involve where
        // they are, and what they have on hand at the moment
        if(action.done && action.key == 'worker_di_idle'){
            if(action.result === 'empty_handed'){
                people.setAction(scene, mdc, md, person, 'worker_di_return' );
            }
            if(action.result === 'have_items'){
                 if(md.index != 4){
                     people.setAction(scene, mdc, md, person, 'worker_di_process', {   } );
                 }
                 if(md.index === 4){
                     people.setAction(scene, mdc, md, person, 'goto_map', { index: 1 } );
                 }
            }
            if( action.result === 'idle_without_items' ){
                if(md.index === 4){
                    const count_empty = md.donations.getEmpties().length;
                    const count_drops = md.donations.getDrops().length;
                    if(count_empty > 0){
                        people.setAction(scene, mdc, md, person, 'pickup_empty', { } );
                        return;
                    }
                    if(count_drops > 0){
                        people.setAction(scene, mdc, md, person, 'pickup_drop', { } );
                        return;
                    }
                    people.setAction(scene, mdc, md, person, 'wonder', { 
                        getOut : function(mdc, md, people, scene, person, opt){
                            return count_empty > 0 || count_drops > 0;
                        }
                    });
                }
                if(md.index != 4){
                    people.setAction(scene, mdc, md, person, 'worker_di_return' );
                }
            }
            if( action.result === 'idle_with_items' ){
                if(md.index === 4){
                    if(item.iType === 'Item'){
                        people.setAction(scene, mdc, md, person, 'goto_map', { index: 1 } );
                    }
                    if(item.iType === 'Container' && item.isEmpty() ){ 
                        people.setAction(scene, mdc, md, person, 'worker_di_recycle_empty', { } );
                    }
                    if(item.iType === 'Container' && !item.isEmpty() ){ }
                }
                if(md.index != 4){
                    people.setAction(scene, mdc, md, person, 'worker_di_process', {   } );
                }
            }
        }
        if( action.done && action.key == 'goto_map' ){
            // (only one result 'at_map' )
            if(md.index != 4){
                people.setAction(scene, mdc, md, person, 'worker_di_process', {   } );
            }
            if(md.index === 4){
                people.setAction(scene, mdc, md, person, 'worker_di_idle', {   } );
            }
        }
        if( action.done && action.key === 'pickup'){
                people.setAction(scene, mdc, md, person, 'worker_di_idle', {   } );
        }
        if( action.done && action.key === 'pickup_drop'){
            // possible results > 'no_empty_items'
            if(action.result === 'no_empty_items'){
                log('di worker has a result of no_empty_items when set to pickup_drop action!');
                log('set to worker_di_idle then?...\n\n');
                people.setAction(scene, mdc, md, person, 'worker_di_idle', {   } );
            }
        }
        if( action.done && action.key === 'pickup_empty'){
            // possible results > 'have_empty'
            if(action.result == 'have_empty'){
                people.setAction(scene, mdc, md, person, 'worker_di_recycle_empty', { } );
            }
            if(action.result != 'have_empty'){
                log('pickup_empty action ended in a result other than have_empty result is :' + action.result);
            } 
        }
        if( action.done && action.key === 'worker_di_recycle_empty'){
            // possible results > 'nothing_on_hand', 'no_spot', 'no_bin', 'at_bin'
            if(action.result === 'at_bin'){
                const ioi = person.getData('itemOfInterest');
                people.setAction(scene, mdc, md, person, 'drop', { at: ioi, count: 1 });
            }
            if(action.result === 'nothing_on_hand' || action.result === 'no_spot' || action.result === 'no_bin' ){
                people.setAction(scene, mdc, md, person, 'worker_di_idle', {   } );
            }
        }
        if( action.done && action.key === 'drop' ){
            // possible results > 'no_space', 'items_droped'
            if(action.result === 'items_droped'){
                people.setAction(scene, mdc, md, person, 'worker_di_idle', {   } );
            }
            if(action.result === 'no_space'){
                log('di worker can not complete a drop action, as there is no space!?');
                log('set to worker_di_idle then?...\n\n');
                people.setAction(scene, mdc, md, person, 'worker_di_idle', {   } );
            }
        }
        
        if(action.done && action.key == 'worker_di_return'){
            // possible results > 'at_di'
            people.setAction(scene, mdc, md, person, 'worker_di_idle' );
        }
    }
};
TASKS_DEFAULT.shopping = {
    init: (mdc, md, people, scene, person) => {
        people.setAction(scene, mdc, md, person, 'shopper_idle' );
    },
    update: (mdc, md, people, scene, person) => {
        const act = person.getData('act');
        if( act.key === 'shopper_idle' && act.done ){
            if(act.result === 'no_items'){
                people.setAction(scene, mdc, md, person, 'shopper_wonder', { } );
            }
            if(act.result === 'items_to_buy'){
                people.setAction(scene, mdc, md, person, 'shopper_find_itemofinterest', { } );
            }   
        }
        if( act.key === 'shopper_wonder' && act.done ){
            if(act.result === 'items_found'){
                people.setAction(scene, mdc, md, person, 'shopper_find_itemofinterest', { } );
            }
        }
        if( act.key === 'shopper_find_itemofinterest' && act.done ){
            if(act.result === 'have_ioi'){
                people.setAction(scene, mdc, md, person, 'shopper_buy_itemofinterest', { } );
            }
            if(act.result === 'no_ioi'){
                people.setAction(scene, mdc, md, person, 'shopper_idle', { } );
            }
        }
        if( act.key === 'shopper_buy_itemofinterest' && act.done ){
            if( act.result === 'items_bought' || act.result === 'no_ioi_to_buy' ){
                people.setAction(scene, mdc, md, person, 'shopper_idle', { } );
            }
        }
    }
};
TASKS_DEFAULT.donate = {
    init: (mdc, md, people, scene, person) => {
        people.setAction(scene, mdc, md, person, 'donation_goto_droplocation' );
    },
    update: (mdc, md, people, scene, person) => {
        const action = person.getData('act');
        if( action.done ){
            if(action.key === 'donation_goto_droplocation'){
                people.setAction(scene, mdc, md, person, 'drop', { max_tiles: 16 } );
                return;
            }
            if(action.key === 'drop'){
                people.setAction(scene, mdc, md, person, 'customer_goto_exit' );
                return;
            }
            if(action.key === 'customer_goto_exit' && action.result === 'at_exit' ){
                people.kill(person);
                return;
            }
        } 
        const max_donations = scene.registry.get('MAX_MAP_DONATIONS') || 10;
        const donations = md.donations;
        const donations_incoming = people.totalOnHandItems();
        const donations_drop = donations.children.size;
        const donations_total = donations_incoming + donations_drop;
        if(donations_total >= max_donations){
            people.setAction(scene, mdc, md, person, 'customer_goto_exit');
        }
    }
};

const TASK_DEFAULTS = { key : 'default' };
class Task {
    constructor (scene, people, person, opt={}) {
        opt = Object.assign({}, TASK_DEFAULTS, opt);
        this.TASKS = opt.TASKS || TASKS_DEFAULT;
        this.key = opt.key;
        this.opt = opt;
    }
    init (mdc, md, people, scene, person) {
        const task = this.TASKS[ this.key ];
        if(!task){
            log('no task for key: ' + this.key);
            return;
        }
        const init = task.init;
        if(init){
           init.call(this, mdc, md, people, scene, person, this.opt);
        }
    }
    update (mdc, md, people, scene, person, delta) {
        const task = this.TASKS[ this.key ];
        if(!task){
            log('no task object for key: ' + this.key);
            return;
        }
    
        const update = task.update;
        if(update){
            update.call(this, mdc, md, people, scene, person, this.opt, delta);
        }
    }
};

export { Task, TASKS_DEFAULT }
