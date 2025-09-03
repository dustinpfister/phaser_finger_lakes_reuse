
const ACTIONS = {};

ACTIONS.shopper_wonder = {
    init: function (mdc, md, people, scene, person) {},
    update : function(mdc, md, people, scene, person, opt, delta){
        const items = md.donations.getItemType('Item', true),
        action = person.getData('act')
        if(items.length >= 1){
            action.setDone('items_found');
        }
    },
    noPath : function(mdc, md, people, scene, person){
        const tile = md.getRandomWalkTo();
        person.setPath(scene, md, tile.x, tile.y);
    }
};

export { ACTIONS };
