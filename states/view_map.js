import { COLOR, GameTime, TimeBar } from '../lib/schedule/schedule.js';
import { ConsoleLogger, MessPusher, DebugScreen } from '../lib/message/message.js';
import { MapData, MapDataCollection, MapLoader } from '../lib/mapdata/mapdata.js';
import { Person, People } from '../lib/people/people.js';
import { GlobalControl, Menu } from '../lib/ui/ui.js';

const log = new ConsoleLogger({
    cat: 'state',
    id: 'viewmap',
    appendId: true
});

class ViewMap extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'ViewMap';
    }

    create () {
    
        const scene = this;
    
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
        
        const tb = new TimeBar({
            x:0, y: 0,
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
            x:0, y: 0,
            frameWidth: 64, frameHeight: 32,
            textureKey: 'texture_menu_view_map',
            menu_key : 'menu_view_map',
            draw (ctx, canvas, i, menu) {
                const button = this, fw = menu.fw, fh = menu.fh, lw = menu.lineWidth, hlw = lw / 2;
                ctx.fillStyle = menu.colors[0] || '#ffffff';
                ctx.fillRect( 0, fh * i, fw, fh);
                if(i === menu.member_index){
                    ctx.lineWidth = lw;
                    ctx.strokeStyle = menu.colors[2] || '#000000';
                    ctx.strokeRect( hlw, fh * i + hlw, fw - lw, fh - lw);
                }
                ctx.fillStyle = menu.colors[1] || '#000000';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.font = '11px monospace';
                ctx.fillText( button.getData('desc'), fw / 2, fh * i + fh * 0.60);
            },
            members: [
                { desc: 'left', x: 540 + -64, y: 420 + 0, press: function(){ GlobalControl.moveCam(scene, -8, 0); } },
                { desc: 'right', x: 540 + 64, y: 420 + 0, press: function(){ GlobalControl.moveCam(scene, 8, 0); } },
                { desc: 'up', x: 540 + 0, y: 420 + -32, press: function(){ GlobalControl.moveCam(scene, 0, -8); } },
                { desc: 'down', x: 540 + 0, y: 420 + 32, press: function(){ GlobalControl.moveCam(scene, 0, 8); } },
                
                { desc: 'map1', x: 150 + 0, y: 420 + 0, press: function(){ GlobalControl.setMap(scene, 1); } },
                { desc: 'map2', x: 150 + 70, y: 420 + 0, press: function(){ GlobalControl.setMap(scene, 2); } },
                { desc: 'map3', x: 150 + 140, y: 420 + 0, press: function(){ GlobalControl.setMap(scene, 3); } },
                { desc: 'map4', x: 150 + 210, y: 420 + 0, press: function(){ GlobalControl.setMap(scene, 4); } },
                
                { desc: 'pop', x: 50, y: 420 , press: function(){
                
                    //scene.scene.sleep('ViewMap');
                    //scene.scene.wake('ViewPopulation');
                
                    scene.scene.start('ViewPopulation');
                } }
                
            ]
        });
        const menu = new Menu(this, confMenu);
        
        mdc.setActiveMapByIndex(this, mdc.activeIndex);
        
        GlobalControl.setUp( this );
        GlobalControl.centerCamToMap(this, mdc.getActive() );
       
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
           let mi = 1, len = Object.keys(mdc.mapData).length;
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
    
    add_worker_timed_events () {
        const mdc = this.registry.get('mdc'); 
        const tb = this.registry.get('tb');
        const gt = tb.gt;
        const te_count = tb.gt.timedEvents.length;
        const md_wspawn = mdc.getMapDataByIndex(2);
        const people = md_wspawn.worker;
        const people_len = mdc.getTotalWorkerCount(); //people.getChildren().length;
        if( people_len === 0 &&  te_count === 0 ){
            let time = gt.getByDelta( 5  );
            const count = 1;
            tb.gt.addTimedEvent({
                start: [time.hour, time.minute], end: [time.hour, time.minute + 1],
                on_tick : (te, gt, delta) => {
                    te.disp_top = count + ' Worker';
                    te.disp_bottom = '';
                },
                on_start: (te, gt, delta) => {
                    people.pushSpawnStack({
                        //subTypes: [ ['employee', 1.00] ],
                        //ms_min: 1000, ms_max: 5000, count: count
                        keys: ['cp_unique_1_0']
                    }); 
                }
            });
        }
    }
    
    add_shopper_timed_events () {
        const mdc = this.registry.get('mdc'); 
        const tb = this.registry.get('tb');
        const gt = tb.gt;
        const te_count = tb.gt.timedEvents.length;
        const md_t = mdc.getMapDataByIndex(1);
        const people = md_t.customer;
        const people_len = people.getChildren().length === 0;
        if( people_len &&  te_count === 0 ){
            const t_base = 60;
            const t_event_count = te_count * 25;
            const t_rnd = Math.floor( Math.random() * 0 );
            let time = gt.getByDelta( t_base + t_event_count + t_rnd  );
            const count = 1;
            tb.gt.addTimedEvent({
                start: [time.hour, time.minute], end: [time.hour, time.minute + 1],
                on_tick : (te, gt, delta) => {
                    te.disp_top = count + ' Shoppers';
                    te.disp_bottom = '';
                },
                on_start: (te, gt, delta) => {
                    people.pushSpawnStack({
                        subTypes: [ ['shoppers', 1.00] ],
                        ms_min: 1000, ms_max: 5000, count: count
                    }); 
                }
            });
        }
    }
    
    // method for adding donator timed events
    add_donator_timed_events () {
        const mdc = this.registry.get('mdc'); 
        const tb = this.registry.get('tb');
        const gt = tb.gt;
        const te_count = tb.gt.timedEvents.length;
        const md_donations = mdc.getMapDataByIndex(4);
        const people = md_donations.customer;
        const len_donations = md_donations.donations.getChildren().length;
        const max_donations = this.registry.get('MAX_MAP_DONATIONS');
        if( len_donations < max_donations && te_count === 0 ){
            const t_base = 60;
            const t_event_count = te_count * 60;
            const t_rnd = Math.floor( Math.random() * 30 );
            let time = gt.getByDelta( t_base + t_event_count + t_rnd  );
            const count = 3;
            tb.gt.addTimedEvent({
                start: [time.hour, time.minute], end: [time.hour, time.minute + 1],
                on_tick : (te, gt, delta) => {
                    te.disp_top = count + ' Donators';
                    te.disp_bottom = '';
                },
                on_start: (te, gt, delta) => {
                    people.pushSpawnStack({
                        subTypes: [ ['donator', 1.00] ],
                        ms_min: 1000, ms_max: 5000, count: count
                    }); 
                }
            });
        }
    }
    
    update (time, delta) {
        const player = this.registry.get('player');
        const gs = this.registry.get('gameSave');
        const mdc = this.registry.get('mdc');
        const scene = this;
        const tb = this.registry.get('tb');
        
        const menu = this.registry.get('menu_view_map');
        menu.draw();
        
        if(!mdc.zeroPlayerMode && !player){
           this.nextWorker();
        }
        
        this.add_worker_timed_events();
        this.add_shopper_timed_events();
        this.add_donator_timed_events();
        
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
        
        this.mp.update(delta);
        
        
        const dbs = this.registry.get('dbs');
        
        //const md = mdc.getMapDataByIndex(index_map);
        dbs.lines = [
            'Mapview child count: ' + scene.children.length,
            'map4 donation count: ' + mdc.mapData.map4.donations.getChildren().length,
            'game texture count: ' + Object.keys( this.game.textures.list ).length,
            '',''
        ];
        
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
        
        // debug info for spawn stacks
        dbs.lines2 = [];
        
        [1,4].forEach( (map_index) => {
            const md = mdc.getMapDataByIndex( map_index );
            const ss_cust = md.customer.getData('spawnStack');
            const ss_work = md.worker.getData('spawnStack');
            dbs.lines2.push( map_index + ' ) spawn stack lengths : ' );
            dbs.lines2.push( ' customer : ' + ss_cust.length + ';  worker: ' + ss_work.length);
            dbs.lines2.push('*****','');
        } );
        
        //dbs.lines2 = [
            //'md1 spawn_stack_count: ' + mdc.getMapDataByIndex(1).customer.getData('spawnStack').length,
            //'md4 spawn_stack_count: ' + mdc.getMapDataByIndex(4).customer.getData('spawnStack').length
        //];
        dbs.draw();
        
    }
    
}

export { ViewMap }

