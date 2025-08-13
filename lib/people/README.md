# People Lib for Finger Lakes Reuse

The name should say it all for this one, but just in case it is not clear. Yes this lib folder contains logic that is used to create a Person, Groups of Person Objects that can be called People, and additional logic that composes the AI of People. This is proving to be a complex part of the game which is not at all surprising, so things are broken down into many files.

## Person and People

The main people.js library in Finger Lakes Reuse Contains classes for a single Person Class instance, as well as the People Class that is a collection of these Person Class Objects.

### The Person Class

The Person class extends from the Phaser Sprite class and contains the current state of a single Person. A Person has a 'type' such as 'customer', and a subType such as 'shopper'. With that said there is a whole lot of other logic that will apply to a certain Person based mainly on this type and sub type. However Much of this will depend on the collection to which the Person is a member of, as well as the current task that the person is set to.

### The People Class

On top of having a single Person class I also have a Collection of Person Class instances which is the People Class. This People Class extends from the [Group Class in Phaser](https://docs.phaser.io/api-documentation/class/gameobjects-group)


## Tasks and Actions

In addition to the Classes that there are to work with, the People lib needs to also work with logic that composes the AI for the People Class instances. This is broken down into a 'tasks' and 'actions' where an action is something like 'picking up an empty box', and a task is a way to work with many actions and the more than one possible outcome of a given action. At first this was all baked into the main people.js lib, but as things started to get real with this I thought it would be a good idea to make things a little more fine grain. So now there is a action.js that will contain the main Action class, and then several files that contain various collections of actions.

### The Action Class ( actions.js )

I have a main action.js file that contains the Action class which provides useful methods like the setDone method. 

### Core, Customer, and Worker Actions

At the time of this writing I also have additional files in which I break down actions into files based on how they apply to groups of people. For example I have a core actions class where I place common actions such as drop, pickup, and wonder. I then also have collections of actions such as the action\_worker\_di.js file where I have all the actions that will come into play for workers that are set to the di task.

### Tasks ( tasks.js )

Sense I started an actions.js file it is also called for to do the same for tasks as well, and thus I also started a tasks.js file to do so. At the time of this writing I have just started working on this, so for now I do not have much to write here other than just saying that this is a step in the right direciton when it comes to making people.js more reuseable.



