
class Example extends Phaser.Scene {

    preload () {
    
    }
    create () {
    
    }
    update (time, delta) {
    }
    
}

const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 240,
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);
