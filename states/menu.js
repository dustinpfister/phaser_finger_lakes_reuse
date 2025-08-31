import { ConsoleLogger } from '../lib/message/message.js';
import { GlobalControl, Menu } from '../lib/ui/ui.js';
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
        const logo = this.add.sprite(320, 130, 'menu_1');
        
        GlobalControl.setUp(this);
        
        const confMenu = Menu.createConf({
            x: 320, y: 280,
            textureKey: 'texture_menu_main',
            menu_key: 'menu_main',
            members: [
                {
                    desc: 'Start', 
                    press: function(){
                        scene.startMapView();
                    }
                }
            ]
        });
        const menu = new Menu(this, confMenu);
        
        const disp1 = this.add.text(320, 400, '', { color: '#ffffff', fontSize: '30px' });
        disp1.setScrollFactor(0,0);
        disp1.depth = 6;
        disp1.text = 'R' + this.registry.get('R');
        disp1.x = 320 - disp1.width / 2;
        
    }
    
    update () {
        const menu = this.registry.get('menu_main');
        menu.draw();
    }

}

export { MainMenu }

