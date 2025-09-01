import { ACTIONS_CORE } from "../action_core.js";
import { ACTIONS_WORKER_DI } from "../action_worker_di.js";

const ACTIONS_WORKER = Object.assign(ACTIONS_CORE, ACTIONS_WORKER_DI);

const TASKS_WORKER = {};

TASKS_WORKER.default = {
    init: function (mdc, md, people, scene, person) { 
        const main_task = person.getData('main_task');
        console.log('**********DEFAULT WORKER TASK **********');
        console.log('name : ' + person.name);
        console.log('main task : ' + main_task);
        if(!main_task || main_task === 'default'){
            console.log('sense I do not have a main task, I should get one.');
            person.setData('main_task', 'di');
        }        
        console.log('****************************************');
    },
    update: (mdc, md, people, scene, person) => {
        people.setTask(scene, mdc, md, person, person.getData('main_task') );
    }
};

TASKS_WORKER.di = {
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

export { TASKS_WORKER, ACTIONS_WORKER };
