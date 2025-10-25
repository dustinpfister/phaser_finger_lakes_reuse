
class MapChunks extends Phaser.Tilemaps.Tilemap {

    createMapData () {
    
        //const mapData = new Phaser.Tilemaps.MapData();
    
    }

    constructor ( conf={} ) {
        conf.scene = conf.scene || new Phaser.Scene();
        conf.mapData = conf.mapData || new Phaser.Tilemaps.MapData([]);
        
        console.log()
        
        super( conf.scene, conf.mapData );
    }


} 

class Demo extends Phaser.Scene {

    preload () {
        this.texture = this.textures.createCanvas('tiles', 32, 32);
        const ctx = this.texture.context;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(16, 0, 16, 16);
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(0, 16, 16, 16);
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(16, 16, 16, 16);
        this.texture.refresh();
    }


/*
    initMap (w=8, h=8, fill_index=0) {
        const mapData = [];
        let my = 0;
        while(my < h){
            mapData.push( new Array(w).fill(fill_index) );
            my += 1;
        }
        return this.map = this.make.tilemap({
            data: mapData,
            tileWidth: w, tileHeight: h
        });   
    }
*/
    create () {
    
    
        const map = new MapChunks({
           scene: this
        });


        const tileset = map.addTilesetImage('tiles');
        const x = 160 - map.width * map.tileWidth / 2;
        const y = 120 - map.height * map.tileHeight / 2;
        const layer = map.createLayer(0, tileset, x, y);


        this.add.tilemap(map)
    
    }

    update (time, delta) {
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 320,
    height: 240,
    parent: 'container_flr',
    canvas: document.querySelector('#canvas_flr'),
    scene: Demo
};

const game = new Phaser.Game(config);
