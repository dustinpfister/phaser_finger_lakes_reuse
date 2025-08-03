import { PathFinder } from "../pathfinding.js";
import { Item, ItemCollection, Container } from "../items.js";
import { ConsoleLogger } from '../message.js';
const log = new ConsoleLogger({
    cat: 'lib',
    id: 'people',
    appendId: true
});
const NOOP = function(){};
/********* **********
 1.0) ACTIONS 
********** **********/
const ACTIONS = {};
/********* **********
  1.1) ACTIONS - drop
********** **********/
ACTIONS.drop = {
    opt : {
        max_tiles: 8,
        count: 1,
        at: null,
        empty: [1]
    },
    init: function (mdc, md, people, scene, person, opt) {
        const onHand = person.getData('onHand');
        const action = person.getData('act');
        person.setData('itemMode', 2);
        if( onHand.length > 0 ){
            let i_item = onHand.length;
            let dc = 0;
            while(i_item-- && dc != opt.count ){
                const item = onHand[i_item];    
                let pos_drop = md.findEmptyDropSpot( person.getTilePos(), opt.max_tiles, opt.empty );
                if(opt.at){
                    pos_drop = opt.at;
                }         
                if(pos_drop === null){
                    person.say('I can not find a space to drop items!');
                    action.setDone('no_space');
                }
                if(pos_drop != null){
                    if(pos_drop.iType === 'Container' && opt.at){
                        const pos = pos_drop.getTilePos();
                        people.onHandAction(scene, person, pos_drop, md, pos.x, pos.y);
                    }else{
                        item.x = pos_drop.x * 16 + 8;
                        item.y = pos_drop.y * 16 + 8;
                        item.droped = true;
                        mdc.addItemTo(item, md, 'donations');
                        people.onHand.remove(item);
                        person.setData('onHand', []);
                    }
                }
            }
            action.setDone('items_droped');
        }
    }
};
/********* **********
  1.2) ACTIONS - pickup
********** **********/
ACTIONS.pickup = {
    opt : {
        container: false,
        canRecyle: false,
        min_dist: 2,
        max_items: 3,
        type: 'drop'
    },  
    init: function (mdc, md, people, scene, person, opt, delta) {
        person.setData('itemOfInterest', null);
    },    
    update: function (mdc, md, people, scene, person, opt, delta) {
        const oh = person.getData('onHand'), action = person.getData('act');
        if(oh.length >= opt.max_items){
            action.setDone('have_items');
            person.setData('path', []);    
        }
    },
    noPath : function(mdc, md, people, scene, person, opt){
        const action = person.getData('act');
        person.setData('itemMode', 1);
        if(opt.container){
            person.setData('itemMode', 3);
        }
        let ioi = person.getData('itemOfInterest');
        const oh = person.getData('onHand');
        const moh = person.getData('maxOnHand');
        if(!ioi && oh.length < opt.max_items){
            let items = [];
            if(opt.type === 'drop'){
                items = md.donations.getDrops();
            }
            if(opt.type === 'empty'){
                items = md.donations.getEmpties( opt.canRecyle );
            }
            if(items.length > 0){
                ioi = items[0];
                person.setData('itemOfInterest', ioi);
            }
            if(items.length === 0){
                person.say('No Items to Pickup!');
                action.setDone('no_items');
            }
        }
        if(ioi){
            const pos_item = ioi.getTilePos();
            const d = Phaser.Math.Distance.BetweenPoints(pos_item, person.getTilePos());
            if(d > opt.min_dist){
                const tile = md.findWalkToNear(pos_item, 10);
                if(tile){
                    person.setPath(scene, md, tile.x, tile.y);
                }
                if(!tile){
                    person.say('I can not get to an Item!');
                    person.setDone('can_not_get_to');
                }
            }
            if(d <= opt.min_dist && opt.type === 'drop'){
                people.onHandAction(scene, person, ioi, md, pos_item.x, pos_item.y);
                action.setDone('pickup_drop');
                person.setData('itemOfInterest', null);
            }
            if(d <= opt.min_dist && opt.type === 'empty'){
                people.onHandAction(scene, person, ioi, md, pos_item.x, pos_item.y);
                action.setDone('pickup_empty');
                person.setData('itemOfInterest', null);
            }       
        }
    }
};
/********* **********
  1.3) ACTIONS - goto_map
********** **********/
ACTIONS.goto_map = {
    opt: {
        index: 1,
        pos: null
    },
    update: function (mdc, md, people, scene, person, opt) {
        const action = person.getData('act');
        const pos1 = person.getTilePos();
        if(md.index === opt.index){
            if(opt.pos){
                person.setPath(scene, md, pos.x, pos.y);
            }
            action.setDone('at_map');
        }
    },
    noPath: function (mdc, md, people, scene, person, opt) {
        const pos1 = person.getTilePos();
        let door = md.getDoorAt(pos1.x, pos1.y);
        if(!door || (door && md.index != opt.index)){   
            const options = md.hardMapData.doors.map((door)=>{  return door.to.mapNum });
            const min = Math.min.apply(null, options);  
            const door_to_map = options.some(( mapNum )=>{ return mapNum === opt.index  });
            const to_map = door_to_map ? opt.index : min;
            let pos2 = md.findDoorFrom(pos1.x, pos1.y, to_map, false);
            if(pos2){
                person.setPath(scene, md, pos2.x, pos2.y);
            }
        }
    }
};
/********* **********
  1.3) ACTIONS - what_do
********** **********/
ACTIONS.what_do = {
    init: function (mdc, md, people, scene, person) {
        person.setData('path', [] );
    }
};
/********* **********
  1.4) ACTIONS - wonder
********** **********/
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
/********* **********
  1.5) ACTIONS - customer_goto_exit
********** **********/
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
/********* **********
  1.6) ACTIONS - shopper_idle
********** **********/
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
/********* **********
  1.7) ACTIONS - shopper_wonder
********** **********/
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
/********* **********
  1.8) ACTIONS - shopper_find_itemofinterest
********** **********/
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
/********* **********
  1.9) ACTIONS - shopper_buy_itemofinterest
********** **********/
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
/********* **********
  1.10) ACTIONS - donation_goto_droplocation
********** **********/
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
            const tiles_di = get_di_tiles(scene, md.map);
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
/********* **********
  1.11) ACTIONS - worker_di_idle
********** **********/
ACTIONS.worker_di_idle = {
    opt:{},
    update: function (mdc, md, people, scene, person, opt) {
        const player = scene.registry.get('player');
        if( person === player ){
            this.setDone('player_control');
            return;
        }
        const oh = person.getData('onHand');
        if( md.index != 4 && oh.length === 0 ){
             this.setDone('empty_handed');
        }
        if( md.index === 4){
             this.setDone('at_di_back');
        }
    }
};
/********* **********
  1.12) ACTIONS - worker_di_return
********** **********/
ACTIONS.worker_di_return = {
    init: function (mdc, md, people, scene, person) {
        people.setAction(scene, mdc, md, person, 'goto_map', { index: 4 } );
    }
};
/********* **********
  1.13) ACTIONS - worker_di_recycle_empty
********** **********/
ACTIONS.worker_di_recycle_empty = {
    opt: {},
    init: function(mdc, md, people, scene, person, opt, delta) {
         person.setData('itemOfInterest', null);
         const bin = md.getRecycling();
         const onHand = person.getData('onHand');
         if(onHand.length === 0){
             person.setDone('nothing_on_hand');
             return;
         }
         if(bin){
             const pos_bin = bin.getTilePos();
             const pos = md.findWalkToNear(pos_bin, 10);
             if(pos){
                 person.setData('itemOfInterest', bin);
                 person.setPath(scene, md, pos.x, pos.y);
             }
             if(!pos){
                 this.setDone('no_spot');
             }
         }
         if(!bin){
             person.say('No bin at this map!');
             this.setDone('no_bin');
         }       
    },
    update : function(mdc, md, people, scene, person, opt, delta) {
        const ioi = person.getData('itemOfInterest');
        const path = person.getData('path');
        if(ioi && path.length === 0){
             this.setDone('at_bin');
        }
    }
};
/********* **********
  1.14) ACTIONS - worker_di_process
********** **********/
ACTIONS.worker_di_process = {
    opt: {
        maxCount: 5,
        count: 5
    },
    init: function(mdc, md, people, scene, person, opt, delta) {
        const oh = person.getData('onHand');  
        oh.forEach( (item) => {
            item.setPrice(0.50, 0);
        });
    },
    update: function(mdc, md, people, scene, person, opt, delta) {},
    noPath: function(mdc, md, people, scene, person, opt){
        const oh = person.getData('onHand');
        const moh = person.getData('maxOnHand');
        if(oh.length > 0 && opt.count > 0 ){
             const pos = md.getRandomWalkTo();
             person.setPath(scene, md, pos.x, pos.y);
             opt.count = opt.count - 1;    
        }    
        if(oh.length > 0 && opt.count <= 0 ){
             people.setAction(scene, mdc, md, person, 'drop', { count: 1 } );
        }
    }
};
/********* **********
 2.0) ACTION CLASS 
********** **********/
class Action {
    constructor (scene, people, person, key='wonder', opt={}) {
        this.def = ACTIONS[ key ]; 
        this.def.opt = this.def.opt || {};
        this.scene = scene;
        this.people = people;
        this.person = person;
        this.key = key;
        this.mdc = this.scene.registry.get('mdc');
        this.done = false;
        this.result ='';
        this.opt = Object.assign({}, this.def.opt, opt);
    }
    setDone (result='done') {
        this.done = true;
        this.result = result;
    }
    init ( md ) {
        const init = this.def.init;
        if(init){
            init.call(this, this.mdc, md, this.people, this.scene, this.person, this.opt);
        }
    }
    callFunc (type='init', md, delta ){
        const func = this.def[type];
        if(func){
            func.call(this, this.mdc, md, this.people, this.scene, this.person, this.opt, delta);
        }
    }
    init ( md ) { this.callFunc('init', md); }
    update ( md, delta ) { this.callFunc('update', md, delta); }
    noPath ( md ) { this.callFunc('noPath', md); }
};

