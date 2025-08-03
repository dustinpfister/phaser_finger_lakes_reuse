import { Item, Container, ItemCollection } from './items.js';
import { People, Person } from './people/people.js';
import { ConsoleLogger } from './message/message.js';
const log = new ConsoleLogger ({
    cat: 'lib',
    id: 'mapdata',
    appendId: true
});

const boundingBox = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(
        (y1 + h1) < y2 ||
        y1 > (y2 + h2) ||
        (x1 + w1) < x2 ||
        x1 > (x2 + w2));
};

const layer_pointer_event = ( scene, md  ) => {
    return (pointer, px, py) => {
        const player = scene.registry.get('player'),
        itemMode = player.getData('itemMode'),
        pos = player.getTilePos(),
        tx = Math.floor( pointer.worldX / 16 ),
        ty = Math.floor( pointer.worldY / 16 ),
        tile = md.map.getTileAt(tx, ty, false, 0),
        items = md.getItemsAtPX(px, py),
        item = items[0];
        if(item){
            md.worker.onHandAction(scene, player, item, md, pos.x, pos.y);
        }
        if(tile && !item){
            if(!md.canWalk(tile) ){
                log(tile.index);
            }
            if(md.canWalk(tile) && itemMode != 2 && itemMode != 0 ){    
                player.setPath(scene, scene.registry.get('mdc').getActive(), tx, ty);
            }
            if(itemMode === 2 ){
                md.worker.onHandAction(scene, player, item, md, tx, ty);
            }
        }    
        if(itemMode === 0){
            if(tile){
                log('********** **********');
                log('tile info: ');
                log('pos: ' + tile.x + ',' + tile.y);
                log(tile);
                log('********** **********');
            }
            if(items){
                log('********** **********');
                log('items info: ');
                log('num of items: ' + items.length);
                log(items);
                log('********** **********');
            }
        }   
    };
};

class MapData {

    constructor (scene, map_index=0, opt) {
        opt = opt || {};
        const md = this;
        this.mdc = opt.mdc;
        this.index = map_index;
        opt.sheet = opt.sheet || 'map_16_16';
        const hmd = this.hardMapData = scene.cache.json.get('map' + map_index + '_data');
        const data = scene.cache.tilemap.get('map' + map_index).data.trim().split(/\n/g).map( (row, i_row) => {
            return row.split(',').filter((n)=>{ return !(String(parseInt(n)) === 'NaN') }).map((n, i_col) => {
                const i = parseInt(n);
                return hmd.tilePalette.indices[i][1];
            });    
        });
        const map = this.map = scene.make.tilemap({ data: data, layers:[], tileWidth: 16, tileHeight: 16 });
        const tiles = this.tiles = map.addTilesetImage(opt.sheet);
        const layer0 =  this.layer0 = map.createLayer(0, tiles);
        layer0.depth = 0;
        layer0.visible = false;
        layer0.active = false;
        this.setupDonations(scene);
        layer0.setInteractive();
        layer0.on('pointerdown', layer_pointer_event( scene, md ) );
        this.customer = new People({
            scene: scene,
            defaultKey: 'people_16_16',
            maxSize: 10,
            
            createCallback : (person) => {}
        },{
            type: 'customer',
            md: md,
            spawnRate: 0,
            curveSpeed: 0.95,
            subTypes: hmd.customer.subTypes,
            subTypeProbs: hmd.customer.subTypeProbs
        });
        this.worker = new People({
            scene: scene,
            defaultKey: 'people_16_16',       
            maxSize: 10,
            createCallback : (person) => {}
        },{
            type: 'worker',
            md: md,
            spawnRate: 0,
            curveSpeed: 0.95,
            subTypes: [ 'employee' ],
            subTypeProbs: [ 1.00 ]
        }); 
    }
    
    getRecycling() {
        const rbins = this.donations.getChildren().filter( (item ) => {
            return item.key === 'recycle_bin';
        });
        if(rbins.length > 0){
            return rbins[0];
        }
        return null;
    }
    
    getItemsAtTile(pos = {x: 0, y: 0 }){
       return this.donations.getChildren().filter( (item ) => {
           const pos_item = item.getTilePos();
           if(!pos_item){
               return false;
           }
           return pos_item.x === pos.x && pos_item.y === pos.y;
       });
    }
    
    getItemsAtPX (px=0, py=0) {
       return this.donations.getChildren().filter( (item) => {
           return boundingBox(item.x - 8, item.y - 8, 16, 16, px, py, 1, 1);
       }); 
    }
    
