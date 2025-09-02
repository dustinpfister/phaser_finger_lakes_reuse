const ACTIONS = {};


const find_empty_spot = function(tile){
    const md = this, items = md.getItemsAtTile( tile ), item = items[0];
    if(item){
        return item.drop_count === 0 && item.contents.length === 0 && item.canRecyle;
    }
    return false;
};

const find_drop_spot = function(tile){
    const md = this, items = md.getItemsAtTile( tile ), item = items[0];
    if(item){
        return item.drop_count > 0;
    }
    return false;
};

ACTIONS.pickup_drop = {
    opt: {
        near: {x: 35, y: 4}, limit: 50,
        type: 'drop', container: false, max_items: 1
    },
    update: function (mdc, md, people, scene, person, opt) {
        const oh = person.getData('onHand');
        if(md.index === 4 && oh.length === 0){
            const spot = md.findSpot(opt.near, find_drop_spot, opt.limit);
            if(spot){
                people.setAction(scene, mdc, md, person, 'pickup', opt);
            }
            if(!spot){
                this.setDone('no_empty_items');
            }
        }
    },
    noPath: function (mdc, md, people, scene, person, opt) {
        if(opt.spot){
        }
    }
};

export { ACTIONS };
