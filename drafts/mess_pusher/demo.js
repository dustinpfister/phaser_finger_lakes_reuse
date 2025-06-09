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
            maxLines : 35,
            maxT: 10000
            //text: '0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ  !#$%&*\(\)-_;:\'\",.?\/\\\<\>\[\]'
        });
    
        this.mess = [
            'I want to buy a Mug!',
            'This is a nice Rug!',
            'Where are all the Spoons?',
            'I love this place!',
            'I want to get out of here.',
            'Hello how are you.',
            'Oh no I am out of money! Hahaha!',
            'About that beer I owe you.',
            'So, do you like EDM Music?',
            'I Woukd love to get a little place out in woods.',
            [
               '',
               'If I need more than one line then it',
               'Will have to be done like this',
               ''
            ]
        ];
        
        this.t = 0;
        this.nextT = 250;
               
    }
    
    
    
    update (time, delta) {
        log.once('this should only happen once');    
        log.condition( function(){  return time % 3000 > 2950 }, 'tick');    
        if(this.t >= this.nextT){  
            const text = this.mess[ Math.floor( this.mess.length * Math.random() ) ];
            if( typeof text === 'string' ){
                this.mp.pushLine(text);
            }
            if( typeof text === 'object' ){
                let i = 0, len = text.length;
                while(i < len){
                    this.mp.pushLine( i + '> ' + text[i]);
                    i += 1;
                }
            }
            this.t = 0;
            this.nextT = 50 + Math.round( 650 * Math.random() );
        }    
        this.t += delta;
        
        this.mp.update(delta);
            
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
