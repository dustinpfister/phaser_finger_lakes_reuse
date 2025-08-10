import { Button } from '../../lib/ui/ui.js';

const DATA = {
    bgColor: 'lime',
    frameWidth: 32, frameHeight: 16,
    members: [
        { bgColor: '#ff0000', desc: 'foo' },
        { bgColor: '#00ff00', desc: 'bar' },
        { bgColor: '#0000ff', desc: 'baz' },
        { bgColor: '#ff00ff', desc: '42' }
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
        
        const button = new Button(this, {
            x: 320, y: 150,
            texture: 'texture_buttons', frame: 1
        });
        
        this.add.existing(button);
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