    canWalk (tx, y) {
       let t = tx;
       if(typeof tx != 'object'){
           t = this.map.getTileAt(tx, ty);
       }
       const w = this.hardMapData.tilePalette.walkable;
       let i = w.length;
       while(i--){
           if(w[i] === t.index){
               return true;
           }
       }
       return false;
    }
    
    
    findSpot (pos, func, limit=10) {
        let spot = {x: pos.x, y: pos.y}, i = 0;
        while(i < limit){
            const rad = Math.PI * 2 / 8 * ( i % 8 );
            const ray = 1.00 + Math.floor( i / 8 );
            spot.x = pos.x + Math.round(Math.cos(rad) * ray);
            spot.y = pos.y + Math.round(Math.sin(rad) * ray);
            const tile = this.map.getTileAt(spot.x, spot.y);
            if(tile){
                if( func.call(this, tile, spot.x, spot.y, ray, rad, i, limit) ){
                    return tile;
                }
            }
            i += 1;
        }
        return null;
    }
    
    findWalkToNear (pos, limit=10){
         return this.findSpot(pos, function(tile){
            if(tile.index === 1){
                return true;
            }
            return false;
        }, limit);
    
    }
    
    findItemNearSpot (pos, limit=10) {
        return this.findSpot(pos, function(tile){
            const items = this.getItemsAtTile( tile );
            if(!findEmpty && items.length >= 1){
                return true;
            }
            return false;
        }, limit);
    }
    
    findEmptyDropSpot (pos, limit=10, empty=[1, 13, 14, 24]) {
        return this.findSpot( pos, function(tile) {
            const items = this.getItemsAtTile( tile );
            if(items.length === 0 && empty.some((i)=>{ return i === tile.index}) ){
                return tile;
            }     
         });
    }
    
    getRandomWalkTo () {
       const hmd = this.hardMapData, tp = hmd.tilePalette;
       const options = this.map.filterTiles( ( tile ) => {
           return tp.walkable.some( (i) => {
               return tp.indices[i][1] === tile.index;
           });
       });
       return options[ Math.floor( options.length * Math.random()) ];
    }
    
    setupDonations(scene){
        const donations = this.donations = new ItemCollection();
        const containers = this.hardMapData.objects.containers || {};
        const items = this.hardMapData.objects.items;
        const keys = Object.keys( containers );    
        keys.forEach( (key) => {
            containers[key].forEach( (obj) => {
                const container = new Container(scene, key, {}, obj.x * 16 + 8, obj.y * 16 + 8);
                container.droped = true;
                donations.add(container);
                scene.children.add(container);     
            });            
        });
        if(items){
            Object.keys(items).forEach( (key) => {
                items[key].forEach( (obj) => {
                    const item = new Item(scene, key, {}, obj.x * 16 + 8, obj.y * 16 + 8);
                    item.droped = true;
                    item.setPrice(obj.shelf, obj.color);
                    donations.add(item);
                    scene.children.add(item);
                });
            });
        }     
    }
    
    findDoorFrom ( x, y, map_index = -1, returnDoor=false ) {
        const doors = this.hardMapData.doors;
        const options = doors.filter( (door) => {
            if(map_index === -1){
                return true;
            }
            return door.to.mapNum === map_index;
        });
        let near = {
            d: Infinity,
            oi: -1, // options index
            ai: -1  // array index if more than one pos
        };
        const dists = options.map( (door, oi) => {
            const pos = door.position;
            let d = 0;
            if(pos instanceof Array){
                d = pos.map((obj, ai)=>{
                    const n = Phaser.Math.Distance.Between(obj.x, obj.y, x, y);
                    if(n < near.d){
                        near.d = n;
                        near.oi = oi; 
                        near.ai = ai;
                    }
                    return n;
                });
            }
            if(!(pos instanceof Array)){
                d = Phaser.Math.Distance.Between(pos.x, pos.y, x, y);
                if(d < near.d){
                    near.d = d;
                    near.oi = oi; 
                    near.ai = -1;
                }
            }    
            return d;     
        });
        if(options.length === 0){
            return null;
        }    
        if(returnDoor){
            return options[ near.oi ];
        }
        if(near.ai >= 0){
            return options[ near.oi ].position[ near.ai ];
        }
        return options[ near.oi ].position;
    }
    
    getDoorAt (x, y) {
        let di = 0;
        const doors = this.hardMapData.doors;
        const len = doors.length;
        while(di < len){
            const door = doors[di];
            if(x === door.position.x && y === door.position.y){
               return door;
            }
            if(door.position instanceof Array){
               let pi = 0, len = door.position.length;
               while(pi < len){
                   const dx = door.position[pi].x, dy = door.position[pi].y; 
                   if(x === dx && y === dy){
                       return door;
                   }
                   pi += 1;
               }
            }
            di += 1;
        }
        return null;
    }
    
};

class MapDataCollection {