/********* **********
 3.0) TASKS 
********** **********/
const TASKS = {};

/********* **********
 3.1) TASKS - catatonic  
********** **********/
TASKS.catatonic = {
    init: (mdc, md, people, scene, person) => {},
    update: (mdc, md, people, scene, person) => {}
};
/********* **********
 3.2) TASKS - DI  
********** **********/
TASKS.di = {
    init: (mdc, md, people, scene, person, opt) => {
        people.setAction(scene, mdc, md, person, 'worker_di_idle' );
    },
    update: (mdc, md, people, scene, person, opt, delta) => {
        const done = person.getData('action_done');
        const oh = person.getData('onHand');
        const moh = person.getData('maxOnHand');
        const action = person.getData('act')
        if(md.index === 4 && oh.length === 0){
            const spot = md.findSpot({x: 35, y: 4}, function(tile){
                const items = md.getItemsAtTile( tile );
                const item = items[0];
                if(item){
                   return item.drop_count === 0 && item.contents.length === 0;
                }
                return false;
            }, 50);
            if(spot){
                people.setAction(scene, mdc, md, person, 'pickup', {
                    type:'empty',
                    canRecyle: true,
                    container: true, 
                    max_items: 1
                });
            }
            if(!spot){
                people.setAction(scene, mdc, md, person, 'pickup', { type: 'drop', container: false, max_items: 1  } );
            }
        }
        if(action.result === 'at_bin'){
            const ioi = person.getData('itemOfInterest');
            people.setAction(scene, mdc, md, person, 'drop', { at: ioi, count: 1 });
        }
        if(action.result === 'pickup_empty'){
            people.setAction(scene, mdc, md, person, 'worker_di_recycle_empty', { } );
        }
        if(md.index != 4 && oh.length === 0 ){
            people.setAction(scene, mdc, md, person, 'worker_di_return' );
        }   
        if(md.index != 4 && oh.length >= 1 && action.done ){
            people.setAction(scene, mdc, md, person, 'worker_di_process', {   } );
        }
        // if the worker is at map 4, and a pickup task has completed. Then there are a number of new
        // actions to start in such a case.
        const item = oh[0];
        if(md.index === 4 && action.key === 'pickup' && action.done && item){                
            if( action.result ==='have_items' && item.iType === 'Container' && item.drop_count === 0 && item.contents.length === 0 ){
                people.setAction(scene, mdc, md, person, 'worker_di_recycle_empty', { } );
            }       
            if( action.result ==='have_items' && item.iType === 'Item'){
                people.setAction(scene, mdc, md, person, 'goto_map', { index: 1 } );
            }
            if(action.result === 'pickup_drop'){
                people.setAction(scene, mdc, md, person, 'goto_map', { index: 1 } );
            }        
        }
    }
};

