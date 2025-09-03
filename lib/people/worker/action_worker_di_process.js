const ACTIONS = {}

ACTIONS.worker_di_process = {
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

export { ACTIONS };
