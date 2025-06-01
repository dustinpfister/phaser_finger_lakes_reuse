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
        this.action = pConfig.action || 'wonder';
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
        1 :  { count: 3, spawn: 0 },
        2 :  { count: 0, spawn: 0 },
        3 :  { count: 3, spawn: 0 },
        4  : { count: 2, spawn: 0 }
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
        let p = md.hardMapData.spawnAt;
        person.setToTilePos(p);
        mdc.setActiveMapByIndex(scene, mdc.activeIndex);
    },
    
    noPath: (mdc, md, people, scene, person) => {
        const player = scene.registry.get('player');
        if(person != player){
            if(person.action === 'stock'){
                person.setData('itemMode', 2);
                const pos = person.getTilePos();
                
                people.onHandAction(scene, person, null, md, pos.x, pos.y);
                
                
                console.log('I can stock now see!');
                const oh = person.getData('onHand');
                console.log( 'Items on hand now: ' + oh.length );
                
                if(oh.length > 0 ){
                    const tile = md.getRandomWalkTo();
                    person.setPath(scene, md, tile.x, tile.y);
                }
                if(oh.length === 0){
                    console.log('I am now out of items, so I should get some more now.');
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
    }
    
};
    
PEOPLE_TYPES.customer = {

    setSubType: function (mdc, md, people, scene, person ) {
        people.setRandomSubType( person );
    },
    
    canSpawn : function (mdc, md, people, scene, now) {
        const lastSpawn = people.getData('lastSpawn');
        const t = now - lastSpawn;
        return people.children.size < people.maxSize && t >= people.spawnRate;
    }

};
    
PEOPLE_TYPES.customer.shopper = {
    
    update: (mdc, md, people, scene, person) => {
    },
    
    create: (mdc, md, people, scene, person) => {
        people.setMapSpawnLocation(md, person);
        people.shId = people.shId === undefined ? 0 : people.shId += 1;
        person.shId = people.shId; 
        person.name = 'shopper#' + person.shId;
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
    },
    
    noPath: (mdc, md, people, scene, person) => {    
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
                person.setPath(scene, md, t.x, t.y);
                person.setData('trigger_pos', {x: t.x, y: t.y });
            }
            if(tiles_di.length === 0){
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
                    console.log('can not find a space!');
                }
                
                if(pos_drop != null){
                
                    person.setData('itemMode', 2);
                    item.x = pos_drop.x * 16 + 8;
                    item.y = pos_drop.y * 16 + 8;
                    item.droped = true;
                    mdc.addItemTo(item, md, 'donations');
                    people.onHand.remove(item);
                    person.setData('onHand', []);
                    
                    
                    
                    //person.setData('itemMode', 2);
                    //people.onHandAction(scene, person, item, md, cPos.x, cPos.y);
                
                }
            }
            //person.setData('onHand', []);
        }
        if(cPos.x === pos_exit.x && cPos.y === pos_exit.y ){
            person.kill();
        }
        if(onHand.length === 0  && !(cPos.x === pos_exit.x && cPos.y === pos_exit.y) ){
            person.setPath(scene, md, pos_exit.x, pos_exit.y);
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
        
    spawnPerson (mcd, md, scene, name='') {
        const people = this.getChildren();
        const pConfig = this.getData('pConfig');
        const now = new Date();
        const ty = this.getData('type');
        const pt = get_pt(ty);
        if( pt.canSpawn(mcd, md, this, scene, now) ){
            this.setData('lastSpawn', now);  
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


    getCollider(gameObject, scene){
        const map = this.scene.map;
        const people = this;
        return function( a, b ) {
        }   
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
                    //mdc.removeItemFromActive(item);
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
                   
                   console.log(item)
                   console.log(item2);
                   
               }
           }
           if( !item ){ // drop a loose item       
               const item2 = onHand.pop();
               item2.x = tx * 16 + 8;
               item2.y = ty * 16 + 8;
               //mdc.addItemToActive(item2);
               
               mdc.addItemTo(item2, md, 'donations');
               people.onHand.remove(item2);
               
               console.log(onHand);
               
               //person.setData('onHand', onHand);
              
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
        md = md === undefined ? mdc.getActive(): md;
        const map = md.map;
        const type = this.getData('type');
        const subTypes = this.getData('subTypes');
        const people = this.getChildren();
        if(!md.hardMapData.customer.disabled){ 
            this.spawnPerson(mdc, md, scene);
            let i_people = people.length;
            while(i_people--){
                const person = people[i_people];
                const spt = get_spt(person, person.getData('subType'));
                if(spt){
                
                    spt.update(mdc, md, this, scene, person);
                    
                    const tx = Math.floor(person.x / 16);
                    const ty = Math.floor(person.y / 16);
                    const tile = map.getTileAt(tx, ty, false, 0);
                    if(person.getData('path').length === 0 ){            
                        spt.noPath(mdc, md, this, scene, person);   
                    }
                    person.update(scene);
                    person.pathProcessorCurve( scene, ()=>{
                        spt.noPath(mdc, md, this, scene, person);
                    });
                   
                }                                
            }
        }
    }

}

export { Person, People };

