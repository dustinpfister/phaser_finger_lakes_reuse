import { ConsoleLogger } from './message.js';

const log = new ConsoleLogger ({
    cat: 'lib',
    id: 'schedule',
    appendId: true
});

const mod = function(x, m) {
 
    return (x % m + m) % m;
}

/********* **********
  1.0) - COLOR TAG SYSTEM
********** *********/
const COLOR = {};

COLOR.first_tuesday = new Date(2025, 0, 7);
COLOR.first_index = 0;

COLOR.data = [
    { i: 0, desc: 'lavender', web: '#ff00aa' },
    { i: 1, desc: 'green',    web: '#00ff00' },
    { i: 2, desc: 'red',      web: '#ff0000' },
    { i: 3, desc: 'orange',   web: '#ff8800' },
    { i: 4, desc: 'yellow',   web: '#ffff00' },
    { i: 5, desc: 'blue',     web: '#0000ff' },

/*
    { i: 0, desc: 'lavender', web: '#ff00aa' },
    { i: 1, desc: 'blue',     web: '#0000ff' },
    { i: 2, desc: 'yellow',   web: '#ffff00' },
    { i: 3, desc: 'orange',   web: '#ff8800' },
    { i: 4, desc: 'red',      web: '#ff0000' },
    { i: 5, desc: 'green',    web: '#00ff00' }
*/
];

COLOR.keys = COLOR.data.map((obj, i)=>{ return i; });

COLOR.get_current_colors = ( print_index=0 ) => {
    if( typeof print_index === 'string' ){
        const options = COLOR.data.filter((obj)=>{
            return obj.desc === print_index.toLowerCase().trim();
        });
        if(options.length >= 1){
           print_index = options[0].i;
        }
        if(options.length === 0){
            print_index = 0;
        }
    }
    const len = COLOR.keys.length;
    const pi = print_index % len;
    return {
        print: COLOR.data[ COLOR.keys[ pi ] ],
        d25: COLOR.data[ COLOR.keys[ ( pi + 2 ) % len ] ],
        d50: COLOR.data[ COLOR.keys[ ( pi + 3 ) % len ] ],
        d75: COLOR.data[ COLOR.keys[ ( pi + 4 ) % len ] ],
        cull: COLOR.data[ COLOR.keys[ ( pi + 5 ) % len ] ]
    };
};


/********* **********
  2.0) - TimedEvent Class
********** *********/

class TimedEvent {

    constructor ( opt = {} ) {
        opt = Object.assign({}, { time_start: 30, time_length: 1000 * 30 }, opt);
        Object.assign(this, opt);
        this.time = 0;
        this.active = false;
        this.purge = false;
        this.gameTime = opt.gt || null;
        
    }
    
    on_start = []
    on_update = []
    on_end  = []
    
    addEvent ( type='start', cb=function(){} ) {
        this['on_' + type].push(cb);
    }
    
    update (time, msDelta) {
        const te = this;
        const time_end = this.time_start + this.time_length;
        if( time >= this.time_start && time < time_end && !this.active ){
            this.active = true;
            this.on_start.forEach( (cb) => {
                cb.call(te, te, te.gameTime);
            });
        }
        if( time >= this.time_start && time < time_end && this.active ){
            this.on_update.forEach( (cb) => {
                cb.call(te, te, te.gameTime, msDelta);
            });
        }
        if( time >= time_end && !this.purge){
            this.active = false;
            this.purge = true;
            this.on_end.forEach( (cb) => {
                cb.call(te, te, te.gameTime);
            });
        }
    }
    
}

/********* **********
  3.0) - GameTime Class
********** *********/

class GameTime {

    constructor ( opt = {} ) {
        this.multi = opt.multi || 1;
        this.start = [ 9 ];
        this.end = [ 18 ];
        this.real = opt.real || false;
        this.set( opt );
        this.timedEvents = [];
    }
    
    getDayPer () {
        const hour_start = this.start[0];
        const hour_end = this.end[0];
        return ( this.hour - hour_start + ( this.minute / 60 ) ) / (hour_end - hour_start);
    }
    
    addTimedEvent (opt) {
        const gt = this;
        const d = gt.jsDate;
        opt = Object.assign({}, {
            year: d.getFullYear(), month: d.getMonth(), day: d.getDate(),
            start: [ 10, 0 ],
            end : [14, 0]
        },  opt);
        const d_start = new Date( opt.year, opt.month, opt.day, opt.start[0], opt.start[1], 0, 0 );
        const d_end = new Date( opt.year, opt.month, opt.day, opt.end[0], opt.end[1], 0, 0 );
        const te = new TimedEvent({
            gt : gt,
            time_start: d_start.getTime(),
            time_length: d_end.getTime() - d_start.getTime()
        });
        
        ['start', 'update', 'end'].forEach( (type)=> {
            if(opt['on_' + type]){
                te.addEvent(type, opt['on_' + type] );
            }
        });
        
        this.timedEvents.push( te );
        return te;
    }
    
