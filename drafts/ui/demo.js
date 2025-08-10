import { Button, Menu } from '../../lib/ui/ui.js';

/*
const confMenu = {
    x: 320, y: 200,
    bgColor: 'lime',
    textureKey: 'texture_buttons',
    frameWidth: 256, frameHeight: 32,
    menu_spacing: 5,
    members: [
        { 
            desc: 'foo',
            bgColor: '#ff0000', 
            press : function () {
                console.log('this is the foo button!');
            }
        },
        { 
            desc: 'bar',
            bgColor: '#00ff00', 
            press : function () {
                console.log('this is the bar button!');
            }
        },
        { 
            desc: 'baz',
            bgColor: '#0000ff', 
            press : function () {
                console.log('this is the baz button!');
            }
        }
    ]
};
*/

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

const create_canvas = ( scene, confMenu ) => {
    const fw = confMenu.frameWidth, fh = confMenu.frameHeight;
    const w = fw, h = fh * confMenu.members.length;
    const texture_buttons = scene.textures.createCanvas(confMenu.textureKey, w, h);
    const canvas = texture_buttons.canvas;
    const ctx = texture_buttons.context;
    confMenu.members.forEach( ( data_button, i ) => {
        ctx.fillStyle = data_button.bgColor || confMenu.bgColor || '#2a2a2a';
        ctx.fillRect( 0, fh * i, fw, fh);
    });
    texture_buttons.refresh();
    return texture_buttons;
};

class Example extends Phaser.Scene {

    preload () {
    
    }
    create () {
    
    

        const texture_buttons = create_canvas(this, confMenu);
        this.textures.addSpriteSheet('sheet_buttons', texture_buttons, confMenu);
        
        const menu = new Menu(this, confMenu);
        
        /*
        const scene = this;
        confMenu.members.forEach( (data_button, bi) => {
            const button = new Button(this, {
                x: confMenu.x, 
                y: confMenu.y + confMenu.frameHeight * bi + confMenu.menu_spacing * bi,
                texture: confMenu.textureKey, frame: bi,
                press : data_button.press
            });
            scene.add.existing(button);
        });
        */
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
