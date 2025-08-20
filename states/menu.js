import { ConsoleLogger } from '../lib/message/message.js';
import { Button, Menu } from '../../lib/ui/ui.js';
const log = new ConsoleLogger({
    cat: 'state',
    id: 'menu',
    appendId: true
});
class MainMenu extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Menu';
    }
    
    startMapView () {
        log('starting mapview...');
        this.scene.start('Mapview');
    }
    
    create () {
        const scene = this;
        const logo = this.add.sprite(320, 240, 'menu_1');
        /*
        logo.setInteractive();
        logo.on('pointerdown', (pointer, px, py)=>{
              
            //scene.startMapView();
        });
        scene.input.keyboard.on('keydown', (event) => {
           
           //scene.startMapView();
        });
        */
        
        
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
                    desc: 'Start', 
                    press: function(){
                        console.log('start!');
                        scene.startMapView();
                    }
                }
            ]
        });
        Menu.createCanvas(this, confMenu);
        const menu = new Menu(this, confMenu);
        
        
        const disp1 = this.add.text(320, 400, '', { color: '#ffffff', fontSize: '30px' });
        disp1.setScrollFactor(0,0);
        disp1.depth = 6;
        disp1.text = 'R' + this.registry.get('R');
        disp1.x = 320 - disp1.width / 2;
    }

}

export { MainMenu }