    setFromDate ( d=Date.now() ) {
        const opt = {};
        this.year = d.getFullYear();
        this.month = d.getMonth() + 1;
        this.day = d.getDate();
        this.hour = d.getHours();
        this.minute = d.getMinutes();
        this.second = d.getSeconds();
        this.ms = d.getMilliseconds();
        this.time = d.getTime();
        this.jsDate = d;
    }
    
    setFromTimestamp ( time=0 ){
        this.setFromDate( new Date( time ) );
    }
    
    set ( opt = {} ) {    
        const d = COLOR.first_tuesday;
        opt = Object.assign({
            time: null, 
            year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(),
            hour: 0, minute: 0, second: 0, ms: 0
        }, opt);
        if(!this.real && opt.time != null && typeof opt.time === 'object' ){
            this.setFromDate(opt.time);
        }
        if(!this.real && opt.time != null && (typeof opt.time === 'number' || typeof opt.time === 'string')){
            this.setFromTimestamp(parseInt(opt.time));
        }
        if(!this.real && opt.time == null){
            const d = new Date(opt.year, opt.month - 1, opt.day, opt.hour, opt.minute, opt.second, opt.ms);
            this.setFromDate(d);
        }
        if(this.real){
            this.setFromDate( new Date() );
        }
        this.jsDate = new Date( this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.ms );
        this.time = this.jsDate.getTime();
        const ms = Math.round( this.time - COLOR.first_tuesday.getTime() );
        this.print_count = Math.floor( ms  / ( 1000  * 60 * 60 * 24 * 7) );
        //this.print_index = ( COLOR.first_index + this.print_count ) % COLOR.data.length;
        
        this.print_index = mod(COLOR.first_index - this.print_count, COLOR.data.length);
        
        this.color = COLOR.get_current_colors(this.print_index);
    }
    
    step ( msDelta=0 ) {
        const gt = this;
        if(!this.real){
            this.time = this.time + ( msDelta * this.multi );
            this.setFromTimestamp( this.time );
        }
        if(this.real){
            this.setFromDate( new Date() );
        }
        this.per = this.getDayPer();
        let i_te = this.timedEvents.length;
        while(i_te--){
            const te = this.timedEvents[i_te];
            te.update(gt.time, msDelta);
            if(te.purge){
                this.timedEvents.splice(i_te, 1);
            }
        }
        if(!this.real){
            if(this.per < 0){
                this.set( Object.assign( {}, this, { time: null, hour: this.start[0] } ) );
            }
            if(this.per >= 1){
                this.set( Object.assign( {}, this, { time: null, hour: this.start[0], day: this.day + 1 } ) );
            }
        }
    }

};

/********* **********
  4.0) - TimeBar Class
********** *********/

const STR_WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class TimeBar  {

    constructor ( opt = {} ) {
        opt = Object.assign({}, { w: 600, h: 75, x: 320, y: 45 }, opt);
        this.w = opt.w;
        this.h = opt.h;
        this.gt = opt.gt || new GameTime();
        this.canvas_bg = opt.scene.textures.createCanvas('time_bar_background', opt.w, opt.h);
        this.img_bg = opt.scene.add.image( opt.x, opt.y, 'time_bar_background');
        this.ctx_bg = this.img_bg.texture.context;
        const x = opt.x - opt.w / 2 + 5;
        const y = opt.y - opt.h / 2 + 5;
        this.text_time = opt.scene.add.bitmapText( x, y, 'min_3px_5px', '');
        this.text_time.scale = 2.0;
        this.update();
    }
    
    
    update (delta=0) {
        const ctx = this.ctx_bg;
        const gt = this.gt;
        gt.step(delta);
        const str_date = gt.color.print.desc + ' ' +
            STR_WEEK_DAYS[gt.jsDate.getDay()] + ' ' +
            String(gt.month).padStart(2, '0') + '/' + 
            String(gt.day).padStart(2, '0') + '/' +
            gt.year;
        const str_time = String(gt.hour).padStart(2, '0') + ':' + 
            String(gt.minute).padStart(2, '0') + ':' + 
            String(gt.second).padStart(2, '0') + ':' +
            //String(gt.ms).padStart(3, '0') + ' ' + 
            Math.round( gt.getDayPer() * 100 ) + '%';

        ctx.fillStyle = 'white'; //gt.color.print.web;
        ctx.fillRect( 0, 0, 600, this.h );
        
        
        Object.keys(gt.color).forEach((key, i) => {
            const c = gt.color[ key ];
            const x = 340 + 50 * i, y = 5;
            ctx.fillStyle = c.web;
            ctx.fillRect(x, y, 50, 50); 
            ctx.textBaseline = 'top';
            ctx.font = '10px monospace';
            ctx.fillStyle = '#000000';
            ctx.fillText(key, x, y)
        });
        
        this.canvas_bg.refresh();
        this.text_time.text = str_date + '  ' + str_time;
        this.text_time.setCharacterTint(0, this.text_time.text.length, true, 0x000000);     
    }

};

export { COLOR, GameTime, TimeBar };
