import { Item, Container, ItemCollection } from './items.js';
import { People, Person } from './people.js';

const boundingBox = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(
        (y1 + h1) < y2 ||
        y1 > (y2 + h2) ||
        (x1 + w1) < x2 ||
        x1 > (x2 + w2));
};

class MapData {

    constructor (scene, map_index=0, opt) {
        opt = opt || {};
        const md = this;
        this.mdc = opt.mdc;
        this.index = map_index;
        const player = opt.player = opt.player || null;
        opt.sheet = opt.sheet || 'map_16_16';
        //opt.collisionIndices = opt.collisionIndices || [ 2 ];
        const hmd = this.hardMapData = scene.cache.json.get('map' + map_index + '_data');
        const data = scene.cache.tilemap.get('map' + map_index).data.trim().split(/\n/g).map( (row, i_row) => {
            return row.split(',').filter((n)=>{ return !(String(parseInt(n)) === 'NaN') }).map((n, i_col) => {
                const i = parseInt(n);
                console.log(map_index, i);
            
                return hmd.tilePalette.indices[i][1];
            });    
        });
        //const map = this.map = scene.make.tilemap({ key: 'map' + map_index, layers:[], tileWidth: 16, tileHeight: 16 });
        const map = this.map = scene.make.tilemap({ data: data, layers:[], tileWidth: 16, tileHeight: 16 });
        //map.setCollisionByExclusion( opt.collisionIndices, true, true, 0 );
        const tiles = this.tiles = map.addTilesetImage(opt.sheet);
        const layer0 =  this.layer0 = map.createLayer(0, tiles);
        layer0.depth = 0;
        layer0.visible = false;
        layer0.active = false;
        //const layer1 =  this.layer1 = map.createBlankLayer(1); 
        //scene.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);  
        //scene.children.sortByDepth( scene.player, map);
        //scene.physics.add.collider( scene.player, layer0 );
        this.setupDonations(scene);
        layer0.setInteractive();
        layer0.on('pointerdown', (pointer, px, py)=>{
            const tx = Math.floor( pointer.worldX / 16 );
            const ty = Math.floor( pointer.worldY / 16 );
            const tile = map.getTileAt(tx, ty, false, 0);
            const items = md.donations.getChildren().filter((item)=>{
                return boundingBox(item.x - 8, item.y - 8, 16, 16, px, py, 1, 1);
            }); 
            const item = items[0];
            if(item){
                const player = scene.player;
                const pos = player.getTilePos();
                player.onHandAction(scene, item, pos.x, pos.y);
                return;
            }
            
            
            if(tile){
                const itemMode = player.getData('itemMode');
                if(!md.canWalk(tile)){
                    console.log(tile.index);
                }
                if(md.canWalk(tile) && itemMode != 2 ){ 
                
                    player.setPath(scene, md, tx, ty);
                }
                if(itemMode === 2 ){
                    player.onHandAction(scene, null, tx, ty);
                }
            }         
        });
        this.customers = new People({
            scene: scene,
            defaultKey: 'people_16_16',
            maxSize: 10,
            createCallback : (person) => {}
        },{
            subTypes: hmd.customer.subTypes,
            subTypeProbs: hmd.customer.subTypeProbs
        });
        
    }
    
    canWalk (tx, y) {
       let t = tx;
       if(typeof tx != 'object'){
           tx = this.map.getTileAt(tx, ty);
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
        this.onhand = new ItemCollection();
        const containers = this.hardMapData.objects.containers;
        const keys = Object.keys( containers );    
        keys.forEach( (key) => {
            containers[key].forEach( (obj) => {
                const container = new Container(scene, key, obj.x * 16 + 8, obj.y * 16 + 8);
                container.droped = true;
                donations.add(container);
                scene.children.add(container);     
            });
        });
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
       opt.startMapIndex = opt.startMapIndex === undefined ? 0 :  opt.startMapIndex
       const player = opt.player = opt.player || null;
       this.mapData = {};
       const mapKeys = scene.cache.tilemap.getKeys();
       const arr = mapKeys.map((key)=>{ return parseInt(key.replace(/map/, '')) });
       arr.sort((a,b)=>{ if(a < b){ return -1} if(b < a){ return 1 } return 0; });
       this.i_start = arr[0]; 
       let i_map = this.i_start;
       this.i_stop = arr.slice(arr.length - 1, arr.length)[0] + 1;
       while(i_map < this.i_stop){
           const md = new MapData(scene, i_map, { mdc: this, player : opt.player });
           this.mapData[ 'map' + i_map ] = md;
           
           console.log( md.getRandomWalkTo() );
           
           i_map += 1;
       }
       this.activeIndex = opt.startMapIndex;     
       this.setActiveMapByIndex(scene, this.activeIndex);
       
       
       
   }
   
   doorCheck (scene, person) {
        const mdc = this;
        const md = mdc.getActive();
        const pos = person.getTilePos();
        const door = md.getDoorAt(pos.x, pos.y);
        if(door){
            const nmd = mdc.getMapDataByIndex(door.to.mapNum);
            mdc.setActiveMapByIndex(scene, door.to.mapNum);         
            const pos = nmd.hardMapData.doors[door.to.doorIndex].position;
            person.x = pos.x * 16 + 8;
            person.y = pos.y * 16 + 8;
            if(pos instanceof Array){
                person.x = pos[0].x * 16 + 8;
                person.y = pos[0].y * 16 + 8;
            }
        }
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
           const bool = index === i;
           md.layer0.active = bool;
           md.layer0.visible = bool;
           md.donations.setVisible(bool);
           
           md.customers.setActive(bool);
           md.customers.setVisible(bool);
           
           md.customers.onHand.setActive(bool);
           md.customers.onHand.setVisible(bool);
           
           if(bool){
               const sp = md.hardMapData.spawnAt;
               const player = scene.player;
               player.x = sp.x * 16 + 8;
               player.y = sp.y * 16 + 8;
           }
       });
   }
   
   addItemTo(item, md, collection='donations'){
       md === undefined ? this.getActive() : md;
       if(typeof md === 'number'){
           md = this.getMapDataByIndex( md );
       }
       md[collection].add(item);
       item.droped = false;
       if(collection === 'donations'){
           item.droped = true;
       }
   }
   
   addItemToActive(item, collection='donations'){
       const md = this.getActive();
       this.addItemTo(item, md, collection);
   
   }
   
   removeItemFromActive(item){
       const md = this.getActive();
       item.droped = false;
       md.donations.remove(item);
   }
   
   getMapDataByIndex(index){
       return this.mapData[ 'map' + index ];
   }
   
   getActive(){
       return this.getMapDataByIndex( this.activeIndex );
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