    constructor (scene, opt) {
        opt = opt || {};
        opt.startMapIndex = opt.startMapIndex === undefined ? 0 :  opt.startMapIndex;
        this.scene = scene;
        this.mapData = {};
        this.nameNum = 0;
        const mapKeys = scene.cache.tilemap.getKeys();
        const arr = mapKeys.map((key)=>{ return parseInt(key.replace(/map/, '')) });
        arr.sort((a,b)=>{ if(a < b){ return -1} if(b < a){ return 1 } return 0; });
        this.i_start = arr[0]; 
        let i_map = this.i_start;
        this.i_stop = arr.slice(arr.length - 1, arr.length)[0] + 1;
        while(i_map < this.i_stop){
            const md = new MapData(scene, i_map, { mdc: this });
            this.mapData[ 'map' + i_map ] = md;
            i_map += 1;
        }
        this.activeIndex = opt.startMapIndex;
        
        const md = this.getMapDataByIndex(this.activeIndex);
        const worker = md.worker.spawnPerson(this, md, scene, true);
        if(!opt.player){
            scene.registry.set('player', worker);
        }
        
    }
   
    newName( prefix='worker' ) {
        const n = this.nameNum;
        this.nameNum += 1;
        return prefix + '#' + n;
    }
   
    doorCheck (scene, person, md) {
        const mdc = this;
        md = md === undefined ? mdc.getActive() : md;
        const pType = person.getData('type');
        const pos = person.getTilePos();
        const door = md.getDoorAt(pos.x, pos.y);
        if(door){ 
            const nmd = mdc.getMapDataByIndex(door.to.mapNum);      
            const pos = nmd.hardMapData.doors[door.to.doorIndex].position;
            person.x = pos.x * 16 + 8;
            person.y = pos.y * 16 + 8;     
            if(pos instanceof Array){
                person.x = pos[0].x * 16 + 8;
                person.y = pos[0].y * 16 + 8;     
            }
            md[pType].transToNewMap(person, nmd, md);
            if(person === scene.registry.get('player')){
                mdc.setActiveMapByIndex(scene, nmd.index);
            }
            return door;           
        }
        return null
    }
   
    forAllMaps (scene, func) {
        let i = this.i_start;
        while(i < this.i_stop){       
            func(scene, this.getMapDataByIndex(i), i);
            i += 1;
        }
    }
   
    setActiveMapByIndex (scene, index) {
        this.activeIndex = index;
        this.forAllMaps(scene, (scene, md, i)=>{
            let player = scene.registry.get('player');
            const bool = index === i;
            if(bool){
                scene.physics.world.setBounds(0,0, md.map.width * 16, md.map.height * 16);
            }
        });
    }
   
    addItemTo(item, md, collection='donations'){
        md === undefined ? this.getActive() : md;
        if(typeof md === 'number'){
            md = this.getMapDataByIndex( md );
        }
        md[collection].add(item);
        item.droped = true;
        if(collection === 'donations'){
            item.droped = true;
       }
    }
   
    removeItemFrom(item, md, collection='donations'){
        item.droped = false;
        md[collection].remove(item);
    }
   
    getMapDataByIndex(index){
        return this.mapData[ 'map' + index ];
    }
   
    getActive(){
        return this.getMapDataByIndex( this.activeIndex );
    }
   
    update(time, delta){
        const mdc = this;
        mdc.forAllMaps(this.scene, (scene, md, map_index)=>{     
            md.customer.update(scene, md, delta);
            md.worker.update(scene, md, delta);
            const bool = map_index === mdc.activeIndex;
            md.layer0.active = bool;
            md.layer0.visible = bool;
            md.donations.setVisible(bool);
            md.customer.setActive(bool);
            md.customer.setVisible(bool);
            md.customer.onHand.setActive(bool);
            md.customer.onHand.setVisible(bool);
            md.worker.setActive(bool);
            md.worker.setVisible(bool);
            md.worker.onHand.setActive(bool);
            md.worker.onHand.setVisible(bool);
        });
    }

}

const MapLoader = function(opt) {
   opt = opt || {};
   opt.mapIndicesStart = opt.mapIndicesStart || 0;
   opt.mapIndicesStop = !opt.mapIndicesStop ? 1: opt.mapIndicesStop;
   opt.urlBase = opt.urlBase || './';
   opt.scene = opt.scene || this;  
   let i_map = opt.mapIndicesStart;
   while( i_map < opt.mapIndicesStop ){
       opt.scene.load.json('map' + i_map + '_data', opt.urlBase + 'map' + i_map + '_data.json');
       opt.scene.load.tilemapCSV('map' + i_map, opt.urlBase + 'map' + i_map + '.csv');
       i_map += 1;
   }
}

export { MapData, MapLoader, MapDataCollection };

