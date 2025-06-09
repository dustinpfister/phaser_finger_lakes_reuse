import { ConsoleLogger, MessPusher } from '../../lib/message.js';

const log = new ConsoleLogger({
    cat: 'demo',
    id: 'demo',
    appendId: true
});

class Example extends Phaser.Scene {

    preload () {
        this.load.bitmapFont('min', '../../fonts/min.png', '../../fonts/min.xml');
    }
    create () {
        log('Using ConsoleLogger for this demo.');
        
        this.mp = new MessPusher({
            key: 'min',
            scene: this,
            maxLines : 10
            //text: '0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ  !#$%&*\(\)-_;:\'\",.?\/\\\<\>\[\]'
        });
    
        this.mess = [
            'I want to buy a Mug!',
            'This is a nice Rug!',
            'Where are all the Spoons?',
            'I love this place!',
            'I want to get out of here',
            'Hello how are you.',
            'Oh no I am out of money! Hahaha!'
        ];
        
        this.t = 0;
        this.nextT = 250;
               
    }
    
    
    
    update (time, delta) {
        log.once('this should only happen once');    
        log.condition( function(){  return time % 3000 > 2950 }, 'tick');    
        if(this.t >= this.nextT){  
            const text = this.mess[ Math.floor( this.mess.length * Math.random() ) ];
            this.mp.pushLine(text);
            this.t = 0;
            this.nextT = 250 + Math.round( 1750 * Math.random() );
        }    
        this.t += delta;    
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
