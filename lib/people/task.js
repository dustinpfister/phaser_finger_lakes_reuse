import { ConsoleLogger } from '../message/message.js';
const log = new ConsoleLogger({
    cat: 'lib',
    id: 'task'
});
const TASKS_DEFAULT = {};
TASKS_DEFAULT.default = {
    init: function (mdc, md, people, scene, person) {},
    update: (mdc, md, people, scene, person) => {}
};

class Task {
    constructor (scene, people, person, opt={}) {
        opt = Object.assign({}, { key : 'default' }, opt);
        this.TASKS = opt.TASKS || TASKS_DEFAULT;
        this.key = opt.key;
        this.opt = opt;
    }
    init (mdc, md, people, scene, person) {
        const task = this.TASKS[ this.key ];
        if(!task){
            //log('no task for key: ' + this.key);
            return;
        }
        const init = task.init;
        if(init){
           init.call(this, mdc, md, people, scene, person, this.opt);
        }
    }
    update (mdc, md, people, scene, person, delta) {
        const task = this.TASKS[ this.key ];
        if(!task){
            //log('no task object for key: ' + this.key);
            return;
        }
        const update = task.update;
        if(update){
            update.call(this, mdc, md, people, scene, person, this.opt, delta);
        }
    }
};

export { Task, TASKS_DEFAULT }
