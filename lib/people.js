import { PathFinder } from "./pathfinding.js";
import { Item, Container } from "./items.js";

const NOOP = function(){};

/********* **********
PERSON ( Person Class, People Class, People Types )
********** *********/

class Person extends Phaser.Physics.Arcade.Sprite {
    
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.depth = 11;
        this.nCurve = 0;
        this.speedCurve = 0.90;
        this.vecCurve = new Phaser.Math.Vector2();
        this.curve = null;
        this.setData({ 
            path: [], hits: 0, idleTime: 0,
            onHand: [], maxOnHand: 3,
            trigger_pos: {x: -1, y: -1},
            type: '', subType: '',
            itemMode: 1,   // 1 item pickup, 2 item drop, 3 container pickup/drop
            moveFrame: 0, sp: {}
        });
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
        if(i === 1){
            cb(scene, this);     
        }
    }
  
    setRandomPath (scene) {
        //scene.map.setLayer(0);
        /*
        const walkable = scene.map.filterTiles((tile)=>{
            return //tile.index === 1;
        });
        const tile = walkable[ Math.floor( walkable.length * Math.random() ) ];
        this.setPath(scene, null, tile.x, tile.y);
        */
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
    }
        
    // prefrom an onHand action for the given item based on the current mode
    onHandAction (scene, item, tx, ty) {
        const person = this;
        const onHand = person.getData('onHand');
        const maxOnHand = person.getData('maxOnHand');
        const im = person.getData('itemMode');
        //const items = scene.registry.get('items');
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
                    //person.setData('onHand', onHand);        
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
           
               console.log('no item? then drop what is on hand');
           
               const item2 = onHand.pop();
               item2.x = tx * 16 + 8;
               item2.y = ty * 16 + 8;
               
               mdc.addItemToActive(item2);
               
           }
               
        }
        // pick up a container
        if( im === 3 && item ){
            if(item.iType === 'Container'){
                //item.droped = false;
                /*
                mdc.getActive().donations.remove(item);
                */
                
                mdc.removeItemFromActive(item);
                onHand.push( item );
                //person.setData('onHand', onHand);     
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

const get_pt = (person) => {
    return PEOPLE_TYPES[ person.getData('type') ][ person.getData('subType') ];
};
       
PEOPLE_TYPES.worker = {};
    
PEOPLE_TYPES.worker.employee = {
    update: (people, scene, person) => {},
    create: (people, scene, person) => {},
    collider: (people, gameObject, scene ) => {},
    noPath: (people, scene, person) => {}
};
    
PEOPLE_TYPES.customer = {};
    
PEOPLE_TYPES.customer.shopper = {
    
    update: (people, scene, person) => {},
    create: (people, scene, person) => {
        person.body.setDrag(500, 500);
    },
        
    collider: (people, gameObject, scene ) => {},
       
    noPath: (people, scene, person) => {
        const pos_exit = scene.mapData.customer.exitAt;
        const tx = Math.floor( person.x / 16 );
        const ty = Math.floor( person.y / 16 );
        if( tx === pos_exit.x && ty === pos_exit.y){
            person.destroy(true, true);
        }else{
            person.setPath(scene, null, pos_exit.x, pos_exit.y );
        }
    }
        
};
    
PEOPLE_TYPES.customer.donator = {
    
    update: (people, scene, person) => {        },

    create: (people, scene, person) => {
        //const items = scene.registry.get('items');
        //const containers = scene.registry.get('containers');
        //const max_donations = scene.game.registry.get('MAX_DONATIONS');
        //person.body.setDrag(500, 500);
        //const donations = scene['map_donations' + scene.map_index];
        //const donations_incoming = people.children.entries.filter((person)=>{ return person.getData('onHand').length > 0;  }).length;
        //const donations_drop = donations.children.size; 
        
        const max_donations = 5;
        const mdc = scene.registry.get('mdc');
        const donations = mdc.getActive().donations;
        const donations_incoming = people.totalOnHandItems();
        const donations_drop = donations.children.size;
        const donations_total = donations_incoming + donations_drop; 
        if(donations_total < max_donations){
            //const donation_data = containers['box_items_hh'];
            const donation = new Container(scene, 'box_items_hh', person.x, person.y);
            scene.add.existing(donation);
            person.setData('onHand', [ donation ] );
        }
    },

    collider: (people, gameObject, scene ) => {},
        
    noPath: (people, scene, person) => {
        //scene.map.setLayer(0);
        //const items = scene.registry.get('items');
        const mdc = scene.registry.get('mdc');
        const md = mdc.getActive();     
        let onHand = person.getData('onHand');
        const tPos = person.getData('trigger_pos');
        const cPos = person.getTilePos();
        //const pos_exit = scene.mapData.customer.exitAt;
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
                
                //item.droped = true;
                //scene['map_donations' + scene.map_index ].add(item, false);
            }
            onHand = [];
            person.setData('onHand', onHand);
            //person.setPath(scene, null, pos_exit.x, pos_exit.y);
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
        const scene = config.scene
        const world = scene.physics.world;
        super(world, scene, config);
        this.data = new Phaser.Data.DataManager(this,  new Phaser.Events.EventEmitter() );
        
        this.setData('lastSpawn', new Date());
        this.setData('type', pConfig.type);
        this.setData('subTypes', pConfig.subTypes);
        this.setData('subTypeProbs', pConfig.subTypeProbs);
        this.setData('pConfig', pConfig);  
    }
        
    setData (key, value){ return this.data.set(key, value); }
    getData (key, value){ return this.data.get(key); }
        
    spawnPerson (scene) {
        const mdc = scene.registry.get('mdc');
        const md = mdc.getActive();
        const people = this.getChildren();
        const pConfig = this.getData('pConfig');
        const subTypes = this.getData('subTypes');
        const subTypeProbs = this.getData('subTypeProbs');
        const now = new Date();
        const lastSpawn = this.getData('lastSpawn');
        if( people.length < this.maxSize && now - lastSpawn >= 1000 ){
            this.setData('lastSpawn', now);
            let p = md.hardMapData.customer.spawnAt;
            if(p instanceof Array){
                p = p[ Math.floor( p.length * Math.random() ) ];
            }
            let i = people.length;
            while(i--){
                const person = people[i];
                if( Math.floor( person.x / 16 ) === p.x && Math.floor( person.y / 16 ) === p.y ){
                    return;
                }
            } 
            const person = this.get(p.x * 16 + 8, p.y * 16 + 8);
            person.setData('type', this.getData('type') ); 
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
            person.setFrame( person.getData('subType') + '_down');
            person.setConf({
                cash: pConfig.cash
            });
            
            
            const pt = get_pt(person);
            
            pt.create(this, scene, person);
            
        }
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
            const pt = get_pt(person);
            if(pt){
                pt.update(this, scene, person);
            }
            const tx = Math.floor(person.x / 16);
            const ty = Math.floor(person.y / 16);
            const tile = map.getTileAt(tx, ty, false, 0);
            if(person.getData('path').length === 0 ){
            
                pt.noPath(this, scene, person);   
            }
            person.update(scene);
            person.pathProcessorCurve( scene, ()=>{
                pt.noPath(this, scene, person);
            });                   
        }
        
        }
    }

}

export { Person, People };

