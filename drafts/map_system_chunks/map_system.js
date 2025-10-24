class Example extends Phaser.Scene {

    t = 0;
    speed = 1000;

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
    
    initMap () {
        const w = 16, h = 10, mapData = [];
        let my = 0;
        while(my < h){
            mapData.push( new Array(w).fill(0) );
            my += 1;
        }
        return this.map = this.make.tilemap({
            data: mapData,
            tileWidth: 16, tileHeight: 16
        });   
    }

    create () {
        const map = this.initMap(); 
        const tileset = map.addTilesetImage('tiles');
        const x = 160 - map.width * map.tileWidth / 2;
        const y = 120 - map.height * map.tileHeight / 2;
        const layer = map.createLayer(0, tileset, x, y);
    }

    rndIndex () {
        return Math.floor( Math.random() * 4 );
    }

    shiftMap (dx = 0, dy = 0) {
        const map = this.map;
        const sx = dx < 0 ? map.width : 0;
        let ex = dx < 0 ? 0 : map.width;
        const xStep = dx < 0 ? -1 : 1;
        
        const sy = dy < 0 ? map.height : 0;
        let ey = dy < 0 ? 0 : map.height;
        ey = dy === 0 ? sy : ey;
        const yStep = dy < 0 ? -1 : 1;
        if(dx === 0 && dy === 0){
            return;
        }
        let i = 0;
        loop: for (
            let y = sy;
            yStep < 0 ? (y > ey) : (y < ey) ;
            y += yStep
        ) {
            for (
                let x = sx;
                dx > 0 ? ( x < map.width ) : ( x >= 0 ) ;
                //xStep < 0 ? (x < ex) : (x > ex) ;
                x += xStep
            ) {
                i += 1;
                
                if(i >= 20000){
                
                    console.log('stuck');
                    console.log(sx, ex, x);
                    break loop;
                }
                const tile = map.getTileAt(x, y);
                const prev = map.getTileAt(x - dx , y - dy);     
                if(prev === null){
                    continue;
                }
                prev.index = tile.index;
                if ( ( x === 0 && dx < 0 ) || 
                     ( x === map.width - 1 && dx > 0 ) || 
                     ( y === 0 && dy < 0 ) ||
                     ( y === map.height - 1 && dy > 0 ) ){
                    tile.index = this.rndIndex();
                }
            }
        }
    }

    update (time, delta) {
        this.t += delta;
        const map = this.map;
        if(this.t >= this.speed){
            this.t %= this.speed;
            this.shiftMap(1, 1);
        }
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
