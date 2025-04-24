
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

}

export { MapData };

