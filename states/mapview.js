import { MapData, MapDataCollection, MapLoader } from '../lib/mapdata.js';
import { Person, People } from '../lib/people.js';

class Mapview extends Phaser.Scene {

    create () {
        const mdc = new MapDataCollection(this, { startMapIndex: 4 });
        this.registry.set('mdc', mdc);
        mdc.setActiveMapByIndex(this, mdc.activeIndex);  
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown', event => {
            const patt = /Digit\d+/;
            const m = event.code.match(patt);
            if(m){
                const d = Number(m[0].replace('Digit', ''));
                const player = this.registry.get('player'); 
                if(d >= 0 && d < 4){
                    player.setData('itemMode', d);
                }
            }
        });
        // set up workers   
        mdc.forAllMaps(this, function(scene, md, map_index){
           const worker = md.worker.spawnPerson(scene);
           if(mdc.activeIndex === map_index){            
               scene.registry.set('player', worker);
               worker.setToTilePos(md.hardMapData.spawnAt);       
           }
       });
    }
    
    cursorCheck (dir='left') {
        const mdc = this.registry.get('mdc');
        const md = mdc.getActive();
        const player = this.registry.get('player');
        const path = player.getData('path');
        if(path.length > 1 ){
            return;
        }
        const cPos = player.getTilePos();
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
        let player = this.registry.get('player');
        const mdc = this.registry.get('mdc');
        const scene = this;
        mdc.update(scene);
        if(player){
            this.cursorCheck('left');
            this.cursorCheck('right');
            this.cursorCheck('up');
            this.cursorCheck('down');
            player.pathProcessorCurve(this, (scene, person) => {
                mdc.doorCheck(scene, player);
                person.setData('path', []);
                person.nCurve = 0;
            });
            player.update(this);
            this.cameras.main.setZoom( 2.0 ).centerOn( player.x, player.y );       
            mdc.getActive().customer.update(this);
            mdc.getActive().worker.update(this);
        }
    }
    
}

export { Mapview }

