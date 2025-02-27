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

