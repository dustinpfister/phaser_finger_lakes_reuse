import { MapData, MapDataCollection, MapLoader } from '../lib/mapdata.js';
import { Person, People } from '../lib/people.js';
import { COLOR, GameTime, TimeBar } from '../lib/schedule.js';
import { ConsoleLogger, MessPusher } from '../lib/message.js';
const log = new ConsoleLogger({
    cat: 'state',
    id: 'mapview',
    appendId: true
});

const IMDESC = ['tile info', 'item pickup', 'item drop', 'container pickup\/drop' ]

class Mapview extends Phaser.Scene {

    create () {
    
        const mp = this.mp = new MessPusher({
            key: 'min_3px_5px',
            sx: 165, sy: 350,
            lineHeight: 6,
            capsOnly: true,
            scene: this,
            maxLines : 12,
            maxT: 10000
        });
        
        const mdc = new MapDataCollection(this, { startMapIndex: 4 });
        
        const tb = new TimeBar({
            x:320, y: 25,
            scene: this,
            gt: new GameTime({
                scene: this,
                real: false,                           // set to true if you want real time mode
                year: 2025, month: 7, day: 19,         // date values     ( if not using real mode )
                hour: 9, minute: 0, second: 0, ms:0,   // time values     ( if not using real mode )
                multi: 700                             // time multiplier ( if not using real mode )
            })
        });
        this.registry.set('tb', tb);
 
 /*
        tb.gt.addTimedEvent({
            start: [10, 0], end: [10, 1],
            on_start: (te, gt, delta) => {
                log('pushing a stack of detonators');
                const people = mdc.getMapDataByIndex(4).customer;
                people.pushSpawnStack({
                    subTypes: [
                        ['donator', 1.00]
                    ],
                    ms_min: 1000,
                    ms_max: 5000,
                    count: 3
                });
            },
            on_update: (te, gt, delta) => {
               
            },
            on_end: (te, gt, delta) => {
                log('well that was cool.');
            }
        });
*/
        
        
        const mv = this;
        this.registry.set('mdc', mdc);
        mdc.setActiveMapByIndex(this, mdc.activeIndex);  
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.input.keyboard.on('keydown', (event) => {
            const mDigit = event.code.match(/Digit\d+/);
            if(mDigit){
                const d = Number(mDigit[0].replace('Digit', ''));
                const player = this.registry.get('player'); 
                if(d >= 0 && d < 4){
                    mv.mp.push('Switched to item mode ' + d + '\( ' + IMDESC[d] + ' \)','INFO');
                    player.setData('itemMode', d);
                }
            }
            const mKey = event.code.match(/Key[a-zA-Z]+/);
            if(mKey){
                const k = mKey[0].replace('Key', '');
                if(k === 'W'){
                    mv.nextWorker();
                }
            }
        });
        mdc.forAllMaps(this, function(scene, md, map_index){         
           let wi = 0;
           const len = md.worker.maxSize;
           while(wi < len){
               const worker = md.worker.spawnPerson(mdc, md, scene );  
               if(!worker){
                   break;
               }
               if( map_index === 4 ){
                   //worker.action = 'di';
                   //log( 'find empty drop spot test: ' );
                   //log( md.findEmptyDropSpot( { x: 38, y: 3 } ) );
                   // exspected output [39, 3], [ 39, 4 ], ...
               } 
               if(mdc.activeIndex === map_index && wi === 0 ){   
               
                   //scene.registry.set('player', worker);
                   //worker.setToTilePos( md.hardMapData.spawnAt );       
               }
               wi += 1;
           }
       });
       const gr = this.add.graphics();
       gr.setScrollFactor(0,0);
       gr.depth = 12;
       gr.fillStyle(0xff0000, 0.0);
       gr.fillRect(0,0, 640, 40);
       gr.fill();
       const disp1 = this.add.text(10, 10, '', { color: '#ffffff', align: 'left', fontSize: '10px' });
       disp1.setScrollFactor(0,0);
       disp1.depth = 12;
       this.registry.set('disp1', disp1);
       const disp2 = this.add.text(10, 30, '', { color: '#ffffff', align: 'left', fontSize: '8px' });
       disp2.setScrollFactor(0,0);
       disp2.depth = 12;
       this.registry.set('disp2', disp2);
    }
    
