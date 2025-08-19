import { COLOR, GameTime } from '../../lib/schedule/schedule.js';


const CELL_WIDTH = 60;
const CELL_HEIGHT = 35;
const PADDING = 5;
const POS = { x: 100, y: 100 };
const FONT_SIZE = 12;

class Example extends Phaser.Scene {

    create () { 
    
        this.gt = new GameTime({real: true, scene: this });
        
    
    console.log(this.gt);
    
        this.texture = this.textures.createCanvas('color_table', CELL_WIDTH * 5, CELL_HEIGHT * 6);
        this.draw();
        const x = CELL_WIDTH * 5 / 2 + POS.x;
        const y = CELL_HEIGHT * 6 / 2 + POS.y;
        this.add.image(x, y, 'color_table');
    }
    
    draw () {

      const ctx = this.texture.context;
        ctx.textBaseline = 'top';
        ctx.font = FONT_SIZE + 'px arial';
  

        COLOR.data.forEach((cd, i_cd)=>{
            const cc = COLOR.get_current_colors(cd.desc);
            Object.keys(cc).forEach((key, i_cc)=>{
                const obj = cc[key];
                ctx.fillStyle = obj.web;
                const x = CELL_WIDTH * i_cc;
                const y = CELL_HEIGHT * i_cd;
                ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                ctx.fillStyle = 'black';
                ctx.fillText(obj.desc, x + PADDING, y + PADDING);
                ctx.fillText('( ' + key + ' )', x + PADDING, y + PADDING + FONT_SIZE);
            });
        });
        this.texture.refresh();
    
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

