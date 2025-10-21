# People Lib and supporting files for Finger Lakes Reuse

The name should say it all for this one, but just in case it is not clear. Yes this lib folder contains logic that is used to create a Person, Groups of Person Objects that can be called People, and additional logic that composes the AI of People. As of R8 the over all AI for the game is broken down into many task and action files, placed in various additional child folders of this main lib folder. This is proving to be a complex part of the game which is not at all surprising, as such this part of the game is something I have been working on a little at a time for each revision.

## Main AI js files for each child folder

Each of the main folders \( worker, and customer as of R8 \) should contain a main ai_*.js file that should provide the main TASKS, and ACTIONS objects that will be used for workers and customers. The additional 'common' folder contains actions that are common to both customers, and workers, so I can then use some code from there as well when making both of the various collections of AI code.

so then in the boot.js state I would want to do something like this:

```js
import { TASKS as TASKS_WORKER, ACTIONS as ACTIONS_WORKER } from "../lib/people/worker/ai_worker.js";
```

to create TASKS\_WORKER, and ACTIONS\_WORKER Objects that I would then add to the registry like so:

```js
reg.set('TASKS_WORKER', TASKS_WORKER);
reg.set('ACTIONS_WORKER', ACTIONS_WORKER);
```

These can then be used when creating the People class instances for worker like so:

```js
// The following code should be in mapdata.js as of R8
    this.worker = new People({
        scene: scene,
        defaultKey: 'people_16_16',       
        maxSize: 10,
        createCallback : (person) => {}
    },{
        type: 'worker',
        TASKS: scene.registry.get('TASKS_WORKER'),
        ACTIONS: scene.registry.get('ACTIONS_WORKER'),
        md: md,
        spawnRate: 0,
        curveSpeed: 0.95,
        subTypes: [ 'employee' ],
        subTypeProbs: [ 1.00 ]
    });
```

## 1) - Person Class, People Class, and the PeopleData system

The main people.js library in Finger Lakes Reuse Contains classes for a single Person Class instance, as well as the People Class that is a collection of these Person Class Objects. In addition in R8 I added a 'PeopleData' system that is a way to create and update a collection of objects that will be the over all population that there is to work with when it comes to hiring workers, as well as who will show up to shop and donate.

### 1.1) - The Person Class

The Person class extends from the Phaser Sprite class and contains the current state of a single Person. A Person has a 'type' such as 'customer', and a subType such as 'shopper'. With that said there is a whole lot of other logic that will apply to a certain Person based mainly on this type and sub type. However Much of this will depend on the collection to which the Person is a member of, as well as the current task that the person is set to.

### 1.2) - The People Class

On top of having a single Person class I also have a Collection of Person Class instances which is the People Class. This People Class extends from the [Group Class in Phaser](https://docs.phaser.io/api-documentation/class/gameobjects-group)

### 1.3) - The PeopleData System

When a new game is created a PeopleData Object should be created and end up being part of the game state by using the PeopleData.createNew method. This object will contain info about each person that there is in the game that in turn can be created as a single type of person such as a worker, or customer. There are a number of people that can be cloned, but even then only a certain number of times, and for the most part I would say that these kinds of people are just place holders for the additional people that will be added in as I refine this over all people system much better. 

## Tasks and Actions

In addition to the Classes that there are to work with, the People lib needs to also work with logic that composes the AI for the People Class instances. This is broken down into a 'tasks' and 'actions' where an action is something like 'picking up an empty box', and a task is a way to work with many actions and the more than one possible outcome of a given action. At first this was all baked into the main people.js lib, but as things started to get real with this I thought it would be a good idea to make things a little more fine grain. So now there is a action.js that will contain the main Action class, and then several files that contain various collections of actions.

### The Action Class ( actions.js )

I have a main action.js file that contains the Action class which provides useful methods like the setDone method. 

### Core, Customer, and Worker Actions

At the time of this writing I also have additional files in which I break down actions into files based on how they apply to groups of people. For example I have a core actions class where I place common actions such as drop, pickup, and wonder. I then also have collections of actions such as the action\_worker\_di.js file where I have all the actions that will come into play for workers that are set to the di task.

### Tasks ( tasks.js )

Sense I started an actions.js file it is also called for to do the same for tasks as well, and thus I also started a tasks.js file to do so. At the time of this writing I have just started working on this, so for now I do not have much to write here other than just saying that this is a step in the right direction when it comes to making people.js more reusable.



