class Menu extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Menu';
    }

    preload(){
        
    }
    
    create () {
    
        const logo = this.add.sprite(320, 240, 'menu_1');
    
    
        //this.scene.start('Mapview');
    }

}

export { Menu }

