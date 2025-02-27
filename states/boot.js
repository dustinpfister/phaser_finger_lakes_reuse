class Boot extends Phaser.Scene {

    create () {
        console.log('Booting \'Phaser Start\'');
        this.scene.start('Load');
    }
        
}

export {
    Boot
}
