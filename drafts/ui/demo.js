import { Button, Menu } from '../../lib/ui/ui.js';



class Example extends Phaser.Scene {

    preload () {
    
    }
    create () {
        const confMenu = Menu.createConf({
            bgColor: '#00af4a',
            draw: ( ctx, texture_buttons, confMenu, scene ) => {
                const fw = confMenu.frameWidth, fh = confMenu.frameHeight;
                confMenu.members.forEach( ( data_button, i ) => {
                    ctx.fillStyle = data_button.bgColor || confMenu.bgColor || '#2a2a2a';
                    ctx.fillRect( 0, fh * i, fw, fh);
                    ctx.fillStyle = data_button.fgColor || confMenu.fgColor || '#efefef';
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'center';
                    ctx.font = Math.floor( fh * 0.50 ) + 'px courier';
                    const sx = 60;
                    const x = sx + ( ( fw - sx ) * 0.95) * (i / confMenu.members.length),
                    y = fh * i + fh / 2;
                    ctx.fillText(data_button.desc, x, y);
                });
            },
            members: [
                {
                    desc: 'Foo', 
                    press: function(){
                        console.log('foo!');
                    }
                },
                {
                    desc: 'Bar', 
                    press: function(){
                        console.log('bar!');
                    }
                },
                {
                    desc: 'Baz', 
                    press: function(){
                        console.log('baz!');
                    }
                }
            ]
        });
        Menu.createCanvas(this, confMenu);
        const menu = new Menu(this, confMenu);
    }
    
}

const config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    parent: 'container_flr',
    canvas: document.querySelector('#canvas_flr'),
    scene: Example
};

const game = new Phaser.Game(config);
