
class Button extends Phaser.GameObjects.Sprite {
    constructor (scene, opt= {} ) {
        opt = Object.assign( {}, { x: 0, y: 0, texture: '', frame: 0}, opt );
        super( scene, opt.x, opt.y, opt.texture, opt.frame );
        this.setInteractive();
    
        this.on('pointerdown', () => { 
        
            console.log('it is a start.');
        
        });
    }
};

export { Button };
