const ACTIONS = {};
ACTIONS.drop = {
    opt : {
        max_tiles: 8,
        count: 1,
        at: null,
        empty: [1]
    },
    init: function (mdc, md, people, scene, person, opt) {
        const onHand = person.getData('onHand');
        person.setData('itemMode', 2);
        if( onHand.length > 0 ){
            let i_item = onHand.length;
            let dc = 0;
            while(i_item-- && dc != opt.count ){
                const item = onHand[i_item];    
                let pos_drop = md.findEmptyDropSpot( person.getTilePos(), opt.max_tiles, opt.empty );
                if(opt.at){
                    pos_drop = opt.at;
                }         
                if(pos_drop === null){
                    person.say('I can not find a space to drop items!');
                    this.setDone('no_space');
                }
                if(pos_drop != null){
                    if(pos_drop.iType === 'Container' && opt.at){
                        const pos = pos_drop.getTilePos();
                        people.onHandAction(scene, person, pos_drop, md, pos.x, pos.y);
                    }else{
                        item.x = pos_drop.x * 16 + 8;
                        item.y = pos_drop.y * 16 + 8;
                        item.droped = true;
                        mdc.addItemTo(item, md, 'donations');
                        
                        console.log( md.index );
                        
                        people.onHand.remove(item);
                        person.setData('onHand', []);
                    }
                }
            }
            this.setDone('items_droped');
        }
    }
};
export { ACTIONS };
