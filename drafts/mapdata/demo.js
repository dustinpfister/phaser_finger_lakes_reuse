import { MapData } from '../../lib/mapdata.js';
import { Person, People } from '../../lib/people.js';

class Example extends Phaser.Scene {

    preload () {
    
        this.load.setBaseURL('../../'); 
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16_atlas.json');
        
        let i_map = 1;
        this.load.json('map' + i_map + '_data', 'drafts/mapdata/map' + i_map + '_data.json');
        this.load.tilemapCSV('map' + i_map, '/drafts/mapdata/map' + i_map + '.csv');
        
        
    
    }
    create () {
    
        //const mapDataRaw = this.cache.tilemap.get('map1').data;
        //const mapData = mapDataRaw.trim().replace(/\n/g, ':').split(':').map((el)=>{ return el.split(',')});
        //const map = this.make.tilemap({ data: mapData, layers:[], tileWidth: 16, tileHeight: 16 });      

        //const map = this.make.tilemap({ key: 'map1', layers:[], tileWidth: 16, tileHeight: 16 });

        const player = this.player = new Person( this, 40, 40, 'people_16_16', 0 );
        this.registry.set('player', player);


        const mapData = new MapData(this, 1, {})
        const map = mapData.map;
        const layer0 = mapData.layer0;
        
        this.registry.set('map', map);
        map.setCollisionByExclusion( [ 2 ], true, true, 0 );
        //const tiles = map.addTilesetImage('map_16_16');
        //const layer0 =  map.createLayer(0, tiles);
        
        

        
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.physics.add.collider( player, layer0 );
    
        
        this.cameras.main.setZoom( 2.0 ).centerOn( player.x, player.y );
        
        layer0.setInteractive();
        layer0.on('pointerdown', (pointer)=>{  
            const tx = Math.floor( pointer.worldX / 16 );
            const ty = Math.floor( pointer.worldY / 16 );
            const tile = map.getTileAt(tx, ty, false, 0);
            if(tile){
                const itemMode = player.getData('itemMode');
                if(tile.index != 1){
                    console.log(tile.index);
                }
                if(tile.index === 1 && itemMode != 2 ){    
                    player.setPath(this, map, tx, ty);
                }
                if(itemMode === 2 ){
                    //player.onHandAction(scene, null, tx, ty);
                }
            }
            
        });
        
    }
    update (time, delta) {
    
        const player = this.registry.get('player');
        const map = this.registry.get('map');
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
