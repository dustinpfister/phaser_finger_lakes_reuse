const ACTIONS = {};
ACTIONS.pickup = {
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

export { ACTIONS };
