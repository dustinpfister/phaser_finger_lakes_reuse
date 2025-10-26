

const chunk_data = [
    1,0,0,1,    2,0,0,2,    3,0,0,3,
    0,0,0,0,    0,0,0,0,    0,0,0,0,
    0,0,0,0,    0,0,0,0,    0,0,0,0,
    1,0,0,1,    2,0,0,2,    3,0,0,3,

    4,0,0,4,    5,0,0,5,    6,0,0,6,
    0,0,0,0,    0,0,0,0,    0,0,0,0,
    0,0,0,0,    0,0,0,0,    0,0,0,0,
    4,0,0,4,    5,0,0,5,    6,0,0,6,
    
    7,0,0,7,    8,0,0,8,    9,0,0,9,
    0,0,0,0,    0,0,0,0,    0,0,0,0,
    0,0,0,0,    0,0,0,0,    0,0,0,0,
    7,0,0,7,    8,0,0,8,    9,0,0,9
];

const to_data_chunks = (chunk_data=[], fi_per_row=4, mi_per_row=3) => {
    const data = [];
    let i_row = 0;
    const len_row = Math.floor( chunk_data.length / fi_per_row );
    while(i_row < len_row){
        const a = i_row % mi_per_row;
        const n = mi_per_row * fi_per_row;
        const b = Math.floor( i_row / n );
        const c = a + b * mi_per_row;
        const data_row = chunk_data.slice(i_row * fi_per_row, i_row * fi_per_row + fi_per_row);
        data[c] = data[c] == undefined ? [] : data[c];
        data[c].push(data_row);
        i_row += 1;
    }
    return data;
};

const chunk_collection = {
    width: 4,
    height: 4,
    data: to_data_chunks(chunk_data)
};

console.log(chunk_collection);


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
