class Menu extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Menu';
    }
    
    startMapView () {
        console.log('starting mapview...');
        this.scene.start('Mapview');
    }
    
    create () {
        const scene = this;
        const logo = this.add.sprite(320, 240, 'menu_1');
        logo.setInteractive();
        logo.on('pointerdown', (pointer, px, py)=>{        
            scene.startMapView();
        });
        scene.input.keyboard.on('keydown', (event) => {
           scene.startMapView();
        });
        const disp1 = this.add.text(320, 400, '', { color: '#ffffff', fontSize: '30px' });
        disp1.setScrollFactor(0,0);
        disp1.depth = 6;
        disp1.text = 'R' + this.registry.get('R');
        disp1.x = 320 - disp1.width / 2;
    }

}

export { Menu }

