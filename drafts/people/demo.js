import { ACTIONS_DEFAULT } from "../../lib/people/action.js";
import { Person, People } from '../../lib/people/people.js';
import { MapData, MapDataCollection, MapLoader } from '../../lib/mapdata/mapdata.js';

class Example extends Phaser.Scene {

    preload () {
    
        this.load.setBaseURL('../../');
        
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16.json');
        this.load.atlas('donations_16_16', 'sheets/donations_16_16.png', 'sheets/donations_16_16.json');
        
        // ITEM DATA
        this.load.json('items_index', 'items/items_index.json');
        this.load.json('household_1', 'items/household_1.json');
        this.load.json('containers_1', 'items/containers_1.json');     
        
        MapLoader({
          scene: this,
          urlBase: 'drafts/people/',
          mapIndicesStart: 0, mapIndicesStop: 1
        });  
    
    }
    create () {
        const scene = this;
        this.registry.set('ACTIONS', ACTIONS_DEFAULT);
        
        const mdc = new MapDataCollection( scene, { startMapIndex: 0 } );
        scene.registry.set('mdc', mdc);
    }
    update (time, delta) {
        const mdc = this.registry.get('mdc');
        mdc.update(time, delta);
    }
    
}

const config = {
    width: 640,
    height: 480,
    type: Phaser.WEBGL,
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
