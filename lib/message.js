/********* **********
Message
********** *********/

const Message = {};

Message.consoleLogger = function () {
    return function(){
        Array.prototype.forEach.call(arguments, (arg)=> {
            console.log( arg );
        });
    }
};

export { Message  };

