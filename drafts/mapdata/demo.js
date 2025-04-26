import { MapData, MapDataCollection, MapLoader } from '../../lib/mapdata.js';
import { Person, People } from '../../lib/people.js';

class Example extends Phaser.Scene {

    preload () {
    
        this.load.setBaseURL('../../'); 
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16_atlas.json');
        this.load.atlas('donations_16_16', '../../sheets/donations_16_16.png', '../../sheets/donations_16_16_atlas.json');
        this.load.json('items_index', '../../items/items_index.json');
        this.load.json('household_1', 'items/household_1.json');
        this.load.json('containers_1', 'items/containers_1.json');
        
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
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.input.keyboard.on('keydown', event => {
            const patt = /Digit\d+/;
            const m = event.code.match(patt);
            if(m){
                const d = Number(m[0].replace('Digit', ''));
                if(d >= 0 && d < 4){
                    console.log('set item mode for player to mode ' + d);
                    this.player.setData('itemMode', d);
                }
            }
        });
        
        
    }
    
    cursorCheck (dir='left') {
        const mdc = this.registry.get('mdc');
        const player = this.registry.get('player');
        const path = this.player.getData('path');
        if(path.length > 1 ){
            return;
        }
        const cPos = this.player.getTilePos();
        let dx = 0, dy = 0;
        if(dir === 'left'){  dx = -1; }
        if(dir === 'right'){  dx = 1; }
        if(dir === 'up'){  dy = -1; }
        if(dir === 'down'){  dy = 1; }
        if (this.cursors[dir].isDown) {
            //this.player.setData('idleTime', 0);
            const md = mdc.getActive();
            const tile = md.map.getTileAt(cPos.x + dx, cPos.y + dy, false, 0);
            if(tile){
                if(tile.index === 1){
                    //path.push( {x: cPos.x + dx, y: cPos.y + dy  } );
                    //this.player.setData('path', path);
                    player.setPath(this, md.map, cPos.x + dx, cPos.y + dy);
                }
            }   
        }
    }
    
    update (time, delta) {
        const player = this.registry.get('player');
        const mdc = this.registry.get('mdc');
        const scene = this;
        this.cursorCheck('left');
        this.cursorCheck('right');
        this.cursorCheck('up');
        this.cursorCheck('down');
        player.pathProcessorCurve(this, (scene, person)=>{
            const md = mdc.getActive();
            const pos = person.getTilePos();
            const door = md.doorCheck(pos.x, pos.y);
            if(door){
                const nmd = mdc.getMapDataByIndex(door.to.mapNum);
                mdc.setActiveMapByIndex(scene, door.to.mapNum);
                const pos = nmd.hardMapData.doors[0].position;
                player.x = pos.x * 16 + 8;
                player.y = pos.y * 16 + 8;
            }
            person.setData('path', []);
            person.nCurve = 0;
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
