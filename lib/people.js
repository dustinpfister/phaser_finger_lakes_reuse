import { PathFinder } from "./pathfinding.js";
import { Item, ItemCollection, Container } from "./items.js";

const NOOP = function(){};

/********* **********
PERSON ( Person Class, People Class, People Types )
********** *********/

class Person extends Phaser.Physics.Arcade.Sprite {
    
    constructor (scene, opt, pConfig ) {
        opt = opt || {};
        super(scene, opt.x, opt.y, opt.texture, opt.frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.number = pConfig.number || 0;
        this.setCollideWorldBounds(true);
        this.depth = 3;
        this.nCurve = 0;
        this.speedCurve = pConfig.curveSpeed || 0.20;
        this.vecCurve = new Phaser.Math.Vector2();
        this.curve = null;
        this.setData({
            itemOfInterest: null,
            path: [], pathCT: 0,
            hits: 0, idleTime: 0,
            onHand: [], maxOnHand: 3,
            trigger_pos: {x: -1, y: -1},
            type: '', subType: '',
            itemMode: 1,   // 1 item pickup, 2 item drop, 3 container pickup/drop
            moveFrame: 0, sp: {}
        });
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
        if(!md){
            md = scene.registry.get('mdc').getActive();    
        }
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
        
    // prefrom an onHand action for the given item based on the current mode
    onHandAction (scene, item, tx, ty) {
        const person = this;
        const onHand = person.getData('onHand');
        const maxOnHand = person.getData('maxOnHand');
        const im = person.getData('itemMode');
        const mdc = scene.registry.get('mdc');
        const pos_person = person.getTilePos();
        const pos_item = item? item.getTilePos(): {x:0, y:0};
        const d = Phaser.Math.Distance.BetweenPoints( pos_person, pos_item  );
        if( im === 0 ){
            console.log(item);
        }
        // pick up an item
        if( im === 1 ){
           if(d < 2 && item.droped && onHand.length < maxOnHand ){
                if( item.iType === 'Container'){
                    const item_new = item.spawnItem(scene);
                    if(item_new){
                        onHand.push( item_new );
                    }
                }
                if( item.iType === 'Item' ){
                    mdc.removeItemFromActive(item);
                    onHand.push( item );        
                }
           }
           if(onHand.length >= maxOnHand){}
        }
        // drop what you have on hand
        if( im === 2 && onHand.length > 0 ){
           if( item ){
               if(item.iType === 'Container'){
                   const item2 = onHand.pop();
                   if( !item.addItem( item2 ) ){
                       onHand.push(item2);
                   }       
               }
           }
           if( !item ){ // drop a loose item
               const item2 = onHand.pop();
               item2.x = tx * 16 + 8;
               item2.y = ty * 16 + 8;
               mdc.addItemToActive(item2);   
           }
        }
        // pick up a container
        if( im === 3 && item ){
            if(item.iType === 'Container'){
                mdc.removeItemFromActive(item);
                item.setFrame(item.prefix + '_close');
                onHand.push( item );     
            } 
        }
    }
        
    update (scene) {
        const person = this;
        const onHand = person.getData('onHand');
        if(onHand){
            const len = onHand.length;
            if(len > 0){
                let i = 0;
                while(i < len){
                    onHand[i].x = person.x + 8;
                    onHand[i].y = person.y - 8 - i * 2;
                    i += 1;
                }
            }
        }
    }
        
}
    
 
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
/*
    data : {
        1 :  { count: 3, spawn: 0 },
        2 :  { count: 0, spawn: 0 },
        3 :  { count: 2, spawn: 0 },
        4  : { count: 1, spawn: 0 }
    },
*/
    setSubType: function (people, scene, person ) {
        person.setData('subType', 'employee');
    },
    
    canSpawn : function (people, scene, now) {
        const mdc = scene.registry.get('mdc');
        const md = people.md; //mdc.getActive();
        //const dat = this.data[md.index];
        const len = people.children.size;
        //if( dat.spawn < dat.count ){
            //dat.spawn += 1;
        if(len < people.maxSize){
            return true;
        }
        return false;
    }

};
    
PEOPLE_TYPES.worker.employee = {
    update: (people, scene, person) => {},
    create: (people, scene, person) => {
        const mdc = scene.registry.get('mdc');
        const md = people.md;
        let p = md.hardMapData.spawnAt;
        person.setToTilePos(p);
        mdc.setActiveMapByIndex(scene, mdc.activeIndex);
    },
    noPath: (people, scene, person) => {
        const player = scene.registry.get('player');
        if(person != player){
            const tile = people.md.getRandomWalkTo();
            person.setPath(scene, null, tile.x, tile.y);
        }	
    }
};
    
PEOPLE_TYPES.customer = {

    setSubType: function (people, scene, person ) {
        people.setRandomSubType( person );
    },
    
    canSpawn : function (people, scene, now) {
        const lastSpawn = people.getData('lastSpawn');
        const t = now - lastSpawn;
        return people.children.size < people.maxSize && t >= people.spawnRate;
    }

};
    
PEOPLE_TYPES.customer.shopper = {
    
    update: (people, scene, person) => {
    
    
    
    },
    create: (people, scene, person) => {
        const mdc = scene.registry.get('mdc');
        const md = mdc.getActive();   
        people.setMapSpawnLocation(md, person);
        
        people.shId = people.shId === undefined ? 0 : people.shId += 1;
        person.shId = people.shId; 
        
        person.name = 'shopper#' + person.shId;
        
        console.log(person.name, 'hello my name is ' + person.name);
        
    },
    noPath: (people, scene, person) => {
        const mdc = scene.registry.get('mdc');
        const md = mdc.getActive();
        const pc = person.getData('pathCT');
        const pn = person.number;
        
        /*
        if(pc < 3){
            console.log(person.name, 'I have a path count of ' + pc);
            const tile = md.getRandomWalkTo();
            person.setPath(scene, null, tile.x, tile.y);
        }
        */
        
        
        
        let ioi = person.getData('itemOfInterest');
        const items = md.donations.getItemType('Item');
        
        if(items.length === 0){
            console.log(person.name, 'No Items, guess I will just walk around then. I have a path count of ' + pc);
            const tile = md.getRandomWalkTo();
            person.setPath(scene, null, tile.x, tile.y);
        }
        
        if(!ioi && items.length > 0){
            console.log(person.name, 'oh I see something I might like!');
            
            const iLen = items.length;
            const item = items[ Math.floor(Math.random() * iLen) ];
            const pos = item.getTilePos();
            
            console.log(items.length);
            
            person.setPath(scene, null, pos.x, pos.y);
            person.setData('itemOfInterest', item);
        }
        
        if(ioi){
            console.log(person.name, 'I shal buy, says I!');
            let gs = scene.registry.get('gameSave');
            gs.money += ioi.price.shelf;
            scene.registry.set('gameSave', gs);
            ioi.destroy();
            person.setData('itemOfInterest', null);
        }
        
        /*
        if(pc >= 3){
            console.log(person.name, 'maybe I should look for an item, I am in a store after all');
            
            const items = md.donations.getChildren();
            const iLen = items.length;
            const item = items[ Math.floor(Math.random() * iLen) ];
            //console.log( item.price );
        
            const tile = md.getRandomWalkTo();
            person.setPath(scene, null, tile.x, tile.y);
        }
        */
    }
        
};
    
PEOPLE_TYPES.customer.donator = {
    
    update: (people, scene, person) => {        },

    create: (people, scene, person) => { 
        const max_donations = scene.registry.get('MAX_MAP_DONATIONS') || 11;
        const mdc = scene.registry.get('mdc');
        const md = mdc.getActive();
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
    },
    
    noPath: (people, scene, person) => {
        const mdc = scene.registry.get('mdc');
        const md = mdc.getActive();     
        let onHand = person.getData('onHand');
        const tPos = person.getData('trigger_pos');
        const cPos = person.getTilePos();
        const pos_exit = md.hardMapData.customer.exitAt; 
        if(onHand.length > 0 && tPos.x === -1 && tPos.y === -1){
            const tiles_di = get_di_tiles(scene, md.map);
            if(tiles_di.length > 0){
                const dt = tiles_di[ Math.floor( tiles_di.length * Math.random() ) ];
                const tiles_near_di = md.map.getTilesWithin(dt.x - 1, dt.y -1, 3, 3).filter( (tile) => { return md.canWalk(tile) });
                const t = tiles_near_di[ Math.floor( tiles_near_di.length * Math.random() ) ];
                person.setPath(scene, null, t.x, t.y);
                person.setData('trigger_pos', {x: t.x, y: t.y });
            }
            if(tiles_di.length === 0){
                const pos = md.hardMapData.customer.exitAt;
                person.setPath(scene, null, pos.x, pos.y);
            }
        }
        if(onHand.length > 0 && cPos.x === tPos.x && cPos.y === tPos.y){
            let i_item = onHand.length;
            while(i_item--){
                const item = onHand[i_item];
                item.x = person.x;
                item.y = person.y;
                mdc.addItemToActive(item);
                people.onHand.remove(item);
            }
            onHand = [];
            person.setData('onHand', onHand);
        }
        if(cPos.x === pos_exit.x && cPos.y === pos_exit.y ){
            person.kill();
        }
        if(onHand.length === 0  && !(cPos.x === pos_exit.x && cPos.y === pos_exit.y) ){
            person.setPath(scene, null, pos_exit.x, pos_exit.y);
        }        
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
    
    setMapSpawnLocation (md, person) {
        let p = md.hardMapData[person.getData('type')].spawnAt;
        if(p instanceof Array){
           p = p[ Math.floor( p.length * Math.random() ) ];
        }
        person.setToTilePos(p);
    }
        
    spawnPerson (scene, name='') {
        const mdc = scene.registry.get('mdc');
        const people = this.getChildren();
        const pConfig = this.getData('pConfig');
        const now = new Date();
        const ty = this.getData('type');
        const pt = get_pt(ty);
        if(!mdc){
            console.log(mdc);
        }
        if( pt.canSpawn(this, scene, now) ){
            this.setData('lastSpawn', now);
            
                       
            
            
            const config = Object.assign({}, { number: this.number }, pConfig);
            
            
            const person = this.get({ x: 0, y: 0, texture: 'people_16_16', frame:0 }, config );
            this.number += 1;
            person.setData('type', this.getData('type') );
            pt.setSubType(this, scene, person);
            const st = get_spt( person ); 
            st.create(this, scene, person);
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


    getCollider(gameObject, scene){
        const map = this.scene.map;
        const people = this;
        return function( a, b ) {
        }   
    }

    update (scene) {
        const mdc = scene.registry.get('mdc');
        const md = mdc.getActive();
        const map = md.map;
        const type = this.getData('type');
        const subTypes = this.getData('subTypes');
        const people = this.getChildren();
        if(!md.hardMapData.customer.disabled){ 
            this.spawnPerson(scene);
            let i_people = people.length;
            while(i_people--){
                const person = people[i_people];
                const spt = get_spt(person, person.getData('subType'));
                if(spt){
                    spt.update(this, scene, person);
                    const tx = Math.floor(person.x / 16);
                    const ty = Math.floor(person.y / 16);
                    const tile = map.getTileAt(tx, ty, false, 0);
                    if(person.getData('path').length === 0 ){            
                        spt.noPath(this, scene, person);   
                    }
                    person.update(scene);
                    person.pathProcessorCurve( scene, ()=>{
                        spt.noPath(this, scene, person);
                    });
                }                                
            }
        }
    }

}

export { Person, People };

