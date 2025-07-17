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
        const mdc = new MapDataCollection(this, { startMapIndex: 0 });
        this.registry.set('mdc', mdc);
    }
    update (time, delta) {
        const mdc = this.registry.get('mdc');
           mdc.forAllMaps(this, (scene, md, map_index)=>{     
            md.customer.update(this, md, delta);
            md.worker.update(this, md, delta);
            const bool = map_index === mdc.activeIndex;
            md.layer0.active = bool;
            md.layer0.visible = bool;
            md.donations.setVisible(bool);
            md.customer.setActive(bool);
            md.customer.setVisible(bool);
            md.customer.onHand.setActive(bool);
            md.customer.onHand.setVisible(bool);
            md.worker.setActive(bool);
            md.worker.setVisible(bool);
            md.worker.onHand.setActive(bool);
            md.worker.onHand.setVisible(bool);
        });
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
