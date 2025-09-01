import { BaseItem, Item, Container, ItemTools } from '../../lib/items/items.js';

class Example extends Phaser.Scene {

    preload () {
    
        this.load.atlas('donations_16_16', '../../json/sheets/donations_16_16.png', '../../json/sheets/donations_16_16.json');
        //this.load.json('items_index', '../../json/items/items_index.json');
        this.load.json('household_1', '../../json/items/household_1.json');
        this.load.json('containers_1', '../../json/items/containers_1.json');
    
    }
    create () {
    
        ItemTools.genIndex(this, ['containers_1', 'household_1']);
    
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
