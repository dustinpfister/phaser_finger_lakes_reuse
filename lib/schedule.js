
/********* **********
  1.0) - COLOR TAG SYSTEM
********** *********/
const COLOR = {};

COLOR.data = [
    { i: 0, desc: 'lavender', web: '#ff00aa' },
    { i: 1, desc: 'blue',     web: '#0000ff' },
    { i: 2, desc: 'yellow',   web: '#ffff00' },
    { i: 3, desc: 'orange',   web: '#ff8800' },
    { i: 4, desc: 'red',      web: '#ff0000' },
    { i: 5, desc: 'green',    web: '#00ff00' },
];

COLOR.keys = COLOR.data.map((obj, i)=>{ return i; });

COLOR.get_current_colors = ( print_index=0 ) => {

    if(typeof print_index === 'string'){
        const options = COLOR.data.filter((obj)=>{ return obj.desc === print_index.toLowerCase().trim(); });
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
    
    }
    
}

/********* **********
  3.0) - GameTime Class
********** *********/

class GameTime {

    constructor ( opt = {} ) {
        this.multi = opt.multi || 1;
        this.set( opt );
    }
    
    setFromDate ( d=Date.now() ) {
        const opt = {};
        opt.year = d.getFullYear();
        opt.month = d.getMonth() + 1;
        opt.day = d.getDate();
        opt.hour = d.getHours();
        opt.minute = d.getMinutes();
        opt.second = d.getSeconds();
        opt.ms = d.getMilliseconds();
        opt.time = null;
        this.set(opt);
    }
    
    setFromTimestamp ( time=0){
        this.setFromDate( new Date( time ) );
    }
    
    set ( opt = {} ) {
        opt = Object.assign({ time: null, year: 2023, month: 1, day: 1, hour: 0, minute: 0, second: 0, ms: 0 }, opt);
        if(opt.time != null){
            if(typeof opt.time === 'number'){
                this.setFromTimestamp(opt.time);
            }
            if(typeof opt.time === 'object'){
                this.setFromDate(opt.time);
            }
            return;
        }
        this.year = opt.year;
        this.month = opt.month;
        this.day = opt.day;
        this.hour = opt.hour;
        this.minute = opt.minute;
        this.second = opt.second;
        this.ms = opt.ms;
        
        this.jsDate = new Date( this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.ms );
        this.time = this.jsDate.getTime();
        return this.jsDate;
    }
    
    step ( msDelta=0 ) {
        this.time = this.time + ( msDelta * this.multi );
        this.setFromTimestamp( this.time );
        
    }
};

export { COLOR, GameTime };
