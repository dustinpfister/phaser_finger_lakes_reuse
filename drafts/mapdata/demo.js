import { MapData, MapDataCollection, MapLoader } from '../../lib/mapdata.js';
import { Person, People } from '../../lib/people.js';

class Example extends Phaser.Scene {

    preload () {
    
        this.load.setBaseURL('../../'); 
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16.json');
        this.load.atlas('donations_16_16', 'sheets/donations_16_16.png', 'sheets/donations_16_16.json');
        this.load.json('items_index', '../../items/items_index.json');
        this.load.json('household_1', 'items/household_1.json');
        this.load.json('containers_1', 'items/containers_1.json');
        
        MapLoader({
          scene: this,
          urlBase: 'drafts/mapdata/',
          mapIndicesStart: 0, mapIndicesStop: 3
        });
    
    }
    create () {

        this.registry.set('MAX_MAP_DONATIONS', 50);
        this.registry.set('CUSTOMER_SPAWN_RATE', 3000);
    
        //const player = this.player = new Person( this, 40, 40, 'people_16_16', 0 );
        const player = this.player = new Person( this, {curveSpeed: 0.9, x: 40, y:40, texture: 'people_16_16', frame: 0} );
        this.registry.set('player', player);

        const mdc = new MapDataCollection(this, { player: player, startMapIndex: 1 });
        this.registry.set('mdc', mdc);
        
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
        const md = mdc.getActive();
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
            const md = mdc.getActive();
            const tile = md.map.getTileAt(cPos.x + dx, cPos.y + dy, false, 0);
            if(tile){
                if(md.canWalk(tile)){
                    player.setPath(this, md, cPos.x + dx, cPos.y + dy);
                }
            }   
        }
    }
    
    update (time, delta) {
        const player = this.registry.get('player');
        const mdc = this.registry.get('mdc');
        const map = mdc.getActive();
        const scene = this;
        this.cursorCheck('left');
        this.cursorCheck('right');
        this.cursorCheck('up');
        this.cursorCheck('down');
        player.pathProcessorCurve(this, (scene, person)=>{
        
            mdc.doorCheck(scene, person);
        
    
            person.setData('path', []);
            person.nCurve = 0;
        });
        
        player.update(this);
        this.cameras.main.setZoom( 2.0 ).centerOn( player.x, player.y ); 
        
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