/********* **********
 3.3) TASKS - shopping  
********** **********/
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

/********* **********
 3.4) TASKS - donate  
********** **********/
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

/********* **********
4.0) PERSON ( Person Class, People Class, People Types )
********** *********/

class Person extends Phaser.Physics.Arcade.Sprite {
    
    constructor (scene, opt={}, pConfig={} ) {
        opt = Object.assign({}, { curveSpeed: 1 }, opt );
        pConfig = Object.assign({}, { }, pConfig );
        super(scene, opt.x, opt.y, opt.texture, opt.frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        //this.number = pConfig.number || 0;
        this.setCollideWorldBounds(true);
        this.depth = 3;
        this.nCurve = 0;
        this.speedCurve = pConfig.curveSpeed || 0.20;
        this.vecCurve = new Phaser.Math.Vector2();
        this.curve = null;
        this.task = pConfig.task || 'catatonic';      
        this.setData({
            act : new Action(scene, pConfig.people, this, 'wonder', {}),
            action_done: false,
            action_result: '',
            itemOfInterest: null,
            path: [], pathCT: 0,
            hits: 0, idleTime: 0,
            onHand: [], maxOnHand: 3,
            trigger_pos: {x: -1, y: -1},
            type: '', subType: '',
            itemMode: 1,   // 1 item pickup, 2 item drop, 3 container pickup/drop, 0 tile info
            moveFrame: 0, sp: {}
        }); 
    }
    
    say (mess='') {
        this.scene.mp.push(mess, 'SAY');
    }
    
    setToTilePos (p) {
        p = p === undefined ? this.getTilePos() : p ;
        this.x = p.x * 16 + 8;
        this.y = p.y * 16 + 8;
    }
   
    getTilePos () {    
        return {
            x : Math.floor( this.x / 16 ),
            y : Math.floor( this.y / 16 )
        }
    }
        
    setConf (pConfig) {
        const person = this;
        Object.keys(pConfig).forEach((key)=>{
            person.setData(key, pConfig[key])
        });
    }
    
    kill () {
       this.getData('onHand').forEach( (item) => {
           item.destroy(true, true);
       });
       this.destroy(true, true);
    }
    
    pathProcessorCurve (scene, cb=NOOP) {
        let path = this.getData('path');
        const speed = 50 - Math.round(49 * this.speedCurve);
        let i = this.nCurve / (speed * path.length );
        if(path.length > 0 && i <= 1){             
            this.curve.getPoint(i, this.vecCurve);
            this.x = this.vecCurve.x;
            this.y = this.vecCurve.y;        
            this.nCurve += 1;
        }
        if(i >= 1){
            cb(scene, this);     
        }
    }
        
    setPath (scene, md, tx=2, ty=2) {
        this.nCurve = 0;
        let curve = null;
        const pf = new PathFinder();
        const sprite = this;
        pf.setGrid( md.map.layers[0].data, md.hardMapData.tilePalette.walkable );
        pf.setCallbackFunction( (path) => { 
            path = path || [];
            sprite.setData({ path: path });
            if(path.length > 1){
                curve = new Phaser.Curves.Path(path[0].x * 16 + 8, path[0].y * 16 + 8);
                let i = 1;
                while(i < path.length){
                    const pt = path[i];
                    curve.lineTo( pt.x * 16 + 8, pt.y * 16 + 8 );
                    i += 1;
                }
            }
        });
        const stx = Math.floor( sprite.x / 16 );
        const sty = Math.floor( sprite.y / 16 );
        pf.preparePathCalculation([stx, sty], [tx, ty]);
        pf.calculatePath();
        this.curve = curve;
        const pc = this.getData('pathCT');
        this.setData('pathCT', pc + 1);
    }
        
    update (scene) {
        const person = this;
        const onHand = person.getData('onHand');
        if(onHand){
            const len = onHand.length;
            if(len > 0){
                let i = 0;
                while(i < len){
                    const item = onHand[i];
                    item.x = person.x + 8;
                    item.y = person.y - 8 - i * 2;
                    i += 1;
                }
            }
        }
    }
        
}

/********* **********
 5.0) PEOPLE_TYPES ( customer, worker )
********** **********/    
const PEOPLE_TYPES = {}
      
const get_di_tiles = (scene, activeMap) => {
    return activeMap.filterTiles( (tile) => {
        if(!tile){
            return false;
        }
        return tile.index === 13 || tile.index === 14 || tile.index === 23 || tile.index === 24;
    });
};

const get_pt = ( ty ) => {
    if(typeof ty === 'object'){
        ty = ty.getData('type');
    }
    return PEOPLE_TYPES[ ty ];
};

const get_spt = (person, subType=false) => {
    if(!subType){
        subType = person.getData('subType');
    }
    const pt = get_pt( person.getData('type') );
    return pt[subType];
}
       
PEOPLE_TYPES.worker = {

    data : {
        0 :  { count: 1, spawn: 0 },
        1 :  { count: 1, spawn: 0 },
        2 :  { count: 1, spawn: 0 },
        3 :  { count: 1, spawn: 0 },
        4  : { count: 2, spawn: 0 }
    },

    init: function(mdc, md, people, scene){},

    setSubType: function (mcd, md, people, scene, person ) {
        person.setData('subType', 'employee');   
        person.name = mcd.newName( 'employee' );
    },
    
    canSpawn : function (mcd, md, people, scene, now) {
        const dat = this.data[ md.index ];
        const len = people.children.size;
        if( dat.spawn < dat.count ){
            dat.spawn += 1;
            return true;
        }
        return false;
    }

};
    
PEOPLE_TYPES.worker.employee = {

    update: (mdc, md, people, scene, person) => {},

    create: (mdc, md, people, scene, person) => {
        people.setMapSpawnLocation(md, person);
        people.setTask(scene, mdc, md, person, 'di');
    }
    
};
    
PEOPLE_TYPES.customer = {

    init: function(mdc, md, people, scene){
        people.setData('lastSpawn', new Date() );
        const sr = scene.registry.get('CUSTOMER_SPAWN_RATE') || 3000;
        people.setSpawnRate( sr.min, sr.delta );
    },

    setSubType: function (mdc, md, people, scene, person ) {
        people.setRandomSubType( person );
        person.name = mdc.newName( person.getData('subType') );
    },
    
    canSpawn : function (mdc, md, people, scene, now) {
        const lastSpawn = people.getData('lastSpawn');
        const t = now - lastSpawn;
        const current_count = people.children.size;
        const max = scene.registry.get('CUSTOMER_MAX_SPAWN_PER_MAP');
        const sr = scene.registry.get('CUSTOMER_SPAWN_RATE');
        const spawnStack = people.getData('spawnStack');
        if(current_count < max && spawnStack.length > 0 && t >= people.spawnRate){
            people.setData('lastSpawn', now);
            people.setSpawnRate( sr.min, sr.delta );
            let spawnData = spawnStack[0] || {};
            if(spawnData.count <= 0){
                spawnStack.shift();
                spawnData = spawnStack[0] || {};
            }
            if(current_count < max && spawnData.count > 0){
                spawnData.count -= 1;
                return true;
            }   
        }
        if(current_count >= max && t >= people.spawnRate){
             people.setData('lastSpawn', now);
             people.setSpawnRate( sr.min, sr.delta );
        }   
        return false;
    }

};
    
PEOPLE_TYPES.customer.shopper = {
    
    update: (mdc, md, people, scene, person) => {},
    
    create: (mdc, md, people, scene, person) => {
        people.setMapSpawnLocation(md, person);
        people.setTask(scene, mdc, md, person, 'shopping');
    },
    
    noPath: (mdc, md, people, scene, person) => {}
        
};

PEOPLE_TYPES.customer.donator = {
    
    update: (mdc, md, people, scene, person) => {},

    create: (mdc, md, people, scene, person) => {
        const max_donations = scene.registry.get('MAX_MAP_DONATIONS') || 10;
        const donations = md.donations;
        const donations_incoming = people.totalOnHandItems();
        const donations_drop = donations.children.size;
        const donations_total = donations_incoming + donations_drop;
        people.setMapSpawnLocation(md, person);
        if(donations_total < max_donations){
            const donation = new Container(scene, 'box_items_hh', {}, person.x, person.y);
            scene.add.existing(donation);
            person.setData('onHand', [ donation ] );
            people.onHand.add(donation);
        }
        person.setData('itemMode', 2);
        people.setTask(scene, mdc, md, person, 'donate');
    },
    
    noPath: (mdc, md, people, scene, person) => {}
    
};

const PEOPLE_DEFAULTS = {
    type: 'customer', subTypes: ['shoper', 'donator'], subTypeProbs: [ 1.00, 0.00 ],
    cash: 100
};

/********* **********
6.0) PEOPLE CLASS
********** *********/

class People extends Phaser.Physics.Arcade.Group {
    
