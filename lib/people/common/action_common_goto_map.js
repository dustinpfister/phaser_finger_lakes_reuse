const ACTIONS = {};
ACTIONS.goto_map = {
    opt: {
        index: 1,
        pos: null
    },
    update: function (mdc, md, people, scene, person, opt) {
        const action = person.getData('act');
        const pos1 = person.getTilePos();
        if(md.index === opt.index){
            if(opt.pos){
                person.setPath(scene, md, pos.x, pos.y);
            }
            action.setDone('at_map');
        }
    },
    noPath: function (mdc, md, people, scene, person, opt) {
        const pos1 = person.getTilePos();
        let door = md.getDoorAt(pos1.x, pos1.y);
        if(!door || (door && md.index != opt.index)){   
            const options = md.hardMapData.doors.map((door)=>{  return door.to.mapNum });
            const min = Math.min.apply(null, options);  
            const door_to_map = options.some(( mapNum )=>{ return mapNum === opt.index  });
            const to_map = door_to_map ? opt.index : min;
            let pos2 = md.findDoorFrom(pos1.x, pos1.y, to_map, false);
            if(pos2){
                person.setPath(scene, md, pos2.x, pos2.y);
            }
        }
    }
};

export { ACTIONS };
