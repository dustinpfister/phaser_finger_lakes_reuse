import { MapLoader } from '../lib/mapdata.js';
import { ConsoleLogger } from '../lib/message/message.js';
const log = new ConsoleLogger({
    cat: 'state',
    id: 'load',
    appendId: true
});

class Load extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Load';
    }

    preload(){
        this.load.setBaseURL('./');
        // SHEETS               
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        this.load.atlas('menu_1', 'sheets/menu_1.png', 'sheets/menu_1.json');
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16.json');
        this.load.atlas('donations_16_16', 'sheets/donations_16_16.png', 'sheets/donations_16_16.json');
        this.load.atlas('timebar', 'sheets/timebar.png', 'sheets/timebar.json');
        // FONTS
        this.load.bitmapFont('min', 'fonts/min.png', 'fonts/min.xml');
        this.load.bitmapFont('min_3px_5px', 'fonts/min_3px_5px.png', 'fonts/min_3px_5px.xml');
        // MAP DATA
        MapLoader({
          scene: this,
          urlBase: 'maps/', //'drafts/mapdata/',
          mapIndicesStart: 1, mapIndicesStop: 5
        });
        // ITEM DATA
        this.load.json('items_index', 'items/items_index.json');
        this.load.json('household_1', 'items/household_1.json');
        this.load.json('containers_1', 'items/containers_1.json');
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
        //log('preload of load state started...');
    }
    
    create () {
        this.scene.start('Menu');
    }

}

export {
    Load
}

