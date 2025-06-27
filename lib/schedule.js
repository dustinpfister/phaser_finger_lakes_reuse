
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
  2.0) - GameTime Class
********** *********/

class GameTime {

    constructor ( opt = {} ) {
    
        this.year = opt.year || 2023;
        this.month = opt.month || 1;    // 1 relative month value
        this.day = opt.date || 1;       // 1-31 day of month number

        this.hour = opt.hour === undefined ? 17 : opt.hour;
        this.minute = opt.minute === undefined ? 30 : opt.minute;
        this.second = opt.second === undefined ? 31 : opt.second;
        this.ms = opt.ms === undefined ? 975 : opt.ms;

        this.jsDate = null;             // the current game date as a javaScript Date Object
        this.setJSDate();
    
    }
    
    setJSDate () {
        this.jsDate = new Date( this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.ms );
        return this.jsDate;
    }
};

export { COLOR, GameTime };
