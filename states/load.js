import { MapLoader } from '../lib/mapdata/mapdata.js';
import { ConsoleLogger } from '../lib/message/message.js';
import { ItemTools } from '../lib/items/items.js';
const log = new ConsoleLogger({
    cat: 'state',
    id: 'load',
    appendId: true
});

const ITEM_FILES = ['containers_1', 'household_1'];

class Load extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Load';
    }

    preload(){
        const scene =  this;
    
        this.load.setBaseURL('./');
        // SHEETS               
        this.load.image('map_16_16', 'json/sheets/map_16_16.png');
        this.load.atlas('menu_1', 'json/sheets/menu_1.png', 'json/sheets/menu_1.json');
        this.load.atlas('people_16_16', 'json/sheets/people_16_16.png', 'json/sheets/people_16_16.json');
        this.load.atlas('donations_16_16', 'json/sheets/donations_16_16.png', 'json/sheets/donations_16_16.json');
        this.load.atlas('timebar', 'json/sheets/timebar.png', 'json/sheets/timebar.json');
        // FONTS
        this.load.bitmapFont('min', 'fonts/min.png', 'fonts/min.xml');
        this.load.bitmapFont('min_3px_5px', 'fonts/min_3px_5px.png', 'fonts/min_3px_5px.xml');
        // MAP DATA
        MapLoader({
          scene: this,
          urlBase: 'json/maps/', //'drafts/mapdata/',
          mapIndicesStart: 1, mapIndicesStop: 5
        });
        // PEOPLE
        this.load.json('people_core', 'json/people/people_core.json');
        // ITEM DATA
        //this.load.json('items_index', 'json/items/items_index.json');
        
        ITEM_FILES.forEach( (fn) => {
            scene.load.json(fn, 'json/items/' + fn + '.json');
        });
        
        //this.load.json('household_1', 'json/items/household_1.json');
        //this.load.json('containers_1', 'json/items/containers_1.json');
        
        const gr = this.add.graphics();
        gr.fillStyle(0x000000);
        gr.fillRect(0,0,640,480);           
        this.load.on(Phaser.Loader.Events.PROGRESS, (progress) => {
            //log( (progress * 100).toFixed(2) + '%' ); 
            gr.lineStyle(20, 0xffffff, 1);
            gr.beginPath();
            gr.arc(320, 240, 100, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(270 + 360 * progress), false);
            gr.strokePath();
        });
    }
    
    create () {
    
    
        ItemTools.genIndex(this, ['containers_1', 'household_1']);
    
        this.scene.start('MainMenu');
    }

}

export {
    Load
}

