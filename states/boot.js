import { Load } from './load.js';
import { Mapview } from './mapview.js';
import { Menu } from './menu.js';

class Boot extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Boot';
    }

    create () {
        const game = this.game;
        const reg = game.registry;
        reg.set('R', 1);
        reg.set('MAX_MAP_DONATIONS', 20);
        reg.set('gameSave', {
            money: 1000
        });
        console.log('Boooting Finger Lakes Reuse R' + reg.get('R'));
        game.events.on('step', () => {
            const scenes = game.scene.getScenes(true, false) || [] ;
            const scene = scenes[0];
            if(scene){
                // can work with current scene and main game object here
                // That is that if there is any data that you want to update
                // on each game tick, regardless of what the current scene
                // object is
                // reg.set('foo', 'bar')
                // reg.get('foo')
            }
        }, game);
        this.scene.add('Menu', Menu, false);
        this.scene.add('Mapview', Mapview, false);
        this.scene.add('Load', Load, false);
        this.scene.start('Load');
    }
        
}

export { Boot }

