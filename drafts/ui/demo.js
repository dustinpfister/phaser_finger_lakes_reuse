import { Button } from '../../lib/ui/ui.js';

const DATA = {
    x: 320, y: 200,
    bgColor: 'lime',
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

const create_canvas = ( scene, data = DATA ) => {

    const fw = data.frameWidth, fh = data.frameHeight;
    const w = fw, h = fh * data.members.length;
    const texture_buttons = scene.textures.createCanvas('texture_buttons', w, h);
    const canvas = texture_buttons.canvas;
    const ctx = texture_buttons.context;
    
    data.members.forEach( ( data_button, i ) => {
        ctx.fillStyle = data_button.bgColor || data.bgColor || '#2a2a2a';
        ctx.fillRect( 0, fh * i, fw, fh);
    });
    
    texture_buttons.refresh();
    return texture_buttons;
    
};

class Example extends Phaser.Scene {

    preload () {
    
    }
    create () {
    
    

        const texture_buttons = create_canvas(this, DATA);
        

        
        this.textures.addSpriteSheet('sheet_buttons', texture_buttons, DATA);
        
        
        const scene = this;
        
        DATA.members.forEach( (data_button, bi) => {
            const button = new Button(this, {
                x: DATA.x, 
                y: DATA.y + DATA.frameHeight * bi + DATA.menu_spacing * bi,
                texture: 'texture_buttons', frame: bi,
                press : data_button.press
            });
            scene.add.existing(button);
        });
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
