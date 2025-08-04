const ACTIONS_CORE = {};

ACTIONS_CORE.drop = {
    opt : {
        max_tiles: 8,
        count: 1,
        at: null,
        empty: [1]
    },
    init: function (mdc, md, people, scene, person, opt) {
        const onHand = person.getData('onHand');
        const action = person.getData('act');
        person.setData('itemMode', 2);
        if( onHand.length > 0 ){
            let i_item = onHand.length;
            let dc = 0;
            while(i_item-- && dc != opt.count ){
                const item = onHand[i_item];    
                let pos_drop = md.findEmptyDropSpot( person.getTilePos(), opt.max_tiles, opt.empty );
                if(opt.at){
                    pos_drop = opt.at;
                }         
                if(pos_drop === null){
                    person.say('I can not find a space to drop items!');
                    action.setDone('no_space');
                }
                if(pos_drop != null){
                    if(pos_drop.iType === 'Container' && opt.at){
                        const pos = pos_drop.getTilePos();
                        people.onHandAction(scene, person, pos_drop, md, pos.x, pos.y);
                    }else{
                        item.x = pos_drop.x * 16 + 8;
                        item.y = pos_drop.y * 16 + 8;
                        item.droped = true;
                        mdc.addItemTo(item, md, 'donations');
                        people.onHand.remove(item);
                        person.setData('onHand', []);
                    }
                }
            }
            action.setDone('items_droped');
        }
    }
};

class Action {
    constructor (scene, people, person, key='wonder', opt={}) {
        this.ACTIONS = opt.ACTIONS || CORE_ACTIONS;
        this.def = this.ACTIONS[ key ]; 
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

export { Action, ACTIONS_CORE };
