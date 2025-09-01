const ACTIONS_WORKER = {};

ACTIONS_WORKER.default = {
    init: function (mdc, md, people, scene, person) {},
    update: function (mdc, md, people, scene, person, opt) {},
    noPath: function (mdc, md, people, scene, person, opt) {},
};

const TASKS_WORKER = {};

TASKS_WORKER.default = {
    init: function (mdc, md, people, scene, person) {
    
        console.log(person.name + 'I have no brain! (yet) ');
    
    },
    update: (mdc, md, people, scene, person) => {
    
    }
};

export { TASKS_WORKER, ACTIONS_WORKER };
