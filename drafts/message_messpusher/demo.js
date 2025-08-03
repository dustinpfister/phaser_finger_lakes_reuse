import { ConsoleLogger, MessPusher } from '../../lib/message/message.js';

const log = new ConsoleLogger({
    cat: 'demo',
    id: 'demo',
    appendId: true
});

class Example extends Phaser.Scene {

    preload () {
        this.load.bitmapFont('min', '../../fonts/min.png', '../../fonts/min.xml');
        this.load.bitmapFont('min_3px_5px', '../../fonts/min_3px_5px.png', '../../fonts/min_3px_5px.xml');
    }
    create () {
        log('Using ConsoleLogger for this demo.');
        
        this.mp = new MessPusher({
            key: 'min_3px_5px',
            sx: 32, sy:480 - 12 * 3,
            lineHeight: 6,
            capsOnly: true,
            scene: this,
            maxLines : 70,
            maxT: 40000
            //text: '0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ  !#$%&*\(\)-_;:\'\",.?\/\\\<\>\[\]'
        });
    
        this.mess = [
            ' ! @ # $ % ^ & * ( ) - _ + = { } [ ] : ; \" \' < > , . ? / \\ ~ \` ',
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
            'My Phone Number is 123-555-4567',
            'Why yes I am a Super Reuser! Need by Phone number it is 987-555-4321',
            'I like numbers such as 012345678 and 9',
            'A smaller font will of course also allow for me to have longer lines. In which case I will not have to break things down into arrays as much',
            [
               'foo',
               'If I need more than one line then it',
               'Will have to be done like this',
               'foo'
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
            this.mp.push(text, 'say');
            this.t = 0;
            this.nextT = 50 + Math.round( 1450 * Math.random() );
        }    
        this.t += delta;    
        this.mp.update(delta);
    }
    
}

const config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    parent: 'container_flr',
    canvas: document.querySelector('#canvas_flr'),
    scene: Example
};

const game = new Phaser.Game(config);
