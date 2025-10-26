
const chunk_collection = {
    width: 4,
    height: 4,
    chunks: {
        '0': {
           data: [
               0,0,0,0,
               0,0,0,0,
               0,0,0,0,
               0,0,0,0
           ]
        },
        '1': {
           data: [
               0,0,0,0,
               0,0,0,0,
               0,0,0,0,
               0,0,0,0
           ]
        },
        '2': {
           data: [
               0,0,0,0,
               0,0,0,0,
               0,0,0,0,
               0,0,0,0
           ]
        },
        '3': {
           data: [
               0,0,0,0,
               0,0,0,0,
               0,0,0,0,
               0,0,0,0
           ]
        }
    
    }

};


class Example extends Phaser.Scene {

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
    
    initMap (w=8, h=8, fill_index=0) {
        const scene = this;
        const data = [];
        let my = 0;
        while(my < h){
            data.push( new Array(w).fill( fill_index ) );
            my += 1;
        }
        const map = scene.make.tilemap({
            data: data,
            tileWidth: 16, tileHeight: 16
        });
        const tileset = map.addTilesetImage('tiles');
        map.createLayer(0, tileset)    
        return map;
    }

    create () {
        const map = this.initMap();
        
        const tile = map.getTileAt(0, 0);
        tile.index = 1;
        
        console.log(map)
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
    scene: Example
};

const game = new Phaser.Game(config);
