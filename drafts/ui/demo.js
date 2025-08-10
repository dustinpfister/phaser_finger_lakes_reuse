import { Button, Menu } from '../../lib/ui/ui.js';



class Example extends Phaser.Scene {

    preload () {
    
    }
    create () {
        const confMenu = Menu.createConf({
            bgColor: '#00af4a',
            members: [
                {
                    desc: 'foo', 
                    press: function(){
                        console.log('foo!');
                    }
                }
            ]
        });
        Menu.createCanvas(this, confMenu);
        const menu = new Menu(this, confMenu);
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
