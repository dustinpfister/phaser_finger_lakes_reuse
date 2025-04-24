
class MapData {

    constructor (scene, map_index=0, opt) {
        opt = opt || {};
        opt.sheet = opt.sheet || 'map_16_16';
        opt.collisionIndices = opt.collisionIndices || [ 2 ];
        this.hardMapData = scene.cache.json.get('map' + map_index + '_data');
        const map = this.map = scene.make.tilemap({ key: 'map' + map_index, layers:[], tileWidth: 16, tileHeight: 16 });
        //map.setCollisionByExclusion( opt.collisionIndices, true, true, 0 );
        const tiles = this.tiles = map.addTilesetImage(opt.sheet);
        const layer0 =  this.layer0 = map.createLayer(0, tiles);
        layer0.depth = 0;
        //scene.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);  
        //scene.children.sortByDepth( scene.player, map);
        //scene.physics.add.collider( scene.player, layer0 );
    }

};

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

export { MapData, MapLoader };

