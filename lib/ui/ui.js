
class Button extends Phaser.GameObjects.Sprite {
    constructor (scene, opt= {} ) {
        opt = Object.assign( {}, { x: 0, y: 0, texture: '', frame: 0}, opt );
        super( scene, opt.x, opt.y, opt.texture, opt.frame );
        const button = this;
        button.setInteractive();
        button.press = opt.press || this.press;
        
        button.selected = false;
        
        
        button.on('pointerdown', (e) => {
            button.press();
        });
    }
    
    press () {
        console.log('default button press');
    }
};

export { Button };
