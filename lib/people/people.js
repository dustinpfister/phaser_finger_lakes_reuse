import { Action } from "./action.js";
import { PathFinder } from "../pathfinding/pathfinding.js";
import { Task, TASKS_DEFAULT } from "./task.js";
import { Item, ItemCollection, Container } from "../items/items.js";
import { ConsoleLogger } from '../message/message.js';
const log = new ConsoleLogger({
    cat: 'lib',
    id: 'people',
    appendId: true
});
const NOOP = function(){};

const TASKS = TASKS_DEFAULT;

/********* **********
1.0) Person Class
********** *********/
class Person extends Phaser.Physics.Arcade.Sprite {

    constructor (scene, opt={}, pConfig={} ) {
        opt = Object.assign({}, { curveSpeed: 1 }, opt );
        pConfig = Object.assign({}, { }, pConfig );
        super(scene, opt.x, opt.y, opt.texture, opt.frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.TASKS = pConfig.TASKS;
        this.ACTIONS = pConfig.ACTIONS;
        this.setCollideWorldBounds(true);
        this.depth = 3;
        this.nCurve = 0;
        this.speedCurve = pConfig.speedCurve || 1.00;
        this.vecCurve = new Phaser.Math.Vector2();
        this.curve = null;     
        this.setData({
            task : { },
            act : { foo: 'bar' },
            main_task : 'default',
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
 2.0) PEOPLE_TYPES ( customer, worker )
********** **********/    
const PEOPLE_TYPES = {}

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
    getPConfig: (mdc, md, people, scene) => {
    
        const spawnStack = people.getData('spawnStack');
        const gs = scene.registry.get('gameSave');
        const pd = gs.pd;

        //log('!!! can set data here with the pd object !!!');
        //log('I just need to get the spawn stack data though.');
        //log(spawnStack);
        //log(pd);
    
        return {
            texture: 'people_16_16',
            frame: 0,
            speedCurve: 0.90
        };
    },
    setSubType: function (mcd, md, people, scene, person ) {
        person.setData('subType', 'employee');   
        person.name = mcd.newName( 'employee' );
    },
    /*
    canSpawn : function (mcd, md, people, scene, now) {
        const spawnStack = people.getData('spawnStack');
        if(spawnStack.length > 0){
            //spawnStack.shift();
            return true;
        }
        return false;
    }
    */
};
    
PEOPLE_TYPES.worker.employee = {
    init: (mdc, md, people, scene) => {
        log( 'init method for worker.employee');
    },
    update: (mdc, md, people, scene, person) => {},
    create: (mdc, md, people, scene, person) => {
        people.setMapSpawnLocation(md, person);
    }
};
    
PEOPLE_TYPES.customer = {
    getPConfig: (mdc, md, people, scene) => {
        return {
            texture: 'people_16_16',
            frame: 1,
            speedCurve: 0.90
        };
    },
    init: function(mdc, md, people, scene){
        people.setData('lastSpawn', new Date() );
        const sr = scene.registry.get('CUSTOMER_SPAWN_RATE') || 3000;
        people.setSpawnRate( sr.min, sr.delta );
    },
    setSubType: function (mdc, md, people, scene, person ) {
        people.setRandomSubType( person );
        person.name = mdc.newName( person.getData('subType') );
    },
    /*
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
    */
};
    
PEOPLE_TYPES.customer.shopper = {
    create: (mdc, md, people, scene, person) => {
        people.setMapSpawnLocation(md, person);
    }
};

PEOPLE_TYPES.customer.donator = {
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
    }
};

const PEOPLE_DEFAULTS = {
    type: 'customer', subTypes: ['shoper', 'donator'], subTypeProbs: [ 1.00, 0.00 ], cash: 100,
    ACTIONS: null, TASKS: null
};
/********* **********
3.0) PEOPLE CLASS
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
        this.onHand = new ItemCollection(scene);
        
        this.setData('spawnStack', [] );
        //this.setData('spawnObj',{ });
        
        
        this.setData('lastSpawn', new Date());
        this.setData('type', pConfig.type);
        this.setData('subTypes', pConfig.subTypes);
        this.setData('subTypeProbs', pConfig.subTypeProbs);
        this.setData('pConfig', pConfig);
        this.spawnRate = pConfig.spawnRate;
        this.md = pConfig.md;
        const pt = get_pt( this );
        if(pt.init){
            pt.init(scene.registry.get('mdc'), this.md, this, config.scene);
        }
    }
    
    getData (key, value){ return this.data.get(key); }
    
    setTask (scene, mdc, md, person, taskKey = 'default' ) {
        const people = this;
        const task = new Task(scene, this, person, { key: taskKey, TASKS: person.TASKS });
        person.setData('task', task);
        task.init(mdc, md, people, scene, person);
    }
    
    setAction (scene, mdc, md, person, actionKey = 'default', opt ) {
        const people = this;
        const opt_action = Object.assign({}, { ACTIONS: person.ACTIONS }, opt);
        person.setData('act', new Action( scene, this, person, actionKey, opt_action  ) );
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
        opt = Object.assign({}, {
            subTypes: [], ms_min: 1000, ms_max: 5000, count: 1, keys: []
        }, opt);
        if(opt.keys.length > 0){
            opt.count = opt.keys.length; // count should = the number of keys
            opt.subTypes = [];           // subTypes are not used in this case as we have a list of keys to use
        }
        stack.push( Object.assign( {}, opt ) );
    }
    
    setMapSpawnLocation (md, person) {
        const pos = this.getMapSpawnLocation (md, person);
        person.setToTilePos(pos);
    }
    
    setSpawnRate( tMin=500, Tdelta=500 ){
        this.spawnRate = tMin + Math.round(Tdelta * Math.random());
    }
    spawnPerson (mdc, md, scene, isPlayer=false) {
        const children = this.getChildren();
        const people = this;
        const pConfig = this.getData('pConfig');
        const now = new Date();
        const pType = this.getData('type');
        const pt = get_pt(pType);
        
        const max = 3;
        
        const current_count = people.children.size;
        
        const spawnStack = people.getData('spawnStack');
        if(current_count < max && spawnStack.length > 0){
            let spawnObj = spawnStack[0] || {};
            
            if(spawnObj.count <= 0){
                spawnStack.shift();
                spawnObj = spawnStack[0] || {};
            }
            
            if(spawnObj.count > 0){
            
                //log(spawnObj);
                let pconfig_pt = {};
                if( pt.getPConfig ){
                    pconfig_pt = pt.getPConfig( mdc, md, this, scene );
                }
                const opt_sprite = { texture: 'people_16_16', frame: 0 };
                const opt_person = Object.assign({}, { number: this.number, people: children }, pConfig, pconfig_pt);
                const person = this.get( opt_sprite, opt_person );
                
                person.setData('type', pType );
                pt.setSubType(mdc, md, this, scene, person);
                
                
                if(pconfig_pt.texture){
                    person.setTexture(pconfig_pt.texture);
                }
                if(pconfig_pt.frame != undefined ){
                    person.setFrame(pconfig_pt.frame);
                }
                
                const spt = get_spt( person );
                spt.create(mdc, md, this, scene, person);
   
                people.setAction(scene, mdc, md, person, 'default' );
                people.setTask(scene, mdc, md, person, 'default' );
            
            
                spawnObj.count -= 1;
                
                
                return person;
            
                
            }   
        }
        
        
        return null;
    }

    /*    
    spawnPerson (mdc, md, scene, isPlayer=false) {
        const children = this.getChildren();
        const people = this;
        const pConfig = this.getData('pConfig');
        const now = new Date();
        const ty = this.getData('type');
        const pt = get_pt(ty);
        const canSpawn = pt.canSpawn(mdc, md, this, scene, now)
        if( !canSpawn ){
            return null;
        }
        if( canSpawn ){
            let pconfig_pt = {};
            if( pt.getPConfig ){
                pconfig_pt = pt.getPConfig( mdc, md, this, scene );
            }
            const opt_person = Object.assign({}, { number: this.number, people: children }, pConfig, pconfig_pt);
            const opt_sprite = {
                x: 0, y: 0, 
                texture: 'people_16_16',
                frame: 0
            };
            const person = this.get( opt_sprite, opt_person );
            if(isPlayer){
                scene.registry.set('player', person)
            }
            this.number += 1;
            person.setData('type', this.getData('type') );
            pt.setSubType(mdc, md, this, scene, person);
            
            const spt = get_spt( person );
            spt.create(mdc, md, this, scene, person);
   
            people.setAction(scene, mdc, md, person, 'default' );
            people.setTask(scene, mdc, md, person, 'default' );

            
            return person;
        }
        return null;
    }
    */
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
        const mdc = scene.registry.get('mdc'), player = scene.registry.get('player');
        const subTypes = this.getData('subTypes');
        const arr_people = this.getChildren();
        this.spawnPerson(mdc, md, scene);
        let i_people = arr_people.length;
        while(i_people--){
            const person = arr_people[i_people];
            const action = person.getData('act');
            const spt = get_spt( person, person.getData('subType') );
            //if(spt && ( person != player && !mdc.zeroPlayerMode ) ){
            if(spt){
                if(spt.update){
                    spt.update(mdc, md, this, scene, person);
                }
                const tx = Math.floor(person.x / 16);
                const ty = Math.floor(person.y / 16);
                const tile = md.map.getTileAt(tx, ty, false, 0);
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
                //TASKS[person.task].update(mdc, md, this, scene, person);
                

                
                person.getData('task').update(mdc, md, this, scene, person);
                
            }                                
        }
    }
    
};
/********* **********
4.0) PeopleData System
********** *********/
const PeopleData = {};

