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
 ACTIONS ( 'wonder', 'findItemOfInterest' )
********** **********/
const ACTIONS = {};

// an action where a person ( typicaly a customer that is a donator )
// would like to find a location to drop off items that they have on hand
// that are unprocessed items to be donated to reuse. Once such a location 
// has been found, the person will then go to that location.
ACTIONS.donation_goto_droplocation = {

    init: (mdc, md, people, scene, person) => {
        const tPos = person.getData('trigger_pos');
        tPos.x = -1; tPos.y = -1;
    },

    update: (mdc, md, people, scene, person) => {
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

    noPath: (mdc, md, people, scene, person) => {
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

ACTIONS.donation_drop = {

    init: (mdc, md, people, scene, person) => {},

    update: (mdc, md, people, scene, person) => {
        const onHand = person.getData('onHand');
        const cPos = person.getTilePos();
        const tPos = person.getData('trigger_pos');
        if(onHand.length > 0 && cPos.x === tPos.x && cPos.y === tPos.y){
            let i_item = onHand.length;
            person.setData('itemMode', 2);
            while(i_item--){
                const item = onHand[i_item];
                const pos_drop = md.findEmptyDropSpot( cPos, 8 );
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
    },

    noPath: (mdc, md, people, scene, person) => {}
    
};

ACTIONS.customer_goto_exit = {

    init: (mdc, md, people, scene, person) => {
        const hmd = md.hardMapData;
        const pos_exit = hmd.customer.exitAt;
        person.setData('trigger_pos', {x: pos_exit.x, y: pos_exit.y });
    },

    update: (mdc, md, people, scene, person) => {},

    noPath: (mdc, md, people, scene, person) => {
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


// a generic of default action
ACTIONS.whatDo = {

    init: (mdc, md, people, scene, person) => {
        person.say('I do not know what to do!');
        person.setData('path', [] );
    },
    
    update: (mdc, md, people, scene, person) => {},
    
    noPath: (mdc, md, people, scene, person) => {}
    
};

// a generic wonder action
ACTIONS.wonder = {

    init: (mdc, md, people, scene, person) => {
        person.say('Okay guess I will wonder around then.');
    },

    update: (mdc, md, people, scene, person) => {},

    noPath: (mdc, md, people, scene, person) => {
        const tile = md.getRandomWalkTo();
        person.setPath(scene, md, tile.x, tile.y);
    }

};
/********* **********
 TASKS ( 'catatonic' )
********** **********/
const TASKS = {};

TASKS.catatonic = {

    init: (mdc, md, people, scene, person) => {
        person.say('Oh no! I am catatonic!');
    },

    update: (mdc, md, people, scene, person) => {
    
    }

};


TASKS.donate = {

    init: (mdc, md, people, scene, person) => {
        person.say('I ' + person.name + ' am here to drop off some items.');
        people.setAction(scene, mdc, md, person, 'donation_goto_droplocation' );
       
    },

    update: (mdc, md, people, scene, person) => {
    
        if( person.getData('action_done') && person.action === 'donation_goto_droplocation' ){       
            people.setAction(scene, mdc, md, person, 'donation_drop' );
        }
        
        if( person.getData('action_done') && person.action === 'donation_drop' ){       
            people.setAction(scene, mdc, md, person, 'customer_goto_exit' );
        }
        
        if( person.getData('action_done') && person.action === 'customer_goto_exit' ){       
            person.say( person.name + ':  By Now.');
            person.kill();
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
        this.action = pConfig.action || 'whatDo';
        this.setData({
            action_done: false,
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
        1 :  { count: 0, spawn: 0 },
        2 :  { count: 0, spawn: 0 },
        3 :  { count: 0, spawn: 0 },
        4  : { count: 2, spawn: 0 }
    },


    init: function(mdc, md, people, scene){
    
    },

    setSubType: function (mcd, md, people, scene, person ) {
        person.setData('subType', 'employee');
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
        //let p = md.hardMapData.spawnAt;
        //person.setToTilePos(p);
        //mdc.setActiveMapByIndex(scene, mdc.activeIndex);
    },
    
    noPath: (mdc, md, people, scene, person) => {
    /*
        const player = scene.registry.get('player');
        if(person != player){
            if(person.action === 'stock'){
                person.setData('itemMode', 2);
                const pos = person.getTilePos();
                people.onHandAction(scene, person, null, md, pos.x, pos.y);
                const oh = person.getData('onHand');
                if(oh.length > 0 ){
                    const tile = md.getRandomWalkTo();
                    person.setPath(scene, md, tile.x, tile.y);
                }
                if(oh.length === 0){
                    person.action = 'wonder';
                }
            }
            if(person.action === 'wonder'){
                const tile = md.getRandomWalkTo();
                person.setPath(scene, md, tile.x, tile.y);
            }
            if(person.action === 'find_stock_spot'){
                const tile = md.getRandomWalkTo();
                person.setPath(scene, md, tile.x, tile.y);
                person.action = 'stock';
            }
            if(person.action === 'di'){
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
                        person.setData('itemMode', 1);
                        people.onHandAction(scene, person, ioi, md, pos.x, pos.y);
                        person.setData('itemOfInterest', null);
                    }
                }
                if( oh.length >= moh ){
                    let door = mdc.doorCheck(scene, person, md);
                    if(!door){
                        const pos1 = person.getTilePos();
                        const pos2 = md.findDoorFrom(pos1.x, pos1.y, 1, false);
                        if(pos2){
                            person.setPath(scene, md, pos2.x, pos2.y);
                        }
                    }
                    if(door){         
                       person.action = 'find_stock_spot';
                    }
                }
            }
            
        }
        */	
    }
};
    
PEOPLE_TYPES.customer = {


    init: function(mdc, md, people, scene){
        people.setData('lastSpawn', new Date() );
        const sr = scene.registry.get('CUSTOMER_SPAWN_RATE');
        people.setSpawnRate( sr.min, sr.delta );
    },

    setSubType: function (mdc, md, people, scene, person ) {
        people.shId = people.shId === undefined ? 0 : people.shId += 1;
        person.shId = people.shId;
        people.setRandomSubType( person );
        person.name = person.getData('subType') + '#' + person.shId;   
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
        
        //return  < people.maxSize && t >= people.spawnRate;
        
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
        people.setTask(scene, md, mdc, person, 'donate');
    },
    
    noPath: (mdc, md, people, scene, person) => {
    }
    
};


/*
PEOPLE_TYPES.customer.donator = {
    
    update: (mdc, md, people, scene, person) => {        },

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
        scene.mp.push('Hello I am here to drop a few things off.', 'SAY');  
    },
    
    noPath: (mdc, md, people, scene, person) => {    
        let onHand = person.getData('onHand');
        const tPos = person.getData('trigger_pos');
        const cPos = person.getTilePos();
        const pos_exit = md.hardMapData.customer.exitAt; 
        if(onHand.length > 0 && tPos.x === -1 && tPos.y === -1){
            const tiles_di = get_di_tiles(scene, md.map);
            if(tiles_di.length > 0){
                scene.mp.push('Ah yes this looks like a good place to put this.', 'SAY');      
                const dt = tiles_di[ Math.floor( tiles_di.length * Math.random() ) ];
                const tiles_near_di = md.map.getTilesWithin(dt.x - 1, dt.y -1, 3, 3).filter( (tile) => { return md.canWalk(tile) });
                const t = tiles_near_di[ Math.floor( tiles_near_di.length * Math.random() ) ];
                person.setPath(scene, md, t.x, t.y);
                person.setData('trigger_pos', {x: t.x, y: t.y });
            }
            if(tiles_di.length === 0){
                scene.mp.push('Now I will take my leave. Good day!', 'SAY');  
                const pos = md.hardMapData.customer.exitAt;
                person.setPath(scene, md, pos.x, pos.y);
            }
        }
        if(onHand.length > 0 && cPos.x === tPos.x && cPos.y === tPos.y){
            let i_item = onHand.length;
            while(i_item--){
                const item = onHand[i_item];
                const pos_drop = md.findEmptyDropSpot( cPos, 8 );
                if(pos_drop === null){
                    scene.mp.push('I can not find a space!', 'SAY');
                    person.kill();
                } 
                if(pos_drop != null){
                    scene.mp.push('Here ya go!', 'SAY');
                    person.setData('itemMode', 2);
                    item.x = pos_drop.x * 16 + 8;
                    item.y = pos_drop.y * 16 + 8;
                    item.droped = true;
                    mdc.addItemTo(item, md, 'donations');
                    people.onHand.remove(item);
                    person.setData('onHand', []);           
                }
            }
        }
        if(cPos.x === pos_exit.x && cPos.y === pos_exit.y ){
            scene.mp.push('See ya.', 'SAY'); 
            person.kill();
        }
        if(onHand.length === 0  && !(cPos.x === pos_exit.x && cPos.y === pos_exit.y) ){
            scene.mp.push('I have nothing on hand, guess I will leave.', 'SAY');  
            person.setPath(scene, md, pos_exit.x, pos_exit.y);
        }        
    }
    
};
*/

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
    
    setAction (scene, mdc, md, person, actionKey = 'whatDo' ) {
        const people = this;
        person.action = actionKey;
        person.setData('action_done', false);
        ACTIONS[person.action].init(mdc, md, people, scene, person);
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
        
    spawnPerson (mcd, md, scene, name='') {
        const people = this.getChildren();
        const pConfig = this.getData('pConfig');
        const now = new Date();
        const ty = this.getData('type');
        const pt = get_pt(ty);
        if( pt.canSpawn(mcd, md, this, scene, now) ){
            //this.setData('lastSpawn', now);  
            const config = Object.assign({}, { number: this.number }, pConfig);
            const person = this.get({ x: 0, y: 0, texture: 'people_16_16', frame:0 }, config );
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
                //mdc.removeItemFromActive(item);
                mdc.removeItemFrom(item, md, 'donations'); 
                item.setFrame(item.prefix + '_close');
                onHand.push( item );
                people.onHand.add(item);
            } 
        }
    }

    update (scene, md) {
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
                    const task = TASKS[person.task];
                    const action = ACTIONS[person.action];
                    if(person.getData('path').length === 0 ){            
                        //spt.noPath(mdc, md, this, scene, person);
                        action.noPath(mdc, md, this, scene, person);
                    }
                    person.update(scene);
                    person.pathProcessorCurve( scene, () => {
                        //spt.noPath(mdc, md, this, scene, person);
                        action.noPath(mdc, md, this, scene, person);
                    });
                    task.update(mdc, md, people, scene, person);
                    action.update(mdc, md, people, scene, person);
                }                                
            }
        }
    }

}

export { Person, People };

