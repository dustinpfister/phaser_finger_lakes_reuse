
const ACTIONS = {};

ACTIONS.shopper_find_itemofinterest = {
    init: function (mdc, md, people, scene, person) {},
    update : function(mdc, md, people, scene, person, opt, delta){
        let ioi = person.getData('itemOfInterest');
        const items = md.donations.getItemType('Item', true);
        if(!ioi && items.length > 0){
            const iLen = items.length;
            const item = items[ Math.floor(Math.random() * iLen) ];
            person.setData('itemOfInterest', item);
            this.setDone('have_ioi');
        }
        if( !person.getData('itemOfInterest') || items.length === 0 ){
            this.setDone('no_ioi');
        }
    }
};

export { ACTIONS };
