import { ConsoleLogger } from '../lib/message/message.js';
import { GlobalControl, Menu } from '../lib/ui/ui.js';
import { PeopleData } from '../lib/people/people.js';
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
        
        const pd = PeopleData.createNew( [
            this.cache.json.get('people_core')
        ]);
        
        const switchPersonKey = PeopleData.switchPersonKey;     
        switchPersonKey(pd, 'cp_unique_1_0', 'none', 'worker');
        switchPersonKey(pd, 'cp_clone_2_2', 'none', 'customer');
        switchPersonKey(pd, 'cp_clone_1_0', 'none', 'customer');
        switchPersonKey(pd, 'cp_clone_1_1', 'none', 'customer');
        switchPersonKey(pd, 'cp_clone_1_2', 'none', 'customer');
        switchPersonKey(pd, 'cp_clone_1_3', 'none', 'customer');    
        
        this.registry.set('gameSave', {
            money: 0,
            pd : pd
        });
        
        this.scene.start('ViewPopulation');
        
        //this.scene.start('ViewMap');
        
    }
    
    create () {
        const scene = this;
        const game = scene.game;
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
        
        game.events.on('step', function() {
            const scenes = game.scene.getScenes(true, false) || [] ;
            const scene_current = scenes[0];
            if(scene_current){
                // can work with current scene and main game object here. This should always 
                // fire on each game tick, regardless of what the current state is
            }
        }, scene);
        
        
        
    }
    
    update () {
        const menu = this.registry.get('menu_main');
        menu.draw();
    }

}

export { MainMenu }

