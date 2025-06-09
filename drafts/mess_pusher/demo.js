import { ConsoleLogger } from '../../lib/message.js';

const log = new ConsoleLogger({
    cat: 'demo',
    id: 'demo',
    appendId: true
});

class Example extends Phaser.Scene {

    preload () {
    }
    create () {
        log('Using ConsoleLogger for this demo.');
    }
    update (time, delta) {
        log.once('this should only happen once');    
        log.condition( function(){  return time % 3000 > 2950 }, 'tick')
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