    constructor (config, pConfig) {
        config = config || {};
        pConfig = Object.assign({}, PEOPLE_DEFAULTS, pConfig || {} );
        config.classType = Person;
        const scene = config.scene;
        const world = scene.physics.world;
        super(world, scene, config);
        this.number = 0;
        this.data = new Phaser.Data.DataManager(this,  new Phaser.Events.EventEmitter() );
        this.onHand = new ItemCollection();
        this.setData('spawnStack', [] );
        this.setData('lastSpawn', new Date());
        this.setData('type', pConfig.type);
        this.setData('subTypes', pConfig.subTypes);
        this.setData('subTypeProbs', pConfig.subTypeProbs);
        this.setData('pConfig', pConfig);
        this.spawnRate = pConfig.spawnRate;
        this.md = pConfig.md;
        const pt = get_pt( this );
        pt.init(scene.registry.get('mdc'), this.md, this, config.scene);
    }
    
    getData (key, value){ return this.data.get(key); }
    
    setTask (scene, mdc, md, person, taskKey = 'catatonic' ) {
        const people = this;
        person.task = taskKey;
        TASKS[person.task].init(mdc, md, people, scene, person);
    }
    
    setAction (scene, mdc, md, person, actionKey = 'what_do', opt ) {
        const people = this;
        person.action = actionKey;
        person.setData('act', new Action( scene, this, person, actionKey, opt  ) );
        person.getData('act').init(md);
    }
    
