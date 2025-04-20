import { BaseItem, Item, Container } from '../../lib/items.js';

class Example extends Phaser.Scene {

    preload () {
    
        this.load.atlas('donations_16_16', '../../sheets/donations_16_16.png', '../../sheets/donations_16_16_atlas.json');
        this.load.json('items_index', '../../items/items_index.json');
        this.load.json('household_1', '../../items/household_1.json');
        this.load.json('containers_1', '../../items/containers_1.json');
    
    }
    create () {
    
        const item = new Item(this, 'hh_mug_1');
        
        console.log(item);
    }
    update (time, delta) {
    }
    
}

const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 240,
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);
