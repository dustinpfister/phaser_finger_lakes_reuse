import { Button } from '../../lib/ui/ui.js';

class Example extends Phaser.Scene {

    preload () {
    
    }
    create () {
    
        const button = new Button(this, {
            x: 32, y: 32
        });
        this.add.existing(button);
        
        console.log(button);
        
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
