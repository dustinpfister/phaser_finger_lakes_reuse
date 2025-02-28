/*
import { Boot } from './states/boot.js'
import { Load } from './states/load.js'
import { World } from './states/world.js'

class Game extends Phaser.Scene {
    preload () {
        this.scene.add('Boot', Boot, false);
        this.scene.add('Load', Load, false);
        this.scene.add('World', World, false);
        this.scene.start('Boot');
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: '#afafaf',
    scene: Game,
    zoom: 1,
    render: { pixelArt: true, antialias: true },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x:0 }
        }
    }
};

const game = new Phaser.Game(config);
*/

class Guy extends Phaser.Physics.Arcade.Sprite {

    constructor (scene, x, y, texture, frame) {
    
        super(scene, x, y, texture, frame)
    
    }
}


class Load extends Phaser.Scene {

    preload () {
        this.load.setBaseURL('./');
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16_atlas.json');
    
        
    
    }

    create () {
        this.scene.start('World')
    
    }
    
}


class World extends Phaser.Scene {

    preload () {
        //this.load.setBaseURL('./');
        //this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16_atlas.json');
    }

    create () {
    
        this.physics.add.sprite(8,8,'people_16_16', 'pl_down');
        
        const guy = new Guy(this, 16, 32, 'people_16_16', 'pl_down');
        
        this.add.existing(guy);
        this.physics.add.existing(guy);
    
    }
    
}

class Game extends Phaser.Scene {
    preload () {
        this.scene.add('Load', Load, false);
        this.scene.add('World', World, false);
        this.scene.start('Load');
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: '#afafaf',
    scene: Game,
    zoom: 1,
    render: { pixelArt: true, antialias: true },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x:0 }
        }
    }
};

const game = new Phaser.Game(config);
