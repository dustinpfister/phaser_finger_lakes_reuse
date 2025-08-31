# Phaser Finger Lakes Reuse

This is a game where I am simulating how to work a job at [finger lakes reuse mega center in Ithaca New York](https://ithacareuse.org/). This project is still very much in development, so for now much of my focus is on the AI, Game Time System, and many other supporting libs that provide the core game logic. I am not writing all of the code from the ground up though mind you as this project works on top of [Phaser](https://phaser.io/)

## Install

As of R5 there is still no electron version, and nothing is published anywhere in terms of builds for specific OS platforms. So for now the way to get this working is to clone down the source code at a given point and then use a web sever ( such as [http-server](https://www.npmjs.com/package/http-server) which is what I use ) to host the root folder locally and then go to the address that it is being hosted in a web browser ( typically something like http://localhost:8080 )

So just clone down a copy of the source code and all assets

```
$ git clone --depth 1 https://github.com/dustinpfister/phaser_finger_lakes_reuse
```

Then use http-server, or do whatever you prefer to host the root folder of the project as a website on your local network.

```
$ sudo apt-get install nodejs
$ sudo apt-get install npm
$ sudo npm install -g http-server
$ cd phaser_finger_lakes_reuse
$ http-server
Starting up http-server, serving ./

http-server version: 14.1.1

http-server settings: 
CORS: disabled
Cache: 3600 seconds
Connection Timeout: 120 seconds
Directory Listings: visible
AutoIndex: visible
Serve GZIP Files: false
Serve Brotli Files: false
Default File Extension: none

Available on:
  http://127.0.0.1:8080
  http://10.155.36.38:8080
Hit CTRL-C to stop the server
```

Then just go to the url in your web browser. In this case I can go to http://127.0.0.1:8080.

## Create a Build using rollup

I am using [rollup](https://rollupjs.org/introduction/) as a way to create a final build file using the main index.js file as a start point for the over all app.

```
$ rollup ./index.js --file ./build.js --format iife
```

## Number of Players

Although I have code in place to allow a player to take direct control of a worker in the game, I am thinking that this main game will be a zero player game. I do have lots of ideas of taking this project in other directions, some of which might make more sense when it comes to making something that would work well for training new workers. As of now though maybe many of those ideas would pan out better in the form of whole other future projects based on what I have worked out here.

### Zero Player Game - R0+

As of R5 I am just focusing on taking this project in a zero player game direction, like that of [progress quest](https://en.wikipedia.org/wiki/Progress_Quest). A game like this is also often known as a [True Idle game](https://www.reddit.com/r/incremental_games/comments/2kfozg/where_are_the_true_idle_games/). So in other words a kind of game where there is no human input at all, and thus all progression happens by way of logic that updates the state of AI controlled players.

### One Player Game – R?+

Although the direction is going in that of a zero player game I would also like to, at some point, make something that is fun to play but also practical in the sense that it can be used as a way to train new [employees](https://ithacareuse.org/staff/), [volunteers](https://ithacareuse.org/volunteer/), and people returning to work via the [reset program](https://ithacareuse.org/reset/). 

### Multiplayer – R?+

If I ever get there, and of course that is a very big if, I might work on some sever side code, and with that client system changes that will allow for multiplayer. As of this writing that is a total pipe dream as it is just me working on this thing.

## Progress thus far

Progress on the development of this game has been very slow because of various factors including my real life job at Finger Lakes reuse. I am very much determined to see this one threw, so it would make sense to write a bit about the current status and direction of this game. As of R7 much of the core code that I want is very much in place at least. There is still a lot more to do in terms of working out bugs, and making the game playable for most people.

## R7 ( done 08/30/2025 ) - Menus

In R7 I added Menus, and with that a new ui.js library to help with the process of creating menus and adding them into the game. During this time I also made a lot of other improvements with people.js and other supporting files that are used along with that library in a effort to make people.js more reusable.

## R6 ( done 08/09/2025 ) - Spawn and exit areas, General Improvement's

The major new change with R6 was adding a new way to define spawn locations in maps by way have having an array of area objects rather than just a position object. In other words one or more objects with x, y, width, and height values rather than just a single object defining a single tile in a map that is a spawn point. Sense this was a very minor addition this time around, much of the time I was improving other features of the game that are all ready in place, many of which still need a fair amount of refinement. This included some minor improvements with the Schedule system that was introduced in R5, but the bulk of it I would say was with the AI which will likely need a great deal more work done in just about each additional revision moving forward for at least the foreseeable future.

## R5 ( done 07/20/2025 ) - Game Day Time, Schedule system, Color Tag System

I would like to have a system for game time and how it relates to real world time. That means having a certain amount of game time that will result in the span of a single game day. I would like for this to be something that can be adjusted in a way in which game time can go at the same rate as real world time, or much faster. Also I would at least like to start a draft on a pricing system that might take some time to get solid.

## R4 ( done 06/25/2025 ) - Tasks and actions started

With R4 the goal was to at least start to make things a little better organized with the AI as this might very well be the most complex part of the over all game. One way that I have found that might help a great deal would be to break down Person Class instance behavior into 'Tasks', and 'Actions'. To help make better sense of this, a Task would be something like donation intake, and an Action would be something like selecting and picking up an empty box. So a Task would be a way to start a Specific action, and then start yet another action depending on the outcome of the result of the previous action. However maybe a better way of expressing this is that a Task is a way of working with Actions?

## R3 ( done 06/10/2025 ) - Message System

The main feature added in R3 is a nice new message system that provides a way to displaying messages to the player in a command line type fashion. The intention is for this message library to also function as a set of debug tools, and other related features.

## R2 ( done 06/04/2025 ) - Inactive map updates

Before R2 only one map would be updated at any given time which was the current active map that is being rendered. This however will not work out so well because there will be a great number of things that will need to be updated at other maps even though they are not the current so called 'active map'. So with that said in this revision I worked out the changes that needed to be made so that all maps are updated over time. This of course will give rise to performance concerns in time, however I am all ready thinking about ways of addressing that, and also I need to get to that bridge first in other to care about it to begin with. So as long as this does not result in extreme performance drawbacks I do not see a problem.

## R1 ( done 05/22/2025 ) - Workers, Menu state started

Added a 'worker' type of Person class instance that allows for more than one 'player' object. This also allows for the player to select which worker they would like to take under direct control.

## R0 ( done 05/10/2025 ) - People, Items, Donations 

The very first Revision of course took a real long time to work out. The main reason why was because when I was first starting with this project I had so many competing ideas of how to go about even just getting started with this. For example I was trying to work out how to go about using the Phaser Physics Engine as a way to update the position stats of the Person Class instances. While doing so I started to run into all kinds of problems with collision detection and a lot of other general headaches. I still think that it is a good idea, and would help to make the game a lot more fun, however I decided to shelf the idea in favor of just simple path movement.


