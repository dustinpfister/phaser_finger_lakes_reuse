import { PathFinder } from "../../lib/pathfinding/pathfinding.js";

const TS = 32;
const GRID = [
    [0,1,0,1,0,1,0,1,0,0,0,1,1,0,0],
    [0,1,0,0,0,1,0,0,0,1,0,0,1,1,0],
    [0,1,0,1,0,0,0,1,1,1,1,0,1,0,0],
    [0,0,0,1,0,1,0,0,0,0,1,0,1,0,1],
    [1,1,1,1,0,1,1,1,1,0,1,0,0,0,0],
    [0,1,0,0,0,0,0,0,1,0,1,1,1,1,0],
    [0,1,1,0,1,1,1,0,1,0,1,0,0,0,0],
    [0,0,0,0,1,0,1,0,1,0,1,0,1,1,1],
    [1,1,1,1,1,0,0,0,1,0,1,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,1,1,1,1,0],
    [0,1,1,1,1,0,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0,1,0,1,1,1],
    [1,1,1,0,1,0,1,0,1,0,1,0,0,0,0],
    [0,0,1,0,1,0,1,0,1,0,1,1,1,1,0],
    [1,0,0,0,1,0,0,0,1,0,0,0,0,0,0]
];

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
    
    createTexture () {
        this.texture = this.textures.createCanvas('tiles', TS * 2, TS * 2);
        const ctx = this.texture.context;
        ctx.fillStyle = '#8f8f8f';
        ctx.fillRect( 0, 0, TS, TS );
        ctx.fillStyle = 'black';
        ctx.fillRect( TS, 0, TS, TS );
        ctx.fillStyle = 'lime';
        ctx.fillRect( 0, TS, TS, TS );
        ctx.fillStyle = 'blue';
        ctx.fillRect( TS, TS, TS, TS );
        this.texture.refresh();
    }

    create () {
        const scene = this;
        this.createTexture();
        const map =  this.make.tilemap({ data: GRID, tileWidth: TS, tileHeight: TS });
        const tileset = map.addTilesetImage('tiles');
        const sx = scene.game.config.width / 2 - (GRID[0].length * TS / 2);
        const sy = scene.game.config.height / 2 - (GRID.length * TS / 2);
        const layer0 = this.layer0 = map.createLayer(0, tileset, sx, sy);
        const layer1 = this.layer1 = map.createBlankLayer(1, tileset, sx, sy);
        const pf = this.pf = new PathFinder();
        pf.setGrid(GRID, [0, 2] );
        pf.setCallbackFunction ( function(a ) {
            a.forEach((point) => {
                layer1.putTileAt(2, point.x, point.y)
            });
        });
        let sp = null;
        layer1.setInteractive();
        layer1.on('pointerdown', (pointer, x, y ) => {  
            const tile = layer0.getTileAtWorldXY(pointer.worldX, pointer.worldY);
            if(!tile){ return; }
            if(tile.index === 0){
                if(!sp){
                    scene.clear();
                    sp = { x: tile.x, y: tile.y };
                    layer1.putTileAt(3, tile.x, tile.y);
                }else{
                    scene.setPath( sp.x, sp.y, tile.x, tile.y );
                    sp = null;
                }
            }
            if(tile.index === 1){
                scene.clear();
                sp = null;
            }
        });
    }
    
}


const config = {
    type: Phaser.WEBGL,
    parent: 'container_flr',
    canvas: document.querySelector('#canvas_flr'),
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


