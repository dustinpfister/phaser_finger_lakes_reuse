import { ACTIONS } from './action_customer.js';


const TASKS = {};

TASKS.default = {
    init: function (mdc, md, people, scene, person) {
        const pType = person.getData('type'),
        psType = person.getData('subType');
            
        if(pType === 'customer' && psType === 'donator'){
            people.setTask(scene, mdc, md, person, 'donate' );
        }
        if(pType === 'customer' && psType === 'shopper'){
            people.setTask(scene, mdc, md, person, 'shopping' );
        }
    },
    update: (mdc, md, people, scene, person) => {
    
    }
};

TASKS.shopping = {
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
TASKS.donate = {
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


export { ACTIONS, TASKS };
