import { Item, Container, ItemCollection } from './items.js'

class MapData {

    constructor (scene, map_index=0, opt) {
        opt = opt || {};
        this.mdc = opt.mdc;
        this.index = map_index;
        const player = opt.player = opt.player || null;
        opt.sheet = opt.sheet || 'map_16_16';
        opt.collisionIndices = opt.collisionIndices || [ 2 ];
        this.hardMapData = scene.cache.json.get('map' + map_index + '_data');
        const map = this.map = scene.make.tilemap({ key: 'map' + map_index, layers:[], tileWidth: 16, tileHeight: 16 });
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
        layer0.on('pointerdown', (pointer)=>{
            const tx = Math.floor( pointer.worldX / 16 );
            const ty = Math.floor( pointer.worldY / 16 );
            const tile = map.getTileAt(tx, ty, false, 0);
            if(tile){
                const itemMode = player.getData('itemMode');
                if(tile.index != 1){
                    console.log(tile.index);
                }
                if(tile.index === 1 && itemMode != 2 ){    
                    player.setPath(this, map, tx, ty);
                }
                if(itemMode === 2 ){
                    player.onHandAction(scene, null, tx, ty);
                }
            }         
        });
        
    }
    
    setupDonations(scene){
        const donations = this.donations = new ItemCollection();
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
    
    doorCheck (x, y) {
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
       const player = opt.player = opt.player || null;
       this.mapData = {};
       const mapKeys = scene.cache.tilemap.getKeys();
       const arr = mapKeys.map((key)=>{ return parseInt(key.replace(/map/, '')) });
       arr.sort((a,b)=>{ if(a < b){ return -1} if(b < a){ return 1 } return 0; });
       this.i_start = arr[0]; 
       let i_map = this.i_start;
       this.i_stop = arr.slice(arr.length - 1, arr.length)[0] + 1;
       while(i_map < this.i_stop){
           const mapData = new MapData(scene, i_map, { mdc: this, player : opt.player });
           this.mapData[ 'map' + i_map ] = mapData;
           i_map += 1;
       }
       this.activeIndex = arr[0];
       this.setActiveMapByIndex(scene, this.activeIndex);
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
           console.log(bool);
           
           if(bool){
               const sp = md.hardMapData.spawnAt;
               const player = scene.player;
               player.x = sp.x * 16 + 8;
               player.y = sp.y * 16 + 8;
           }
       });
   }
   
   addItemToActive(item){
       const md = this.getActive();
       md.donations.add(item);
       item.droped = true;
       console.log(md.donations);
   }
   
   removeItemFromActive(item){
       const md = this.getActive();
       item.droped = false;
       md.donations.remove(item);
       console.log(md.donations);
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