// create new people data record helper
const create_pd_rec = function(hpd_index, clone_index, pd_hard, data){
    const key = data.key + '_' + clone_index;
    const hpd_frameset = pd_hard.frameset[ data.frameset[0] ];
    const rec = {
        key: key, name: data.name, hpd_index : hpd_index,
        frame: data.frameset[1], texture: hpd_frameset.name,
        active: false,
        speed : data.speed
    };
    return rec;
};

// create a new 'pd' Object, with the given people data objects ( such as people_core.json )
PeopleData.createNew = function( hard_people_data=[] ) {
    let hpd_index = 0;
    const hpd_len = hard_people_data.length;
    const pd = {
       assignment: {
           none: [],
           worker:[],
           customer: []
       },
       population: {},
       count: 0
    };
    while(hpd_index < hpd_len){
        const pd_hard = hard_people_data[ hpd_index ];    
        let p_index = 0;
        const p_len = pd_hard.people.length;
        while(p_index < p_len){
            const data = pd_hard.people[p_index];
            let n = 0;
            while(n < data.clones){
                const rec = create_pd_rec(hpd_index, n, pd_hard, data);
                pd.population[rec.key] = rec;
                pd.assignment.none.push( rec.key );
                n += 1;
            }
            p_index += 1;
        }
        hpd_index += 1;
    }
    pd.count = Object.keys( pd.population ).length;
    return pd;
};

PeopleData.setActive = (pd, key='cp_unique_1_0', active=true ) => {
    const rec = pd.population[key];
    rec.active = active;
};

PeopleData.switchPersonKey = (pd, key='cp_unique_1_0', from='none', to='worker') => {
    let i = pd.assignment[from].findIndex( (el_key) => {
        return key === el_key;
    });
    if(i === -1){
        return;
    }
    const key_pulled = pd.assignment.none.splice(i, 1)[0];
    pd.assignment[to].push(key_pulled);
};

export { Person, People, PeopleData };

