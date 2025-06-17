import { PathFinder } from "./pathfinding.js";
import { Item, ItemCollection, Container } from "./items.js";
import { ConsoleLogger } from './message.js';
const log = new ConsoleLogger({
    cat: 'lib',
    id: 'people',
    appendId: true
});
const NOOP = function(){};

/********* **********
 ACTIONS 
********** **********/

const ACTIONS = {};

/********* **********
  actions-general
********** **********/

ACTIONS.drop = {
    opt : {
        max_tiles: 8
    },
    init: function (mdc, md, people, scene, person, opt) {
        const onHand = person.getData('onHand');
        person.setData('itemMode', 2);
        if( onHand.length > 0 ){
            let i_item = onHand.length;
            while(i_item--){
                const item = onHand[i_item];
                const pos_drop = md.findEmptyDropSpot( person.getTilePos(), opt.max_tiles );
                if(pos_drop === null){
                    person.say('I can not find a space to drop items!');
                    person.setData('action_done', true);
                    person.setData('action_result', 'no_space');
                } 
                if(pos_drop != null){
                    item.x = pos_drop.x * 16 + 8;
                    item.y = pos_drop.y * 16 + 8;
                    item.droped = true;
                    mdc.addItemTo(item, md, 'donations');
                    people.onHand.remove(item);
                    person.setData('onHand', []);
                }
            }
            person.setData('action_done', true);
            person.setData('action_result', 'items_droped');
        }
    }
};

ACTIONS.pickup = {
    opt : {
        container: false
    },
    update: function (mdc, md, people, scene, person, opt, delts) {
        const onHand = person.getData('onHand');
        person.setData('itemMode', 1);
        if(opt.container){
            person.setData('itemMode', 3);
        }
        let ioi = person.getData('itemOfInterest');
        const oh = person.getData('onHand');
        const moh = person.getData('maxOnHand');
        if(!ioi && oh.length < moh){
            const items = md.donations.getDrops();
            if(items.length > 0){
                ioi = items[0];
                person.setData('itemOfInterest', ioi);
            }
        }
        if(ioi){
            const pos = ioi.getTilePos();
            const d = Phaser.Math.Distance.BetweenPoints(pos, person.getTilePos());
            if(d > 2){
                person.setPath(scene, md, pos.x, pos.y - 1);
            }
            if(d <= 2){
                people.onHandAction(scene, person, ioi, md, pos.x, pos.y);
                person.setData('itemOfInterest', null);
            }
        }
        if( oh.length >= moh ){
            person.setData('action_done', true);
            person.setData('action_result', 'on_hand_full');
        }
    }
};

