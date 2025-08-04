# People Lib for Finger Lakes Reuse

The name should say it all for this one, but just in case it is not clear. Yes this lib folder contains logic that is used to create a Person, Groups of Person Objects that can be called People, and additional logic that composes the AI of People. This is proving to be a complex part of the game which is not at all surprising, so things are broken down into many files.

## Person and People

The main people.js libray in Finger Lakes Reuse Contains classes for a single Person Class instance, as well as the People Class that is an extension of the [Group Class in Phaser](https://docs.phaser.io/api-documentation/class/gameobjects-group) for everything related to Groups of Person Class instances. 

### The Person Class

### The People Class

## Tasks and Actions

In addition to the Classes that there are to work with, the People lib needs to also work with logic that composes the AI for the People Class instances. This is broken down into a 'tasks' and 'actions' where an action is something like 'picking up an empty box', and a task is a way to work with many actions and the more than one possible outcome of a given action. At first this was all baked into the main people.js lib, but as things started to get real with this I thought it would be a good idea to make things a little more fine grain. So now there is a action.js that will contain the main Action class, and then several files that contain various collections of actions.

### The Action Class

the action.js file

### Worker Actions

the action\_worker\_di.js file

