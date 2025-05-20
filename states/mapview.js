import { MapData, MapDataCollection, MapLoader } from '../lib/mapdata.js';
import { Person, People } from '../lib/people.js';

class Mapview extends Phaser.Scene {

    create () {
        const mdc = new MapDataCollection(this, { startMapIndex: 1 });
        this.registry.set('mdc', mdc);
        mdc.setActiveMapByIndex(this, mdc.activeIndex);  
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown', event => {
            const mDigit = event.code.match(/Digit\d+/);
            if(mDigit){
                const d = Number(mDigit[0].replace('Digit', ''));
                const player = this.registry.get('player'); 
                if(d >= 0 && d < 4){
                    player.setData('itemMode', d);
                }
            }
            const mKey = event.code.match(/Key[a-zA-Z]+/);
            if(mKey){
                const k = mKey[0].replace('Key', '');
                if(k === 'W'){
                    this.nextWorker();
                }
            }
        });
        mdc.forAllMaps(this, function(scene, md, map_index){
           
           let wi = 0;
           const len = md.worker.maxSize;
           while(wi < len){
               const worker = md.worker.spawnPerson(scene );
               if(mdc.activeIndex === map_index && wi === 0 ){            
                   scene.registry.set('player', worker);
                   worker.setToTilePos(md.hardMapData.spawnAt);       
               }
               wi += 1;
           }
       });
       const disp1 = this.add.text(10, 10, '', { color: '#cfcfcf', align: 'left', fontSize: '10px' });
       disp1.setScrollFactor(0,0);
       disp1.depth = 5;
       this.registry.set('disp1', disp1);
       const disp2 = this.add.text(10, 20, '', { color: '#cfcfcf', align: 'left', fontSize: '8px' });
       disp2.setScrollFactor(0,0);
       disp2.depth = 5;
       this.registry.set('disp2', disp2);
    }
    
    nextWorker () {
        const mdc = this.registry.get('mdc');
        let player = this.registry.get('player');
        const smi = mdc.activeIndex;
        let mi = smi;
        let isPlayer = false;
        findNext: do{
            const md = mdc.getMapDataByIndex(mi);
            const len = md.worker.children.size;
            console.log( md.worker )
            let pi = 0;
            while(pi < len){
                const worker = md.worker.children.entries[pi];
                if(isPlayer){
                    console.log('setting new player');
                    this.registry.set('player', worker);
                    worker.setData('path', []);
                    const p = worker.getTilePos();
                    worker.setToTilePos(p);
                    mdc.setActiveMapByIndex(this, mi);
                    break findNext;
                }
                if(!isPlayer){
                    isPlayer = worker === player;
                }
                pi += 1;
            }
            mi += 1;
            if(mi >= mdc.i_stop){
                mi = mdc.i_start;
            }
        }while(mi != smi);
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
        const player = this.registry.get('player');
        const disp1 = this.registry.get('disp1');
        const disp2 = this.registry.get('disp2');
        const gs = this.registry.get('gameSave');
        const mdc = this.registry.get('mdc');
        const md = mdc.getActive();
        const scene = this;
        mdc.update(scene);
        if(player){
            this.cursorCheck('left');
            this.cursorCheck('right');
            this.cursorCheck('up');
            this.cursorCheck('down');
                        md.customer.update(this);
            md.worker.update(this);
            player.pathProcessorCurve(this, (scene, person) => {
                mdc.doorCheck(scene, player);
                
                person.setData('path', []);
                person.nCurve = 0;
            });
            player.update(this);
            this.cameras.main.setZoom( 2 ).centerOn( player.x, player.y );
            disp1.x = 165;
            disp1.y = 125;
            disp2.x = 165;
            disp2.y = 135;

        }
        disp1.text = 'Money: ' + gs.money;
        //disp2.text = 'Map onHand Size: ' + md.onHand.children.size + '; Map Donations Size: ' + md.donations.children.size;     
    }
    
}

export { Mapview }