ACTIONS.goto_map = {
    opt: {
        index: 1
    },
    init: function (mdc, md, people, scene, person, opt) {
        person.say(person.name + ': start of general goto map ' + opt.index + ' action ');
    },
    update: function (mdc, md, people, scene, person, opt) {
        const pos1 = person.getTilePos();
        if(md.index === opt.index){
            person.setData('action_done', true);
            person.setData('action_result', 'at_map');
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

// a generic idle default action
ACTIONS.what_do = {
    init: function (mdc, md, people, scene, person) {
        person.setData('path', [] );
    }
};

// a generic wonder action
ACTIONS.wonder = {
    opt: {
        next_spot: false,
        pause : 1200,
        t: 0
    },
    update: function (mdc, md, people, scene, person, opt, delta) {
        opt.t -= delta;
        opt.t = opt.t < 0 ? 0 : opt.t;    
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
  actions-customer-general
********** *********/

ACTIONS.customer_goto_exit = {
    init: function (mdc, md, people, scene, person) {
        const hmd = md.hardMapData;
        const pos_exit = hmd.customer.exitAt;
        person.setData('trigger_pos', {x: pos_exit.x, y: pos_exit.y });
    },
    noPath: function (mdc, md, people, scene, person) {
        const cPos = person.getTilePos();
        const tPos = person.getData('trigger_pos');  
        if(cPos.x != tPos.x && cPos.y != tPos.y){
            person.setPath(scene, md, tPos.x, tPos.y);
        }
        if(cPos.x === tPos.x && cPos.y === tPos.y){
            person.setData('action_done', true);
        }
    }
};

/********* **********
  actions-customer-donator
********** *********/

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
    
        if(onHand.length > 0 && tPos.x === -1 && tPos.y === -1 ){
            const tiles_di = get_di_tiles(scene, md.map);
            if(tiles_di.length > 0){    
                const dt = tiles_di[ Math.floor( tiles_di.length * Math.random() ) ];
                const tiles_near_di = md.map.getTilesWithin(dt.x - 1, dt.y -1, 3, 3).filter( (tile) => { return md.canWalk(tile) });
                const t = tiles_near_di[ Math.floor( tiles_near_di.length * Math.random() ) ];
                person.setData('trigger_pos', {x: t.x, y: t.y });
            }
        }
    },

    noPath: function (mdc, md, people, scene, person) {
       const cPos = person.getTilePos();
       const tPos = person.getData('trigger_pos');  
       if( cPos.x === tPos.x && cPos.y === tPos.y ){
           person.setData('action_done', true);
           person.setData('path', []);
       }
       if(tPos.x != -1 && tPos.y != -1 && !(cPos.x === tPos.x && cPos.y === tPos.y) ){
           person.setPath(scene, md, tPos.x, tPos.y);
       }
    }
    
};
/*
ACTIONS.donation_drop = {

    update: function (mdc, md, people, scene, person) {
        const onHand = person.getData('onHand');
        //const cPos = person.getTilePos();
        const tPos = person.getData('trigger_pos');
        //if(onHand.length > 0 && cPos.x === tPos.x && cPos.y === tPos.y){
        if(onHand.length > 0 ){
            let i_item = onHand.length;
            person.setData('itemMode', 2);
            while(i_item--){
                const item = onHand[i_item];
                const pos_drop = md.findEmptyDropSpot( person.getTilePos(), 8 );
                if(pos_drop === null){
                    person.say('I can not find a space!');
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
            person.setData('action_done', true);
        }
    }
};
*/
/********* **********
  actions-worker-di
********** **********/

ACTIONS.worker_di_idle = {
    opt:{
    },
    update: function (mdc, md, people, scene, person, opt) {
        const player = scene.registry.get('player');
        if( person === player ){
            person.setData('action_done', true);
            person.setData('action_result', 'player_control');
            return;
        }
        const oh = person.getData('onHand');
        if( md.index != 4 && oh.length === 0 ){
             person.setData('action_done', true);
             person.setData('action_result', 'empty_handed');
        }
        if( md.index === 4){
             person.setData('action_done', true);
             person.setData('action_result', 'at_di_back');
        }
    }
};



ACTIONS.worker_di_return = {
    init: function (mdc, md, people, scene, person) {
        people.setAction(scene, mdc, md, person, 'goto_map', { index: 4 } );
    }
};

ACTIONS.worker_di_items_pickup = {
    init: function (mdc, md, people, scene, person)  {},
    update: function (mdc, md, people, scene, person)  {},
    noPath: function (mdc, md, people, scene, person)  {}
};

ACTIONS.worker_di_items_drop = {
    init: function (mdc, md, people, scene, person)  {},
    update: function (mdc, md, people, scene, person)  {},
    noPath: function (mdc, md, people, scene, person)  {}
};

/********* **********
 ACTION CLASS 
********** **********/
class Action {

    constructor (scene, people, person, key='wonder', opt={}) {
        this.def = ACTIONS[ key ];
        this.scene = scene;
        this.people = people;
        this.person = person;
        this.key = key;
        this.mdc = this.scene.registry.get('mdc');
        this.opt = Object.assign({}, this.def.opt, opt);
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
 TASKS ( 'catatonic' )
********** **********/
const TASKS = {};

TASKS.catatonic = {

    init: (mdc, md, people, scene, person) => {
    },

    update: (mdc, md, people, scene, person) => {f
    }

};

TASKS.di = {

    init: (mdc, md, people, scene, person) => {
        //people.setAction(scene, mdc, md, person, 'worker_di_idle' );
    },

    update: (mdc, md, people, scene, person) => {
        
        const result = person.getData('action_result');
        const done = person.getData('action_done');
        /*
        if( done ){
        
            const act = person.getData('act');
        
            if( act.key === 'worker_di_idle' && result === 'empty_handed'){
                people.setAction(scene, mdc, md, person, 'worker_di_return' );
                return;
            }
            
            if( act.key === 'worker_di_idle' && result === 'at_di_back'){
                people.setAction(scene, mdc, md, person, 'wonder' );
                return;
            }
            
            if( act.key === 'goto_map' && result === 'at_map'){
                people.setAction(scene, mdc, md, person, 'worker_di_idle');
                return;
            }
        
        }
        */
            
    }

};

TASKS.donate = {

    init: (mdc, md, people, scene, person) => {
        people.setAction(scene, mdc, md, person, 'donation_goto_droplocation' );
       
    },

    update: (mdc, md, people, scene, person) => {
    
        if(person.getData('action_done') ){
        
            const act = person.getData('act');
        
            if(act.key === 'donation_goto_droplocation'){
                people.setAction(scene, mdc, md, person, 'drop', { max_tiles: 16 } );
                return;
            }
            
            //if(act.key === 'donation_drop'){
            if(act.key === 'drop'){
                people.setAction(scene, mdc, md, person, 'customer_goto_exit' );
                return;
            }
            
            if(act.key === 'customer_goto_exit' ){
                person.kill();
                return;
            }
        
        }
    
    }

};


/********* **********
PERSON ( Person Class, People Class, People Types )
********** *********/

class Person extends Phaser.Physics.Arcade.Sprite {
    
    constructor (scene, opt, pConfig ) {
        opt = opt || {};
        super(scene, opt.x, opt.y, opt.texture, opt.frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.number = pConfig.number || 0;
        this.setCollideWorldBounds(true);
        this.depth = 3;
        this.nCurve = 0;
        this.speedCurve = pConfig.curveSpeed || 0.20;
        this.vecCurve = new Phaser.Math.Vector2();
        this.curve = null;
        this.task = pConfig.task || 'catatonic';
        //this.action = pConfig.action || 'what_do';
        
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
 PEOPLE_TYPES ( customer, worker )
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
        1 :  { count: 1, spawn: 0 },
        2 :  { count: 1, spawn: 0 },
        3 :  { count: 1, spawn: 0 },
        4  : { count: 2, spawn: 0 }
    },


    init: function(mdc, md, people, scene){
    
    },

    setSubType: function (mcd, md, people, scene, person ) {
        person.setData('subType', 'employee');   
        person.name = mcd.newName( 'employee' );
    },
    
    canSpawn : function (mcd, md, people, scene, now) {
        const dat = this.data[md.index];
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
        let p = md.hardMapData.spawnAt;
        person.setToTilePos(p);
        
        people.setTask(scene, mdc, md, person, 'di');
        
        
    }
};
    
PEOPLE_TYPES.customer = {


    init: function(mdc, md, people, scene){
        people.setData('lastSpawn', new Date() );
        const sr = scene.registry.get('CUSTOMER_SPAWN_RATE');
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
        // donator type customers can spawn at map 4
        if(current_count < max && t >= people.spawnRate && md.index === 4 ){
            people.setData('lastSpawn', now);
            people.setSpawnRate( sr.min, sr.delta );
            if(current_count < max){
                return true;
            }   
        }
        if(current_count >= max && t >= people.spawnRate && md.index === 4 ){
             people.setData('lastSpawn', now);
             people.setSpawnRate( sr.min, sr.delta );
        }        
        return false;
        
    }

};
    
PEOPLE_TYPES.customer.shopper = {
    
    update: (mdc, md, people, scene, person) => {
    },
    
    create: (mdc, md, people, scene, person) => {
        people.setMapSpawnLocation(md, person);
    },
    
    noPath: (mdc, md, people, scene, person) => {
        const pc = person.getData('pathCT');
        const pn = person.number;
        let ioi = person.getData('itemOfInterest');
        const items = md.donations.getItemType('Item');
        if(items.length === 0){
            const tile = md.getRandomWalkTo();
            person.setPath(scene, md, tile.x, tile.y);
        }
        if(!ioi && items.length > 0){
            const iLen = items.length;
            const item = items[ Math.floor(Math.random() * iLen) ];
            const pos = item.getTilePos();
            person.setPath(scene, md, pos.x, pos.y);
            person.setData('itemOfInterest', item);
        }
        if(ioi){
            let gs = scene.registry.get('gameSave');
            gs.money += ioi.price.shelf;
            scene.registry.set('gameSave', gs);
            people.clearAllIOI(ioi);
            ioi.destroy();
            person.setData('itemOfInterest', null);
        }
    }
        
};

PEOPLE_TYPES.customer.donator = {
    
    update: (mdc, md, people, scene, person) => {
    
    },

    create: (mdc, md, people, scene, person) => {
        const max_donations = scene.registry.get('MAX_MAP_DONATIONS') || 10;
        const donations = md.donations;
        const donations_incoming = people.totalOnHandItems();
        const donations_drop = donations.children.size;
        const donations_total = donations_incoming + donations_drop;
        people.setMapSpawnLocation(md, person);
        if(donations_total < max_donations){
            const donation = new Container(scene, 'box_items_hh', person.x, person.y);
            scene.add.existing(donation);
            person.setData('onHand', [ donation ] );
            people.onHand.add(donation);
        }
        person.setData('itemMode', 2);
        people.setTask(scene, mdc, md, person, 'donate');
    },
    
    noPath: (mdc, md, people, scene, person) => {
    }
    
};

const PEOPLE_DEFAULTS = {
    type: 'customer', subTypes: ['shoper', 'donator'], subTypeProbs: [ 1.00, 0.00 ],
    cash: 100
};

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
    
    
    setTask (scene, mdc, md, person, taskKey = 'catatonic' ) {
        const people = this;
        person.task = taskKey;
        person.setData('action_done', false);
        TASKS[person.task].init(mdc, md, people, scene, person);
    }
    
    setAction (scene, mdc, md, person, actionKey = 'what_do', opt ) {
        const people = this;
        person.action = actionKey;
        person.setData('action_done', false);
        person.setData('action_result', '');
        
        
        person.setData('act', new Action( scene, this, person, actionKey, opt  ) );
        
        
        person.getData('act').init(md);
        
        //ACTIONS[person.action].init(mdc, md, people, scene, person);
    }
        
    setData (key, value){ return this.data.set(key, value); }
    getData (key, value){ return this.data.get(key); }
    
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
    
    setMapSpawnLocation (md, person) {
        let p = md.hardMapData[person.getData('type')].spawnAt;
        if(p instanceof Array){
           p = p[ Math.floor( p.length * Math.random() ) ];
        }
        person.setToTilePos(p);
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
        md = md === undefined ? mdc.getActive(): md;
        const map = md.map;
        const type = this.getData('type');
        const subTypes = this.getData('subTypes');
        const people = this;
        if(!md.hardMapData.customer.disabled){
            const arr_people = this.getChildren();
            this.spawnPerson(mdc, md, scene);
            let i_people = arr_people.length;
            while(i_people--){
                const person = arr_people[i_people];
                const spt = get_spt(person, person.getData('subType'));
                if(spt && person != player){
                    spt.update(mdc, md, this, scene, person);
                    const tx = Math.floor(person.x / 16);
                    const ty = Math.floor(person.y / 16);
                    const tile = map.getTileAt(tx, ty, false, 0);
                    if(person.getData('path').length === 0 ){            
                        //ACTIONS[person.action].noPath(mdc, md, this, scene, person);
                        person.getData('act').noPath(md);
                    }
                    if(!person.getData('action_done') && person.getData('path').length === 0){
                        //ACTIONS[person.action].noPath(mdc, md, this, scene, person);
                        person.getData('act').noPath(md);
                    }
                    person.update(scene);
                    person.pathProcessorCurve( scene, (scene, person) => {
                        let door = mdc.doorCheck(scene, person, md);
                        person.setData('path', []);
                        person.nCurve = 0;    
                    });
                    if( !person.getData('action_done') ){
                    
                        person.getData('act').update(md, delta);
                    
                        //const act = ACTIONS[person.action];
                        //act.update(mdc, md, people, scene, person);
                    }
                    TASKS[person.task].update(mdc, md, people, scene, person);
                    
                }                                
            }
        }
    }

}

export { Person, People };

