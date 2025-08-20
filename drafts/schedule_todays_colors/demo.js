import { COLOR, GameTime } from '../../lib/schedule/schedule.js';


const CELL_WIDTH = 75;
const CELL_HEIGHT = 50;
const PADDING = 5;
const POS = { x: 225, y: 50 };
const FONT_SIZE = 12;

window.COLOR = COLOR;

class Example extends Phaser.Scene {

    create () { 
        this.gt = new GameTime({real: true, scene: this });
        const w = CELL_WIDTH * 5 + PADDING * 2;
        const h = CELL_HEIGHT * 6 + PADDING * 2;
        this.texture_ct = this.textures.createCanvas('color_table', w, h);
        const x = CELL_WIDTH * 5 / 2 + POS.x;
        const y = CELL_HEIGHT * 6 / 2 + POS.y;
        this.img_ct = this.add.image(x, y, 'color_table');
        this.draw_ct();
    }
    
    draw_ct () {
        const i_print = this.gt.print_index;
        const ctx = this.texture_ct.context;
        ctx.textBaseline = 'top';
        ctx.font = FONT_SIZE + 'px arial';
        COLOR.data.forEach((cd, i_cd)=>{
            const cc = COLOR.get_current_colors(cd.desc);
            const y = CELL_HEIGHT * i_cd;
            Object.keys(cc).forEach((key, i_cc )=>{
                const obj = cc[key];
                ctx.fillStyle = obj.web;
                ctx.globalAlpha = i_print === i_cd ? 1.0 : 0.25;
                const x = PADDING + CELL_WIDTH * i_cc;
                ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                ctx.fillStyle = 'black';
                ctx.fillText(obj.desc, x + PADDING, y + PADDING);
                ctx.fillText('( ' + key + ' )', x + PADDING, y + PADDING + FONT_SIZE);       
            });
        });
        const x = PADDING, y = CELL_HEIGHT * i_print;
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        ctx.strokeRect(x, y, CELL_WIDTH * 5, CELL_HEIGHT);      
        this.texture_ct.refresh();
    }
    
}

const config = {
    type: Phaser.WEBGL,
    parent: 'container_flr',
    canvas: document.querySelector('#canvas_flr'),
    width: 640,
    height: 480,
    scene: Example
};

const game = new Phaser.Game(config);

