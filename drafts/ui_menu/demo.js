import { Button, GlobalControl, Menu } from '../../lib/ui/ui.js';

class Example extends Phaser.Scene {

    create () {
    
        GlobalControl.setUp(this);
    
        const confMenu = Menu.createConf({
            //bgColor: '#00af00', fgColor: '#000000',
            colors: ['#00af00', '#000000', '#ffffff'],
            /*
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
            */
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
        //Menu.createCanvas(this, confMenu);
        const menu = new Menu(this, confMenu);
        

        
        this.registry.set('menu', menu);
    }
    
    update () {
        const menu = this.registry.get('menu');
        menu.draw();
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
