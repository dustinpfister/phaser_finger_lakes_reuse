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
    
    called ( ) {
        const logger = this;
        Array.from(arguments).forEach(function ( arg )  {
            if( logger.appendID ){
                console.log( logger.cat + '_' + logger.id + ' : ', arg );
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



export { ConsoleLogger };

