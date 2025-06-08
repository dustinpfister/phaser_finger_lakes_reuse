/********* **********
Message
********** *********/

const Message = {};

// it is a little tricky, but yes there is a way to call a Class instance as if it where a function
// by extending the Core JS Function Class. Also must give credit where due with this so...
// https://stackoverflow.com/questions/49279702/calling-class-instance-as-a-function-in-javascript
class ConsoleLogger extends Function {
    constructor (opt = {} ) {
        super("...args", "return this.called(...args)");
        this._pos = 0;
        this.id = opt.id || '';
        this.cat = opt.cat || '';
        this.appendID = !!opt.appendID ? false : true;
        return this.bind( this );
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
    
}

const log = new ConsoleLogger({
    id: 'message',
    cat: 'lib',
    appendId: true
});

log('This is message.js which provides the ConsoleLogger class that is used to push this message to the javaScript console');



export { ConsoleLogger };

