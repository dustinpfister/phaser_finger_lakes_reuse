import { ACTIONS as ACTIONS_COMMON } from '../common/action_common.js';

const ACTIONS = Object.assign({}, ACTIONS_COMMON);
ACTIONS.customer_goto_exit = {
    init: function (mdc, md, people, scene, person) {
        const hmd = md.hardMapData;
        const pos_exit = people.getMapSpawnLocation( md, person );
        person.setData('trigger_pos', {x: pos_exit.x, y: pos_exit.y });
        person.setData('path', []);
    },
    update : function(mdc, md, people, scene, person, opt, delta){
        const cPos = person.getTilePos();
        const tPos = person.getData('trigger_pos');
        if(cPos.x === tPos.x && cPos.y === tPos.y){
            this.setDone('at_exit');
        }
    },
    noPath: function (mdc, md, people, scene, person) {
        const cPos = person.getTilePos();
        const tPos = person.getData('trigger_pos');
        const hmd = md.hardMapData;
        if(tPos.x === -1 && tPos.y === -1){
            const pos_exit = people.getMapSpawnLocation( md, person );
            person.setData('trigger_pos', {x: pos_exit.x, y: pos_exit.y });
        }
        person.setPath(scene, md, tPos.x, tPos.y);
    }
};
ACTIONS.shopper_idle = {
    init: function (mdc, md, people, scene, person) {},
    update : function(mdc, md, people, scene, person, opt, delta){
        const items = md.donations.getItemType('Item');
        if(items.length === 0){
            this.setDone('no_items');
        }
        if(items.length >= 1){
            this.setDone('items_to_buy');
        }
    }
};
ACTIONS.shopper_wonder = {
    init: function (mdc, md, people, scene, person) {},
    update : function(mdc, md, people, scene, person, opt, delta){
        const items = md.donations.getItemType('Item', true),
        action = person.getData('act')
        if(items.length >= 1){
            action.setDone('items_found');
        }
    },
    noPath : function(mdc, md, people, scene, person){
        const tile = md.getRandomWalkTo();
        person.setPath(scene, md, tile.x, tile.y);
    }
};
ACTIONS.shopper_find_itemofinterest = {
    init: function (mdc, md, people, scene, person) {},
    update : function(mdc, md, people, scene, person, opt, delta){
        let ioi = person.getData('itemOfInterest');
        const items = md.donations.getItemType('Item', true);
        if(!ioi && items.length > 0){
            const iLen = items.length;
            const item = items[ Math.floor(Math.random() * iLen) ];
            person.setData('itemOfInterest', item);
            this.setDone('have_ioi');
        }
        if( !person.getData('itemOfInterest') || items.length === 0 ){
            this.setDone('no_ioi');
        }
    }
};
ACTIONS.shopper_buy_itemofinterest = {
    update: function (mdc, md, people, scene, person) {
        let ioi = person.getData('itemOfInterest');
        if(ioi){
            const pos_item = ioi.getTilePos();
            const pos_person = person.getTilePos();
            if( pos_person.x === pos_item.x && pos_person.y === pos_item.y ){
                person.x = pos_item.x * 16 + 8;
                person.y = pos_item.y * 16 + 8;
                let gs = scene.registry.get('gameSave');
                gs.money += ioi.price.shelf;
                scene.registry.set('gameSave', gs);
                people.clearAllIOI(ioi);
                ioi.destroy();
                person.setData('itemOfInterest', null);
                this.setDone('items_bought');
            }
        }
        if(!ioi){
            this.setDone('no_ioi_to_buy');
        }
    },
    noPath: function(mdc, md, people, scene, person, opt){
        let ioi = person.getData('itemOfInterest');  
        if(ioi){
            const pos_item = ioi.getTilePos();
            person.setPath(scene, md, pos_item.x, pos_item.y);
        }
    }
};
// an action where a person would like to find a location to drop off items
// that they have on hand that are unprocessed items to be donated to reuse.
// Once such a location has been found, the person will then go to that location.
ACTIONS.donation_goto_droplocation = {
    init: function (mdc, md, people, scene, person) {
        const tPos = person.getData('trigger_pos');
        tPos.x = -1; tPos.y = -1;
    },
    update: function (mdc, md, people, scene, person) {
        const onHand = person.getData('onHand');
        const cPos = person.getTilePos();
        const tPos = person.getData('trigger_pos');
        if( onHand.length > 0 && tPos.x === -1 && tPos.y === -1 ){
            const tiles_di = md.get_di_tiles( scene );
            if(tiles_di.length > 0){    
                const dt = tiles_di[ Math.floor( tiles_di.length * Math.random() ) ];
                const tiles_near_di = md.map.getTilesWithin(dt.x - 1, dt.y -1, 3, 3).filter( (tile) => { return md.canWalk(tile) });
                const t = tiles_near_di[ Math.floor( tiles_near_di.length * Math.random() ) ];
                person.setData('trigger_pos', {x: t.x, y: t.y });
            }
        }
        if( onHand.length === 0 ){
            this.setDone('nothing_on_hand');
        }
        if( cPos.x === tPos.x && cPos.y === tPos.y ){
           this.setDone('at_drop_location');
           person.setData('path', []);
       }
    },
    noPath: function (mdc, md, people, scene, person) {
       const cPos = person.getTilePos();
       const tPos = person.getData('trigger_pos');  
       if(tPos.x != -1 && tPos.y != -1 && !(cPos.x === tPos.x && cPos.y === tPos.y) ){
           person.setPath(scene, md, tPos.x, tPos.y);
       }
    }
};

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
