import { MapData } from '../../lib/mapdata.js';
import { Person, People } from '../../lib/people.js';

class Example extends Phaser.Scene {

    preload () {
    
        this.load.setBaseURL('../../'); 
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16_atlas.json');
        
        
        
    
    }
    create () {
    
        const map0 = [
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
            
        ]
    
        const map = this.make.tilemap({ data: map0, layers:[], tileWidth: 16, tileHeight: 16 });
        this.registry.set('map', map);
        map.setCollisionByExclusion( [ 2 ], true, true, 0 );
        const tiles = map.addTilesetImage('map_16_16');
        const layer0 =  map.createLayer(0, tiles);
        
        
        const person = new Person( this, 40, 40, 'people_16_16', 0 );
        this.registry.set('person', person);
        
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.physics.add.collider( person, layer0 );
    
        
        this.cameras.main.setZoom( 2.0 ).centerOn( person.x, person.y );
        
        layer0.setInteractive();
        layer0.on('pointerdown', (pointer)=>{  
            const tx = Math.floor( pointer.worldX / 16 );
            const ty = Math.floor( pointer.worldY / 16 );
            const tile = map.getTileAt(tx, ty, false, 0);
            if(tile){
                const itemMode = person.getData('itemMode');
                if(tile.index != 1){
                    console.log(tile.index);
                }
                if(tile.index === 1 && itemMode != 2 ){    
                    person.setPath(this, map, tx, ty);
                }
                if(itemMode === 2 ){
                    //player.onHandAction(scene, null, tx, ty);
                }
            }
            
        });
        
    }
    update (time, delta) {
    
        const person = this.registry.get('person');
        const map = this.registry.get('map');
        person.pathProcessorCurve(this);
        //person.offTileCheck(map);
    
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