    nextWorker () {    
        const mdc = this.registry.get('mdc');
        let player = this.registry.get('player');
        const mv = this;
        const smi = mdc.activeIndex;
        const worker_control_state = {};
        let wc_indices = [-1, -1];
        let total_workers = 0;
        mdc.forAllMaps(mv, (scene, md, mi) => {
            const find_player = md.worker.getChildren().map(( person, pi ) => {
                total_workers += 1;
                const is_player = person === player;
                if(is_player){
                   wc_indices = [ mi, pi ];
                }
                return {
                    is_player: is_player,
                    person : person,
                    pi: pi, mi: mi
                };
            });
            worker_control_state[mi] = find_player;
        });
        // cycle to next
        let mi = wc_indices[0];
        let pi = wc_indices[1];
        let ct = 0;
        while( ct < total_workers ){
            log('ct=' + ct + ', mi=' + mi + ', pi=' + pi);      
            const nextWorker = worker_control_state[ mi ][ pi ];
            if( !nextWorker ){
                pi = 0;
                mi += 1;
                mi = mi === 5 ? mi = 1 : mi;
            }
            if( nextWorker ){
                if( nextWorker.person === player ){
                    pi += 1;  
                }
                if( nextWorker.person != player ){
                    this.setPlayerPerson( nextWorker.person, nextWorker.mi );      
                }
                ct += 1;
            }
        }
        
    }
    
    setPlayerPerson ( worker, mi ) {
        this.registry.set('player', worker);
        worker.setData('path', []);
        const p = worker.getTilePos();
        worker.setToTilePos(p);
        this.registry.get('mdc').setActiveMapByIndex(this, mi );
        this.mp.push('Switched to worker ' + worker.name, 'INFO');    
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
    
    addTimedEvents () {
        const mdc = this.registry.get('mdc'); 
        const tb = this.registry.get('tb');
        const gt = tb.gt;
        const te_count = tb.gt.timedEvents.length
        
        if(te_count === 0){
            //log(gt.hour, gt.minute)
            //log(gt.getByDelta(60 * 8))
            
            let time = gt.getByDelta(60 + Math.floor( Math.random() * 30 ))
            
            tb.gt.addTimedEvent({
                start: [time.hour, time.minute], end: [time.hour, time.minute + 1],
                on_start: (te, gt, delta) => {
                    log('pushing a stack of detonators');
                    const people = mdc.getMapDataByIndex(4).customer;
                    people.pushSpawnStack({
                        subTypes: [
                            ['donator', 1.00]
                        ],
                        ms_min: 1000,
                        ms_max: 5000,
                        count: 1 + Math.floor( Math.random() * 9 )
                    });
                },
                on_update: (te, gt, delta) => {
               
                },
                on_end: (te, gt, delta) => {
                    log('well that was cool.');
                }
            });
            
        }
    }
    
    update (time, delta) {
        const player = this.registry.get('player');
        const disp1 = this.registry.get('disp1');
        const disp2 = this.registry.get('disp2');
        const gs = this.registry.get('gameSave');
        const mdc = this.registry.get('mdc');
        const scene = this;
        
        const tb = this.registry.get('tb');
        
        this.addTimedEvents();
        
        
        tb.update( delta );
        
        mdc.update(time, delta);
    
        const md = mdc.getActive();
        scene.physics.world.setBounds(0,0, md.map.width * 16, md.map.height * 16);

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
        this.cameras.main.setZoom( 1 ).centerOn( player.x, player.y );

        disp1.text = 'Money: ' + gs.money;

        disp2.text = 'customers: ' + md.customer.getChildren().length;
        
        this.mp.update(delta);
        
    }
    
}

export { Mapview }