    setData (key, value){ return this.data.set(key, value); }
    
    setRandomSubType (person){
        const subTypes = this.getData('subTypes');
        const subTypeProbs = this.getData('subTypeProbs');
        const roll = Math.random();
        let a = subTypeProbs[0];
        let i_subType = 0;
        while(i_subType < subTypes.length){
            if(roll < a){
                person.setData('subType', subTypes[i_subType] );
                break;
            }
            a += subTypeProbs[i_subType];
            i_subType += 1;
        }
    }
    
    transToNewMap ( person, nmd, md ) {
        md = md === undefined ? this.md : md;
        const pType = person.getData('type');
        md[pType].remove(person);
        nmd[pType].add(person);      
        let i = 0;
        const onHand = person.getData('onHand');
        const len = onHand.length;
        while(i < len){
            const item = onHand[i];
            this.onHand.remove(item);
            nmd[pType].onHand.add(item);  
            i += 1;
        }
    }
    
    getMapSpawnLocation (md, person) {
        let areas = md.hardMapData.people.spawnAreas;
        let location = areas;
        if( areas instanceof Array ){
          const pType = person.getData('type');
          const options = areas.filter( ( loc ) => {
              if( loc.type != undefined && loc.type != 'all' ){
                return pType === loc.type;
              }
              return true;
          });
          const i = Math.floor( options.length * Math.random() );
          location = options[i];
        }
        const pos = {};
        pos.x = location.x + Math.floor( location.w * Math.random() );
        pos.y = location.y + Math.floor( location.h * Math.random() );
        return pos;
    }
    
