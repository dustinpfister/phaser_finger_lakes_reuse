const ACTIONS = {}

ACTIONS.worker_di_idle = {
    opt:{},
    update: function (mdc, md, people, scene, person, opt) {
        const oh = person.getData('onHand');
        if( md.index != 4 && oh.length === 0 ){
             this.setDone('empty_handed');
        }
        if( md.index != 4 && oh.length > 0 ){
             this.setDone('have_items');
        }
        if( md.index === 4  && oh.length === 0 ){
             this.setDone('idle_without_items');
        }
        if( md.index === 4  && oh.length > 0 ){
             this.setDone('idle_with_items');
        }
    }
};

export { ACTIONS };
