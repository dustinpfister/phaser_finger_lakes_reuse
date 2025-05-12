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
    }

}

export { Menu }

