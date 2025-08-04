const ACTIONS_WORKER_DI = {};

ACTIONS_WORKER_DI.worker_di_idle = {
    opt:{},
    update: function (mdc, md, people, scene, person, opt) {
        const player = scene.registry.get('player');
        const oh = person.getData('onHand');
        if( md.index != 4 && oh.length === 0 ){
             this.setDone('empty_handed');
        }
        if( md.index != 4 && oh.length > 0 ){
             this.setDone('have_items');
        }
        if( md.index === 4){
             this.setDone('at_di_back');
        }
    }
};

ACTIONS_WORKER_DI.worker_di_return = {
    init: function (mdc, md, people, scene, person) {
        people.setAction(scene, mdc, md, person, 'goto_map', { index: 4 } );
    }
};

ACTIONS_WORKER_DI.worker_di_recycle_empty = {
    opt: {},
    init: function(mdc, md, people, scene, person, opt, delta) {
         person.setData('itemOfInterest', null);
         const bin = md.getRecycling();
         const onHand = person.getData('onHand');
         if(onHand.length === 0){
             person.setDone('nothing_on_hand');
             return;
         }
         if(bin){
             const pos_bin = bin.getTilePos();
             const pos = md.findWalkToNear(pos_bin, 10);
             if(pos){
                 person.setData('itemOfInterest', bin);
                 person.setPath(scene, md, pos.x, pos.y);
             }
             if(!pos){
                 this.setDone('no_spot');
             }
         }
         if(!bin){
             person.say('No bin at this map!');
             this.setDone('no_bin');
         }       
    },
    update : function(mdc, md, people, scene, person, opt, delta) {
        const ioi = person.getData('itemOfInterest');
        const path = person.getData('path');
        if(ioi && path.length === 0){
             this.setDone('at_bin');
        }
    }
};

ACTIONS_WORKER_DI.worker_di_process = {
    opt: {
        maxCount: 5,
        count: 5
    },
    init: function(mdc, md, people, scene, person, opt, delta) {
        const oh = person.getData('onHand');  
        oh.forEach( (item) => {
            item.setPrice(0.50, 0);
        });
    },
    update: function(mdc, md, people, scene, person, opt, delta) {},
    noPath: function(mdc, md, people, scene, person, opt){
        const oh = person.getData('onHand');
        const moh = person.getData('maxOnHand');
        if(oh.length > 0 && opt.count > 0 ){
             const pos = md.getRandomWalkTo();
             person.setPath(scene, md, pos.x, pos.y);
             opt.count = opt.count - 1;    
        }    
        if(oh.length > 0 && opt.count <= 0 ){
             people.setAction(scene, mdc, md, person, 'drop', { count: 1 } );
        }
    }
};

export { ACTIONS_WORKER_DI };