    pushSpawnStack (opt={}) {
        const stack = this.getData('spawnStack');
        const spawnData = {};
        spawnData.ms_min = 1000;
        spawnData.count = opt.count === undefined ? 5 : opt.count;
        stack.push(spawnData);
    }
    
    setMapSpawnLocation (md, person) {
        const pos = this.getMapSpawnLocation (md, person);
        person.setToTilePos(pos);
    }
    
    setSpawnRate( tMin=500, Tdelta=500 ){
        this.spawnRate = tMin + Math.round(Tdelta * Math.random());
    }
        
    spawnPerson (mcd, md, scene, isPlayer=false) {
        const people = this.getChildren();
        const pConfig = this.getData('pConfig');
        const now = new Date();
        const ty = this.getData('type');
        const pt = get_pt(ty);
        if( pt.canSpawn(mcd, md, this, scene, now) ){
            const config = Object.assign({}, { number: this.number, people: this }, pConfig);
            const person = this.get( { x: 0, y: 0, texture: 'people_16_16', frame:0 }, config );
            if(isPlayer){
                scene.registry.set('player', person)
            }
            this.number += 1;
            person.setData('type', this.getData('type') );
            pt.setSubType(mcd, md, this, scene, person);
            const st = get_spt( person );
            st.create(mcd, md, this, scene, person);
            person.setFrame( person.getData('subType') + '_down');
            return person;
        }
        return null;
    }
    
