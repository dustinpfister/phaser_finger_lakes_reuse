import { PathFinder } from "../../lib/pathfinding.js";


class Demo extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Demo';
    }
    
    clear () {
        const layer1 = this.layer1;
        layer1.forEachTile((tile)=>{
            tile.index = -1;
        });
    }
    
    setPath (sx=0, sy=0, ex=0, ey=0) {
        const pf = this.pf;
        pf.preparePathCalculation([sx, sy],[ex, ey]);
        pf.calculatePath();
    }

    create () {


        const grid = [
            [0,1,0,0,0],
            [0,1,0,1,0],
            [0,0,0,0,0],
            [1,1,0,1,0],
            [0,0,0,0,0]
        ];

        this.texture = this.textures.createCanvas('tiles', 32, 32);
        const ctx = this.texture.context;
        ctx.fillStyle = '#8f8f8f';
        ctx.fillRect( 0, 0, 16, 16 );
        ctx.fillStyle = 'black';
        ctx.fillRect( 16, 0, 16, 16 );
        ctx.fillStyle = 'lime';
        ctx.fillRect( 0, 16, 16, 16 );
        
        this.texture.refresh();


        const map =  this.make.tilemap({ data: grid, tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage('tiles');
        const layer0 = this.layer0 = map.createLayer(0, tileset, 32, 32);
        const layer1 = this.layer1 = map.createBlankLayer(1, tileset, 32, 32);

        const pf = this.pf = new PathFinder();
        pf.setGrid(grid, [0, 2] );
        const scene = this;
        pf.setCallbackFunction ( function(a ) {
            a.forEach((point) => {
                layer1.putTileAt(2, point.x, point.y)
            });
        });
        
        this.setPath(2,0,4,2);


    }
    
}


const config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: '#afafaf',
    scene: Demo,
    zoom: 1,
    render: { pixelArt: true  },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x:0 }
        }
    }
};
const demo = new Phaser.Game(config);


