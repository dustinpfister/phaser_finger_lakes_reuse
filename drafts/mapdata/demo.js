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
          mapIndicesStart: 0, mapIndicesStop: 2
        });
    
    }
    create () {
    
        const player = this.player = new Person( this, 40, 40, 'people_16_16', 0 );
        this.registry.set('player', player);

        const mdc = new MapDataCollection(this, { player: player });
        //mdc.setActiveMapByIndex(this, 0);
        this.registry.set('mdc', mdc);
        
        //const md = mdc.getMapDataByIndex(1); 
        //console.log(md);
                
        

        
    }
    update (time, delta) {
    
        const player = this.registry.get('player');
        const mdc = this.registry.get('mdc');
        const scene = this;
        player.pathProcessorCurve(this, (scene, person)=>{
            const md = mdc.getActive();
            const pos = person.getTilePos();
            
            const door = md.doorCheck(pos.x, pos.y);
            if(door){
                console.log('oh look a door!');
                console.log(door)
                mdc.setActiveMapByIndex(scene, door.to.mapNum);
            }
            
            
        });
        
        this.cameras.main.setZoom( 2.0 ).centerOn( player.x, player.y );
            
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
