
import { Boot } from './states/boot.js'
import { Load } from './states/load.js'
import { Reuse } from './states/reuse.js'

class Game extends Phaser.Scene {
    preload () {
        
        this.scene.add('Load', Load, false);
        this.scene.add('Reuse', Reuse, false);
        this.scene.add('Boot', Boot, true);
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

