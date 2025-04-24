import { MapData, MapDataCollection, MapLoader } from '../../lib/mapdata.js';
import { Person, People } from '../../lib/people.js';

class Example extends Phaser.Scene {

    preload () {
    
        this.load.setBaseURL('../../'); 
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16_atlas.json');
        
        MapLoader({
          scene: this,
          urlBase: 'drafts/mapdata/',
          mapIndicesStart: 1, mapIndicesStop: 2
        });
    
    }
    create () {
    
        const player = this.player = new Person( this, 40, 40, 'people_16_16', 0 );
        this.registry.set('player', player);

        const mdc = new MapDataCollection(this, { player: player });

        //const mapData = new MapData(this, 1, {})
        const map = mdc.mapData['map1'].map;
        const layer0 = mdc.mapData['map1'].layer0;
                
        this.cameras.main.setZoom( 2.0 ).centerOn( player.x, player.y );

        
    }
    update (time, delta) {
    
        const player = this.registry.get('player');
        //const map = this.registry.get('map');
        player.pathProcessorCurve(this);
        //player.offTileCheck(map);
    
    }
    
}

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    parent: 'phaser-example',
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
