
const ACTIONS = {};

ACTIONS.customer_goto_exit = {
    init: function (mdc, md, people, scene, person) {
        const hmd = md.hardMapData;
        const pos_exit = people.getMapSpawnLocation( md, person );
        person.setData('trigger_pos', {x: pos_exit.x, y: pos_exit.y });
        person.setData('path', []);
    },
    update : function(mdc, md, people, scene, person, opt, delta){
        const cPos = person.getTilePos();
        const tPos = person.getData('trigger_pos');
        if(cPos.x === tPos.x && cPos.y === tPos.y){
            this.setDone('at_exit');
        }
    },
    noPath: function (mdc, md, people, scene, person) {
        const cPos = person.getTilePos();
        const tPos = person.getData('trigger_pos');
        const hmd = md.hardMapData;
        if(tPos.x === -1 && tPos.y === -1){
            const pos_exit = people.getMapSpawnLocation( md, person );
            person.setData('trigger_pos', {x: pos_exit.x, y: pos_exit.y });
        }
        person.setPath(scene, md, tPos.x, tPos.y);
    }
};

export { ACTIONS };
