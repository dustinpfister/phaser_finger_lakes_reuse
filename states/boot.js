import { Load } from './load.js';
import { Mapview } from './mapview.js';
import { Menu } from './menu.js';
import { ConsoleLogger } from '../lib/message.js';

const log = new ConsoleLogger({
    cat: 'state',
    id: 'boot',
    appendId: true
});

class Boot extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Boot';
    }

    create () {
        const game = this.game;
        const reg = game.registry;
        reg.set('R', 6);
        reg.set('MAX_MAP_DONATIONS', 20);
        reg.set('PEOPLE_SPAWN_RATE', { min: 500, delta: 1000 });   
        reg.set('CUSTOMER_MAX_SPAWN_PER_MAP', 10);
        reg.set('CUSTOMER_SPAWN_RATE', { min: 500, delta: 1000 });  // just used as a default, people.spawnStack objects set rate otherwises
        reg.set('gameSave', {
            money: 0
        });
        log( 'Boooting Finger Lakes Reuse R' + reg.get('R') );
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

