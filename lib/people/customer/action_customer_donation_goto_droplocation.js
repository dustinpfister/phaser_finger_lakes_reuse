
const ACTIONS = {};

// an action where a person would like to find a location to drop off items
// that they have on hand that are unprocessed items to be donated to reuse.
// Once such a location has been found, the person will then go to that location.
ACTIONS.donation_goto_droplocation = {
    init: function (mdc, md, people, scene, person) {
        const tPos = person.getData('trigger_pos');
        tPos.x = -1; tPos.y = -1;
    },
    update: function (mdc, md, people, scene, person) {
        const onHand = person.getData('onHand');
        const cPos = person.getTilePos();
        const tPos = person.getData('trigger_pos');
        if( onHand.length > 0 && tPos.x === -1 && tPos.y === -1 ){
            const tiles_di = md.get_di_tiles( scene );
            if(tiles_di.length > 0){    
                const dt = tiles_di[ Math.floor( tiles_di.length * Math.random() ) ];
                const tiles_near_di = md.map.getTilesWithin(dt.x - 1, dt.y -1, 3, 3).filter( (tile) => { return md.canWalk(tile) });
                const t = tiles_near_di[ Math.floor( tiles_near_di.length * Math.random() ) ];
                person.setData('trigger_pos', {x: t.x, y: t.y });
            }
        }
        if( onHand.length === 0 ){
            this.setDone('nothing_on_hand');
        }
        if( cPos.x === tPos.x && cPos.y === tPos.y ){
           this.setDone('at_drop_location');
           person.setData('path', []);
       }
    },
    noPath: function (mdc, md, people, scene, person) {
       const cPos = person.getTilePos();
       const tPos = person.getData('trigger_pos');  
       if(tPos.x != -1 && tPos.y != -1 && !(cPos.x === tPos.x && cPos.y === tPos.y) ){
           person.setPath(scene, md, tPos.x, tPos.y);
       }
    }
};

export { ACTIONS };
