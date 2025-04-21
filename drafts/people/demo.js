import { Person, People } from '../../lib/people.js';

class Example extends Phaser.Scene {

    preload () {
    
        this.load.setBaseURL('../../'); 
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16_atlas.json');
    
    }
    create () {
    
        const person = new Person(this, 0, 0, 'people_16_16', 0);
        
    }
    update (time, delta) {
    }
    
}

const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 240,
    parent: 'phaser-example',
    scene: Example,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x:0 }
        }
    }
};

const game = new Phaser.Game(config);
