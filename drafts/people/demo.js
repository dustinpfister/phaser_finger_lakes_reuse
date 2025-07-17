import { Person, People } from '../../lib/people.js';
import { MapData, MapDataCollection, MapLoader } from '../../lib/mapdata.js';

class Example extends Phaser.Scene {

    preload () {
    
        this.load.setBaseURL('../../');
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16.json');
        
        MapLoader({
          scene: this,
          urlBase: 'drafts/people/',
          mapIndicesStart: 0, mapIndicesStop: 1
        });
        
    
    }
    create () {
        const scene = this;
        const mdc = new MapDataCollection(scene, { startMapIndex: 0 });
        scene.registry.set('mdc', mdc);
    }
    update (time, delta) {
        const mdc = this.registry.get('mdc');
        mdc.update(time, delta);
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
