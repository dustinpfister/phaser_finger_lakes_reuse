import { COLOR, GameTime, TimeBar } from '../lib/schedule/schedule.js';
import { ConsoleLogger, MessPusher, DebugScreen } from '../lib/message/message.js';
import { MapData, MapDataCollection, MapLoader } from '../lib/mapdata/mapdata.js';
import { Person, People } from '../lib/people/people.js';
import { GlobalControl, Menu } from '../lib/ui/ui.js';

const log = new ConsoleLogger({
    cat: 'state',
    id: 'mapview',
    appendId: true
});

//const IMDESC = ['tile info', 'item pickup', 'item drop', 'container pickup\/drop' ];

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
        
        const start_map_index = 4;
        const mdc = new MapDataCollection(this, { startMapIndex: start_map_index, zeroPlayerMode: true });
        this.registry.set('mdc', mdc);
        
        //this.setPlayerPerson( this.registry.get('player'), start_map_index);
        
        const tb = new TimeBar({
            x:320, y: 25,
            scene: this,
            gt: new GameTime({
                scene: this,
                real: false,                           // set to true if you want real time mode
                year: 2025, month: 7, day: 29,         // date values     ( if not using real mode )
                hour: 9, minute: 0, second: 0, ms:0,   // time values     ( if not using real mode )
                multi: 700                             // time multiplier ( if not using real mode )
            })
        });
        this.registry.set('tb', tb);
        
        const dbs =  new DebugScreen({
            scene: this,
            active: false,
            alpha: 0.60, fontSize: 12,
            desc: 'debug screen for Mapview state',
            lines: ['foo', 'bar', 'baz']
        });
        this.registry.set('dbs', dbs);
        
        
        const confMenu = Menu.createConf({
            x: 320, y: 280,
            textureKey: 'texture_menu_mapview',
            menu_key : 'menu_mapview',
            members: [
                {
                    desc: '', 
                    press: function(){
                        console.log('start!');
                        scene.startMapView();
                    }
                }
            ]
        });
        const menu = new Menu(this, confMenu);
        //this.registry.set('menu_key', 'menu_mapview');
        //this.registry.set('menu_mapview', menu);
        
        
        mdc.setActiveMapByIndex(this, mdc.activeIndex);
        
        GlobalControl.setUp( this );
        GlobalControl.centerCamToMap(this, mdc.getActive() );
        
        
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
        const scene = this;
        const smi = mdc.activeIndex;
        const worker_control_state = {};
        let wc_indices = [-1, -1];
        let total_workers = 0;
        
        // no player!? then set one
        if(!player){
           let mi = mdc.startMapIndex, len = Object.keys(mdc.mapData).length;
           while(mi <= len){
               const md = mdc.getMapDataByIndex(mi);
               const options = md.worker.getChildren();
               if(options.length > 0){
                   player = options[0];
                   this.registry.set('player', player);
                   mdc.setActiveMapByIndex(scene, mi)
                   break;
               }
               mi += 1;
           }
           if(!player){
               log('no worker at any map!');
               return;
           }
        }
        
        mdc.forAllMaps(scene, (scene, md, mi) => {
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
            const nextWorker = worker_control_state[ mi ][ pi ];
            if( !nextWorker ){
                pi = 0;
                mi += 1;
                mi = mi === 5 ? mi = 1 : mi;
            }
            if( nextWorker ){
                const md = mdc.getMapDataByIndex(nextWorker.mi);
                if( nextWorker.person === player ){
                    md.worker.setTask(this, mdc, md, nextWorker.person, 'default');
                    pi += 1;  
                }
                if( nextWorker.person != player ){
                    this.setPlayerPerson( nextWorker.person, nextWorker.mi);      
                }
                ct += 1;
            }
        }     
    }
    
    setPlayerPerson ( worker, mi ) {
        const mdc = this.registry.get('mdc');
        const md = mdc.getMapDataByIndex(mi);
        
        if(mdc.zeroPlayerMode){
            log('can not set a player object as MDC is set to zero player mode ');
        }
        
        if(!worker){
            log('no worker object given to set to player');
            return;
        }
        
        this.registry.set('player', worker);
        worker.setData('path', []);
        const p = worker.getTilePos();
        worker.setToTilePos(p);
        this.registry.get('mdc').setActiveMapByIndex(this, mi );
        this.mp.push('Switched to worker ' + worker.name, 'INFO');
        md.worker.setTask(this, this.registry.get('mdc'), md, worker, 'player_control');
    }
    
    addTimedEvents () {
        const mdc = this.registry.get('mdc'); 
        const tb = this.registry.get('tb');
        const gt = tb.gt;
        const te_count = tb.gt.timedEvents.length
        if(te_count === 0){
            let time = gt.getByDelta( 60 + Math.floor( Math.random() * 30 ) )
            
            const count = 5;
            
            tb.gt.addTimedEvent({
                start: [time.hour, time.minute], end: [time.hour, time.minute + 1],
                
                on_tick : (te, gt, delta) => {
                    te.disp_top = 'foo';
                    te.disp_bottom = count;
                },
                
                on_start: (te, gt, delta) => {
                    const md_donations = mdc.getMapDataByIndex(4);
                    const md_t = mdc.getMapDataByIndex(1);
                    const cust_t_count = md_t.customer.children.entries.length;
                    if(cust_t_count == 0){
                        const people = md_t.customer;
                        people.pushSpawnStack({
                            subTypes: [ ['shopper', 1.00] ],
                            ms_min: 1000,
                            ms_max: 5000,
                            count: count
                        });                    
                    }
                    {
                        const people = md_donations.customer;
                        people.pushSpawnStack({
                            subTypes: [ ['donator', 1.00] ],
                            ms_min: 1000,
                            ms_max: 5000,
                            count: count
                        });
                    }
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
        
        const menu = this.registry.get('menu_mapview');
        menu.draw();
        
        if(!mdc.zeroPlayerMode && !player){
           this.nextWorker();
        }
        
        this.addTimedEvents();
        tb.update( delta );
        mdc.update(time, delta);
        
        GlobalControl.update( this, time, delta );
        
        const cam_state = scene.registry.get('cam_state') || { x:0, y: 0, z: 1} ; 
        if(!mdc.zeroPlayerMode && player){
            player.pathProcessorCurve(this, (scene, person) => {
                mdc.doorCheck(scene, player);     
                person.setData('path', []);
                person.nCurve = 0;
            });
            player.update();
            this.cameras.main.setZoom( cam_state.z ).centerOn( player.x, player.y );
        }
        
        if(mdc.zeroPlayerMode){
            this.cameras.main.setZoom( cam_state.z ).centerOn( cam_state.x, cam_state.y );
        }
        
        disp1.text = 'Money: ' + gs.money;
        //disp2.text = 'customers: ' + md.customer.getChildren().length;
        this.mp.update(delta);
        
        
        const dbs = this.registry.get('dbs');
        
        //const md = mdc.getMapDataByIndex(index_map);
        dbs.lines = [];
        
        mdc.forAllMaps(scene, (scene, md, index_map ) => {
        
            md.worker.getChildren().forEach((worker)=>{
                const action = worker.getData('act');
                dbs.lines.push(
                    index_map + ') ' + worker.name + ' : ' + action.key
                );
            });
            
            md.customer.getChildren().forEach((customer)=>{
                const action = customer.getData('act');
                dbs.lines.push(
                    index_map + ') ' + customer.name + ' : ' + action.key
                );
            });
        
        });
        
        dbs.lines2 = [
            'md1 spawn_stack_count: ' + mdc.getMapDataByIndex(1).customer.getData('spawnStack').length,
            'md4 spawn_stack_count: ' + mdc.getMapDataByIndex(4).customer.getData('spawnStack').length
        ];
        dbs.draw();
        
    }
    
}

export { Mapview }

