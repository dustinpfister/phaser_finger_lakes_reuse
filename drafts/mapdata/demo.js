import { MapData, MapDataCollection, MapLoader } from '../../lib/mapdata/mapdata.js';
import { Person, People } from '../../lib/people/people.js';
import { ItemTools } from '../../lib/items/items.js';

class Example extends Phaser.Scene {
    preload () {
        this.load.setBaseURL('../../'); 
        this.load.image('map_16_16', 'json/sheets/map_16_16.png');
        this.load.atlas('people_16_16', 'json/sheets/people_16_16.png', 'json/sheets/people_16_16.json');
        this.load.atlas('donations_16_16', 'json/sheets/donations_16_16.png', 'json/sheets/donations_16_16.json');
        //this.load.json('items_index', '../../json/items/items_index.json');
        this.load.json('household_1', 'json/items/household_1.json');
        this.load.json('containers_1', 'json/items/containers_1.json');
        MapLoader({
          scene: this,
          urlBase: 'drafts/mapdata/',
          mapIndicesStart: 0, mapIndicesStop: 3
        });
    }
    create () {
        this.registry.set('MAX_MAP_DONATIONS', 50);
        this.registry.set('CUSTOMER_SPAWN_RATE', 3000);
        
        ItemTools.genIndex(this, ['containers_1', 'household_1']);
        
        const mdc = new MapDataCollection(this, { startMapIndex: 0 });
        //const player = this.registry.get('player', mdc); 
        this.registry.set('mdc', mdc);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown', event => {
            const patt = /Digit\d+/;
            const m = event.code.match(patt);
            if(m){
                const d = Number(m[0].replace('Digit', ''));
                if(d >= 0 && d < 4){
                    player.setData('itemMode', d);
                }
            }
        });    
    }
    
    
    update (time, delta) {
        const mdc = this.registry.get('mdc');
        const map = mdc.getActive();
        const scene = this;
        mdc.update(time, delta);
    }
    
}

const config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    parent: 'container_flr',
    canvas: document.querySelector('#canvas_flr'),
    scene: Example,
    render: { pixelArt: true  },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x:0 }
        }
    }
};

const game = new Phaser.Game(config);
