import { COLOR, GameTime } from '../../lib/schedule.js';

class Example extends Phaser.Scene {

    create () {
    
        const gt = new GameTime({
            year: 2024,
            month: 4, day: 6, hour: 10, minute: 5, second: 30, ms: 500
        });
        
        console.log( gt)
    
        
    }
    
}

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);