    kill (person) {
       person.getData('onHand').forEach( (item) => {
           item.destroy(true, true);
       });
       this.remove(person, true, true);
    }
    
    totalOnHandItems(){
        return this.children.entries.filter( ( person ) => {
            return person.getData('onHand').length > 0;
        }).length;
    }
 
    clearAllIOI (item){
        this.getChildren().forEach( (person) => {
            const ioi = person.getData('itemOfInterest');
            if(ioi === item){
                person.setData('itemOfInterest', null);
                person.setData('path', []);
            }
        });
    }
    
    dropItem( scene, person, item, md, tx, ty ){
        const oh = person.getData('onHand');
        const mcd = scene.registry.get('mdc');
        person.setData('itemMode', 2);
        if(typeof item === 'number'){
            item = oh[item];
        }   
        const pos_drop = md.findEmptyDropSpot( cPos, 8 );       
        if(pos_drop === null){
            log('can not find a space for the drop!', 'SAY');
        }       
        if(pos_drop != null){
            person.setData('itemMode', 2);
            item.x = pos_drop.x * 16 + 8;
            item.y = pos_drop.y * 16 + 8;
            item.droped = true;
            mdc.addItemTo(item, md, 'donations');
            people.onHand.remove(item);
            person.setData('onHand', []);           
        }
    }
    
