import { Load } from './load.js'
import { Reuse } from './reuse.js'
class Boot extends Phaser.Scene {

    create () {
    
        console.log('Boooting Finger Lakes Reuse! ');
        console.log();
    
        const game = this.game;
        
        
        
            
        
        game.events.on('step', () => {
        
            const scene = game.scene.getScenes(true, false)[0] || {} ;
            
            
            //console.log( scene );
            
        
        }, game);
    
    
    
        this.scene.add('Load', Load, false);
        this.scene.add('Reuse', Reuse, false);
    
        this.scene.start('Load');
    }
        
}

export {
    Boot
}
