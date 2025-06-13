/********* **********
Message
********** *********/

const Message = {};

const COLORS = {
   SAY: 0x00ff00,
   INFO: 0x00ffff,
   DEBUG: 0xff0000
};

// it is a little tricky, but yes there is a way to call a Class instance as if it where a function
// by extending the Core JS Function Class. Also must give credit where due with this so...
// https://stackoverflow.com/questions/49279702/calling-class-instance-as-a-function-in-javascript
class ConsoleLogger extends Function {

    constructor ( opt = {} ) {
        super("...args", "return this.called(...args)");
        this._pos = 0;
        this.id = opt.id || '';
        this.cat = opt.cat || '';
        this.appendID = !!opt.appendID ? false : true;
        const func = this.bind( this );     
        this.calls = 0;
        this.callMax = 1;
        return Object.assign(func, this);
    }
    
    condition ( test = function(){ return false } ) {
        if( test.call(this) ){
            this.called.apply(this, Array.from(arguments).slice(1, arguments.length) );
        }
    }
    
    once () {
        if( this.calls  < this.callMax){
            this.called.apply(this, arguments);
            this.calls += 1;
        }
    }
    
    reset( count = 0, max = 1 ) {
        this.calls = count;
        this.callMax = max;
    }
    
    getLineNumber () {
        try {
            throw Error('');
        } catch(err) {
            const patt = new RegExp(this.id + '\.js');
            let m = err.stack.match( patt );
            let dat = err.stack.substr(m.index, 100).split(')')[0].split(':');
            return dat;
        }
        return [];
    }
    
    called ( ) {
        const logger = this;
        const ln = logger.getLineNumber();      
        Array.from( arguments ).forEach(function ( arg )  {
            if( logger.appendID ){
                console.log(logger.cat + '_' + logger.id + ' '+ ln[1] +':' + ln[2] + ' : ', arg );
            }
            if( !logger.appendID ){
                console.log( arg );
            }
        });
    }
    
};

const log = new ConsoleLogger({
    id: 'message',
    cat: 'lib',
    appendId: true
});


const pushLine = (mp, text='', type='SAY' ) => {
    if(mp.capsOnly){
        text = text.toUpperCase();
    }
    let i = mp.maxLines - 1;
    while(i > 0 ){
        const line = mp.lines[i];
        const lineUnder = mp.lines[i - 1];
        const t = line.getData('t');
        line.setData('type', lineUnder.getData('type').toUpperCase() );
        line.text = lineUnder.text;
        line.setData('t', lineUnder.getData('t') )  
        i -= 1;
    }  
    const line0 = mp.lines[0];
    line0.setData('type', type.toUpperCase());
    line0.text = text;
    line0.setData('t', mp.maxT);
    line0.alpha = 1;
};

class MessPusher {

    constructor ( opt = { key: 'min', scene: null } ) {
        this.scene = opt.scene;
        this.key = opt.key;
        this.maxLines = opt.maxLines || 3;
        this.maxT = opt.maxT || 5000;
        this.lineHeight = opt.lineHeight || 12;
        this.capsOnly = opt.capsOnly || false;
        this.sx = opt.sx || 0;
        this.sy = opt.sy || 0;
        this.lines = [];
        let i = 0;
        while(i < this.maxLines ){
            const y = this.sy - this.lineHeight * i;
            const line = this.scene.add.bitmapText( this.sx, y, this.key, '');
            line.setScrollFactor(0, 0);
            line.depth = 7;
            //line.x = this.sx;
            //line.y = this.sy - this.lineHeight * i;   
            line.setData('type', 'INFO');
            line.setData('index', i);
            line.setData('t', 0);
            this.lines.push( line );
            i += 1;
        } 
    }

    push (text, type='say') {
        //const mcd = this.scene.registry.get(m);
        if( typeof text === 'string' ){
                pushLine(this, type + ': ' + text, type);
        }
        if( typeof text === 'object' ){
            let i = 0, len = text.length;
            while(i < len){
                if(i === 0){
                    pushLine(this, type + ': ', type);
                }
                let str = i + ' > ' + text[i];
                pushLine(this, str, type);
                i += 1;
            }
        }
    }
    
    update ( delta = 30 ) { 
        let i = 0;
        while(i < this.maxLines ){
            const line = this.lines[i];
            const y = this.sy - this.lineHeight * i;
            line.setDropShadow(1, 1, 0x2a2a2a, 1);      
            const color = COLORS[ line.getData('type') ] || 0xffffff;
            line.setCharacterTint(0, line.text.length, true, color);     
            let t = line.getData('t');
            t -= delta;
            t = t < 0 ? 0 : t;     
            line.alpha = t / this.maxT;
            line.setData('t', t);
            i += 1;
        }
    }

}



export { ConsoleLogger, MessPusher };