    onHandAction (scene, person, item, md, tx, ty) {
        const people = this;
        const onHand = person.getData('onHand');
        const maxOnHand = person.getData('maxOnHand');
        const im = person.getData('itemMode');
        const mdc = scene.registry.get('mdc');
        const pos_person = person.getTilePos();
        const pos_item = item? item.getTilePos(): {x:0, y:0};
        const d = Phaser.Math.Distance.BetweenPoints( pos_person, pos_item  );
        // pick up an item
        if( im === 1 ){
           if(d < 2 && item.droped && onHand.length < maxOnHand ){
                if( item.iType === 'Container'){
                    const item_new = item.spawnItem(scene);
                    if(item_new){
                        item_new.setPrice(0.50, 0);
                        onHand.push( item_new );
                        people.onHand.add(item_new);
                    }
                }
                if( item.iType === 'Item' ){
                    item.setPrice(0.50, 0);
                    mdc.removeItemFrom(item, md, 'donations');
                    onHand.push( item );
                    people.onHand.add(item);
                }
           }
           if(onHand.length >= maxOnHand){}
        }
        // drop what you have on hand
        if( im === 2 && onHand.length > 0 ){
           if( item ){
               if(item.iType === 'Container'){
                   item.setFrame(item.prefix + '_close');
                   const item2 = onHand.pop();
                   const res = item.addItem( item2 );
                   if(res){
                       people.onHand.remove(item2);
                   }
                   if( !res ){
                       onHand.push(item2);
                   }
               }
           }
           if( !item ){ // drop a loose item       
               const item2 = onHand.pop();
               item2.x = tx * 16 + 8;
               item2.y = ty * 16 + 8;
               mdc.addItemTo(item2, md, 'donations');
               people.onHand.remove(item2);     
           }
        }
        // pick up a container
        if( im === 3 && item ){
            if(item.iType === 'Container'){
                mdc.removeItemFrom(item, md, 'donations'); 
                item.setFrame(item.prefix + '_close');
                onHand.push( item );
                people.onHand.add(item);
            } 
        }
    }

    update (scene, md, delta) {
        const mdc = scene.registry.get('mdc');
        const player = scene.registry.get('player');
        const map = md.map;
        const type = this.getData('type');
        const subTypes = this.getData('subTypes');
        const people = this;
        if( !md.hardMapData.customer.disabled ){
            const arr_people = this.getChildren();
            this.spawnPerson(mdc, md, scene);
            let i_people = arr_people.length;
            while(i_people--){
                const person = arr_people[i_people];
                const action = person.getData('act');
                const spt = get_spt(person, person.getData('subType'));
                if(spt && person != player){
                    spt.update(mdc, md, this, scene, person);
                    const tx = Math.floor(person.x / 16);
                    const ty = Math.floor(person.y / 16);
                    const tile = map.getTileAt(tx, ty, false, 0);
                    if(!action.done && person.getData('path').length === 0){
                        action.noPath(md);
                    }
                    person.update(scene);
                    person.pathProcessorCurve( scene, (scene, person) => {
                        // !!! just door checks for 'worker' type people ( for now )
                        if(person.getData('type') === 'worker'){
                            let door = mdc.doorCheck(scene, person, md);
                        }
                        person.setData('path', []);
                        person.nCurve = 0;    
                    });
                    if(!action.done){
                        action.update(md, delta);
                    }
                    TASKS[person.task].update(mdc, md, people, scene, person);
                }                                
            }
        }
    }

}

export { Person, People };

