
const COLOR_DATA = [
    { i: 0, desc: 'lavender', web: '#ff00aa' },
    { i: 1, desc: 'green',    web: '#00ff00' },
    { i: 2, desc: 'red',      web: '#ff0000' },
    { i: 3, desc: 'orange',   web: '#ff8800' },
    { i: 4, desc: 'yellow',   web: '#ffff00' },
    { i: 5, desc: 'blue',     web: '#0000ff' }
];

const COLOR_KEYS = COLOR_DATA.map((obj, i)=>{ return i; });

const get_current_colors = ( print_index=0 ) => {

    if(typeof print_index === 'string'){
        const options = COLOR_DATA.filter((obj)=>{ return obj.desc === print_index.toLowerCase().trim(); });
        if(options.length >= 1){
            print_index = options[0].i;
        }
        if(options.length === 0){
            print_index = 0;
        }
    }

    const len = COLOR_KEYS.length;
    const pi = print_index % len;
    return {
        print: COLOR_DATA[ COLOR_KEYS[ pi ] ],
        d25: COLOR_DATA[ COLOR_KEYS[ ( pi + 2 ) % len ] ],
        d50: COLOR_DATA[ COLOR_KEYS[ ( pi + 3 ) % len ] ],
        d75: COLOR_DATA[ COLOR_KEYS[ ( pi + 4 ) % len ] ],
        cull: COLOR_DATA[ COLOR_KEYS[ ( pi + 5 ) % len ] ]
    };
};


class Example extends Phaser.Scene {

    create () {
    
        const CELL_WIDTH = 120;
        const CELL_HEIGHT = 70;

        this.texture = this.textures.createCanvas('color_table', CELL_WIDTH * 5, CELL_HEIGHT * 6);

        const ctx = this.texture.context;
        ctx.textBaseline = 'top';
        ctx.font = '20px arial';

        COLOR_DATA.forEach((cd, i_cd)=>{
            const cc = get_current_colors(cd.desc);
            Object.keys(cc).forEach((key, i_cc)=>{
                const obj = cc[key];
                ctx.fillStyle = obj.web;
                const x = CELL_WIDTH * i_cc;
                const y = CELL_HEIGHT * i_cd;
                ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                ctx.fillStyle = 'black';
                ctx.fillText(obj.desc, x + 5, y + 5);
                ctx.fillText('( ' + key + ' )', x + 5, y + 25);
            });
        });

        this.texture.refresh();
        
        this.add.image(CELL_WIDTH * 5 / 2 + 20, CELL_HEIGHT * 6 / 2 + 20, 'color_table');
    
    }
    
}

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);

