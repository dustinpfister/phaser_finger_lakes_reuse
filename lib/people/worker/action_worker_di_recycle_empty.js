const ACTIONS = {}

ACTIONS.worker_di_recycle_empty = {
    opt: {},
    init: function(mdc, md, people, scene, person, opt, delta) {
         person.setData('itemOfInterest', null);
         const bin = md.getRecycling();
         const onHand = person.getData('onHand');
         if(onHand.length === 0){
             this.setDone('nothing_on_hand');
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


export { ACTIONS };
