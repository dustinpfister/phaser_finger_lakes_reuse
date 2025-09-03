
const ACTIONS = {};

ACTIONS.shopper_idle = {
    init: function (mdc, md, people, scene, person) {},
    update : function(mdc, md, people, scene, person, opt, delta){
        const items = md.donations.getItemType('Item');
        if(items.length === 0){
            this.setDone('no_items');
        }
        if(items.length >= 1){
            this.setDone('items_to_buy');
        }
    }
};

export { ACTIONS };
