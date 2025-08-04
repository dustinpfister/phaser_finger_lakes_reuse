class Action {
    constructor (scene, people, person, key='wonder', opt={}) {
        this.def = ACTIONS[ key ]; 
        this.def.opt = this.def.opt || {};
        this.scene = scene;
        this.people = people;
        this.person = person;
        this.key = key;
        this.mdc = this.scene.registry.get('mdc');
        this.done = false;
        this.result ='';
        this.opt = Object.assign({}, this.def.opt, opt);
    }
    setDone (result='done') {
        this.done = true;
        this.result = result;
    }
    init ( md ) {
        const init = this.def.init;
        if(init){
            init.call(this, this.mdc, md, this.people, this.scene, this.person, this.opt);
        }
    }
    callFunc (type='init', md, delta ){
        const func = this.def[type];
        if(func){
            func.call(this, this.mdc, md, this.people, this.scene, this.person, this.opt, delta);
        }
    }
    init ( md ) { this.callFunc('init', md); }
    update ( md, delta ) { this.callFunc('update', md, delta); }
    noPath ( md ) { this.callFunc('noPath', md); }
};

export { Action };
