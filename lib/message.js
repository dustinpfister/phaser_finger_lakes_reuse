/********* **********
Message
********** *********/

const Message = {};

Message.consoleLogger = function (opt = {}) {
    const id = opt.id || '';
    const cat = opt.cat || '';
    const appendID = !!opt.appendID ? false : true;
    return function(){
        Array.prototype.forEach.call(arguments, (arg)=> {
            if( appendID ){
                console.log( cat + '_' + id + ' : ', arg );
            }
            if( !appendID ){
                console.log( arg );
            }
        });
    }
};

export { Message  };

