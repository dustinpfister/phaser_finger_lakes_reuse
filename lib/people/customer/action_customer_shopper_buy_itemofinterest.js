
const ACTIONS = {};

ACTIONS.shopper_buy_itemofinterest = {
    update: function (mdc, md, people, scene, person) {
        let ioi = person.getData('itemOfInterest');
        if(ioi){
            const pos_item = ioi.getTilePos();
            const pos_person = person.getTilePos();
            if( pos_person.x === pos_item.x && pos_person.y === pos_item.y ){
                person.x = pos_item.x * 16 + 8;
                person.y = pos_item.y * 16 + 8;
                let gs = scene.registry.get('gameSave');
                gs.money += ioi.price.shelf;
                scene.registry.set('gameSave', gs);
                people.clearAllIOI(ioi);
                ioi.destroy();
                person.setData('itemOfInterest', null);
                this.setDone('items_bought');
            }
        }
        if(!ioi){
            this.setDone('no_ioi_to_buy');
        }
    },
    noPath: function(mdc, md, people, scene, person, opt){
        let ioi = person.getData('itemOfInterest');  
        if(ioi){
            const pos_item = ioi.getTilePos();
            person.setPath(scene, md, pos_item.x, pos_item.y);
        }
    }
};


export { ACTIONS };
