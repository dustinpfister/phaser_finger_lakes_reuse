const ACTIONS = {};

ACTIONS.pickup_empty = {
    opt : {
        container: true,
        canRecyle: true,
        min_dist: 2,
        max_items: 1
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
        let ioi = person.getData('itemOfInterest');
        const oh = person.getData('onHand');
        const moh = person.getData('maxOnHand');
        if(!ioi && oh.length < opt.max_items){
            const items = md.donations.getEmpties( opt.canRecyle );
            if(items.length > 0){
                ioi = items[0];
                person.setData('itemOfInterest', ioi);
            }
            if(items.length === 0){
                action.setDone('no_items');
            }
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
                    action.setDone('can_not_get_to');
                }
            }
            if(d <= opt.min_dist ){
                person.setData('itemMode', 3);
                people.onHandAction(scene, person, ioi, md, pos_item.x, pos_item.y);
                action.setDone('have_empty');
                person.setData('itemOfInterest', null);
            }       
        }
    }
};


export { ACTIONS };
