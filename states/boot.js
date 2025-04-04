import { Load } from './load.js'
import { Reuse } from './reuse.js'
class Boot extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Boot';
    }

    create () {
    
        console.log('Boooting Finger Lakes Reuse! ');
        console.log();
    
        const game = this.game;
        const reg = game.registry;
        
        
        reg.set('MAX_DONATIONS', 7);
        
        
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
    
    
    
        
        this.scene.add('Reuse', Reuse, false);
        this.scene.add('Load', Load, false);
    
        this.scene.start('Load');
    }
        
}

export {
    Boot
}
