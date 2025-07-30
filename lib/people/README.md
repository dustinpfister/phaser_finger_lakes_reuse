# People Lib for Finger Lakes Reuse

The name should say it all for this one, but just in case it is not clear. Yes this is the lib that is used to create People, Groups of People. In addition as of R6 at least, this lib is also used to provide the AI used to govern the behavior of People as well.

## Classes

The main Library for People in Finger Lakes Reuse Contains classes for a single Person Class instance, as well as the People Class that is an extension of the [Group Class in Phaser](https://docs.phaser.io/api-documentation/class/gameobjects-group) for everything related to Groups of Person Class instances. 

## Tasks and Actions

In addition to the Classes that there are to work with the People lib also contains logic for The AI that is used for behavior of People. This is broken down into a 'tasks' and 'actions' where an action is something like 'picking up an empty box', and a task is a collection of actions such as 'picking up a box', 'moving to a recycling bin', and 'placing empty box into recycling bin'.


