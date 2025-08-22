import { GlobalControl, Menu } from '../../lib/ui/ui.js';

class Example extends Phaser.Scene {

    create () {
    
        GlobalControl.setUp(this);
    
        const confMenu = Menu.createConf({
            lineWidth: 3, colors: ['#00af00', '#000000', '#ffffff'],
            members: [
                {
                    desc: 'Foo', 
                    press: function(){
                        console.log('foo!');
                    }
                },
                {
                    desc: 'Bar', 
                    press: function(){
                        console.log('bar!');
                    }
                },
                {
                    desc: 'Baz', 
                    press: function(){
                        console.log('baz!');
                    }
                }
            ]
        });
        //Menu.createCanvas(this, confMenu);
        const menu = new Menu(this, confMenu);
        

        
        this.registry.set('menu', menu);
    }
    
    update () {
        const menu = this.registry.get('menu');
        menu.draw();
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
