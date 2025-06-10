/********* **********
Message
********** *********/

const Message = {};

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


const pushLine = (mp, text='', type='say' ) => {
    if(mp.capsOnly){
        text = text.toUpperCase();
    }
    let i = mp.maxLines - 1;
    while(i > 0 ){
        const line = mp.lines[i];
        const lineUnder = mp.lines[i - 1];
        const t = line.getData('t'); 
        line.text = lineUnder.text;
        line.setData('t', lineUnder.getData('t') )  
        i -= 1;
    }  
    const line0 = mp.lines[0];
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
        this.lines = [];
        let i = 0;
        while(i < this.maxLines ){
            const line = this.scene.add.bitmapText( 0, 0, this.key, '');
            line.x = 8;
            line.y = 430 - this.lineHeight * i;
            line.setData('index', i);
            line.setData('t', 0);
            //line.setData('yDelta', 0 - i);
           
            this.lines.push( line );
            i += 1;
        }   
    }

    push (text) {
        pushLine(this, text, 'say')
    }
    
    update ( delta = 30 ) {
    
        let i = 0;
        while(i < this.maxLines ){
            const line = this.lines[i];
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

