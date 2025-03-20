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
        
        
        this.texture.refresh()
        
    }

    create () {
    
        const mapData = [
          [1,2,3,0,0,0,0,0],
          [1,1,2,3,0,0,0,0],
          [1,1,1,2,3,0,0,0],
          [1,1,1,1,2,3,0,0]
        ];
        
        const map = this.map = this.make.tilemap({
            data: mapData,
            tileWidth: 16, tileHeight: 16
        });
        
        console.log(map);
        
        const tileset = this.map.addTilesetImage('tiles');
        const x = 160 - map.width * map.tileWidth / 2;
        const y = 120 - map.height * map.tileHeight / 2;
        const layer = this.map.createLayer(0, tileset, x, y);
        
    }

    update (time, delta) {
        const map = this.map;
        for (let y = 0; y < map.height; y++) {
            for (let x = 1; x < map.width; x++) {
                const tile = map.getTileAt(x, y);
                const prev = map.getTileAt(x - 1, y);
                prev.index = tile.index;
                if (x === map.width - 1){
                    tile.index = Math.floor( Math.random() * 3 );
                }
            }
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 240,
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);
