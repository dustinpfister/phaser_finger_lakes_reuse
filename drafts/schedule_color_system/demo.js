import { COLOR } from '../../lib/schedule.js';

class Example extends Phaser.Scene {

    create () { 
        const CELL_WIDTH = 120;
        const CELL_HEIGHT = 70;
        this.texture = this.textures.createCanvas('color_table', CELL_WIDTH * 5, CELL_HEIGHT * 6);
        const ctx = this.texture.context;
        ctx.textBaseline = 'top';
        ctx.font = '20px arial';
        COLOR.data.forEach((cd, i_cd)=>{
            const cc = COLOR.get_current_colors(cd.desc);
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
    type: Phaser.WEBGL,
    parent: 'container_flr',
    canvas: document.querySelector('#canvas_flr'),
    width: 640,
    height: 480,
    scene: Example
};

const game = new Phaser.Game(config);

