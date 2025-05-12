class Menu extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Menu';
    }

    preload(){
        
    }
    
    create () {
        this.scene.start('Mapview');
    }

}

export { Menu }

