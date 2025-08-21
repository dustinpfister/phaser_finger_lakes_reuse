import { BaseItem, Item, Container } from '../../lib/items/items.js';

class Example extends Phaser.Scene {

    preload () {
    
        this.load.atlas('donations_16_16', '../../sheets/donations_16_16.png', '../../sheets/donations_16_16.json');
        this.load.json('items_index', '../../items/items_index.json');
        this.load.json('household_1', '../../items/household_1.json');
        this.load.json('containers_1', '../../items/containers_1.json');
    
    }
    create () {
    
        const item = new Item(this, 'hh_mug_1', {}, 32 * 1, 32);     
        this.add.existing(item);
        
        const container = new Container(this, 'blue_bin', {}, 32 * 5, 32);     
        this.add.existing(container);
        
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
