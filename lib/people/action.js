import { ACTIONS_WORKER_DI } from "./action_worker_di.js";


const ACTIONS_CORE = Object.assign({}, ACTIONS_WORKER_DI );

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

ACTIONS_CORE.goto_map = {
    opt: {
        index: 1,
        pos: null
    },
    update: function (mdc, md, people, scene, person, opt) {
        const action = person.getData('act');
        const pos1 = person.getTilePos();
        if(md.index === opt.index){
            if(opt.pos){
                person.setPath(scene, md, pos.x, pos.y);
            }
            action.setDone('at_map');
        }
    },
    noPath: function (mdc, md, people, scene, person, opt) {
        const pos1 = person.getTilePos();
        let door = md.getDoorAt(pos1.x, pos1.y);
        if(!door || (door && md.index != opt.index)){   
            const options = md.hardMapData.doors.map((door)=>{  return door.to.mapNum });
            const min = Math.min.apply(null, options);  
            const door_to_map = options.some(( mapNum )=>{ return mapNum === opt.index  });
            const to_map = door_to_map ? opt.index : min;
            let pos2 = md.findDoorFrom(pos1.x, pos1.y, to_map, false);
            if(pos2){
                person.setPath(scene, md, pos2.x, pos2.y);
            }
        }
    }
};

ACTIONS_CORE.pickup = {
    opt : {
        container: false,
        canRecyle: false,
        min_dist: 2,
        max_items: 3,
        type: 'drop'
    },  
    init: function (mdc, md, people, scene, person, opt, delta) {
        person.setData('itemOfInterest', null);
    },    
    update: function (mdc, md, people, scene, person, opt, delta) {
        const oh = person.getData('onHand'), action = person.getData('act');
        if(oh.length >= opt.max_items){
            action.setDone('have_items');
            person.setData('path', []);    
        }
    },
    noPath : function(mdc, md, people, scene, person, opt){
        const action = person.getData('act');
        person.setData('itemMode', 1);
        if(opt.container){
            person.setData('itemMode', 3);
        }
        let ioi = person.getData('itemOfInterest');
        const oh = person.getData('onHand');
        const moh = person.getData('maxOnHand');
        if(!ioi && oh.length < opt.max_items){
            let items = [];
            if(opt.type === 'drop'){
                items = md.donations.getDrops();
            }
            if(opt.type === 'empty'){
                items = md.donations.getEmpties( opt.canRecyle );
            }
            if(items.length > 0){
                ioi = items[0];
                person.setData('itemOfInterest', ioi);
            }
            if(items.length === 0){
                person.say('No Items to Pickup!');
                action.setDone('no_items');
            }
        }
        if(!ioi && oh.length >= opt.max_items){
            console.log('so yes this is a condition that happens ');
        }
        if(ioi){
            const pos_item = ioi.getTilePos();
            const d = Phaser.Math.Distance.BetweenPoints(pos_item, person.getTilePos());
            if(d > opt.min_dist){
                const tile = md.findWalkToNear(pos_item, 10);
                if(tile){
                    person.setPath(scene, md, tile.x, tile.y);
                }
                if(!tile){
                    person.setDone('can_not_get_to');
                }
            }
            if(d <= opt.min_dist && opt.type === 'drop'){
                people.onHandAction(scene, person, ioi, md, pos_item.x, pos_item.y);
                action.setDone('pickup_drop');
                person.setData('itemOfInterest', null);
            }
            if(d <= opt.min_dist && opt.type === 'empty'){
                people.onHandAction(scene, person, ioi, md, pos_item.x, pos_item.y);
                action.setDone('pickup_empty');
                person.setData('itemOfInterest', null);
            }       
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
