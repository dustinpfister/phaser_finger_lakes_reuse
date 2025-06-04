/********* **********
Message
********** *********/

const Message = {};

Message.consoleLogger = function (opt = {}) {
    const id = opt.id || '';
    const appendID = !!opt.appendID ? false : true;
    return function(){
        Array.prototype.forEach.call(arguments, (arg)=> {
            if( appendID ){
                console.log( id + ' : ', arg );
            }
            if( !appendID ){
                console.log( arg );
            }
        });
    }
};

export { Message  };

