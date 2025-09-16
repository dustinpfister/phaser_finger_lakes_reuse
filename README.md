# Phaser Finger Lakes Reuse

This is a game where I am simulating things at a thrift store called [finger lakes reuse mega center in Ithaca New York](https://ithacareuse.org/). This project is still very much in development, so for now much of my focus is on the AI, Game Time System, and many other supporting libs that provide the core game logic. I am not writing all of the code from the ground up though mind you as this project works on top of [Phaser](https://phaser.io/)

## Install

As of R9 there is still no electron.js builds, and nothing is published on the open web anywhere as well. So for now the only way to get this working is to clone down the source code at a given point and then use a web sever ( such as [http-server](https://www.npmjs.com/package/http-server) which is what I use ) to host the root folder locally and then go to the address that it is being hosted in a web browser ( typically something like http://localhost:8080 )

## Clone down the latest state of the game

To download the latest state of the game one can just clone down a copy by just using the clone sub command of git, and then pass the URL to this Repo like so.

```
$ git clone --depth 1 https://github.com/dustinpfister/phaser_finger_lakes_reuse
```

The depth option will make it so that the full change history of the game will not be downloaded, resulting in a much smaller download size.

## Clone down a given version of the game

Some times the latest is not always the greatest, in fact these days this is often the default with software. To clone down an older version use the branch option along with depth. While I am at it I often like to also give a name for the root folder that will set it aside from other local clones I might have. To do this after the repo URL give a name for the folder that includes the version number. So if you are cloning down R8 you might call the folder something like flr\_r8.

```
$ git clone --depth 1 --branch R8 https://github.com/dustinpfister/phaser_finger_lakes_reuse flr_r8
```

Another thing to keep in mind when switching around between various versions is that you might need to do a hard reload the game to clear out other versions of assets that might be cached in the browser ( right click the reload button while the javaScript console is open and select 'Empty Cache and Hard Reload') .

## Starting a server ( using http-server on top of node.js )git clone --depth 1 --branch <tag_name> <repo_url>

Then use http-server, or do whatever you prefer to host the root folder of the project as a website on your local network. If you do wish to use http-server then you will need node.js, and a package manager for it such as npm. Once http-server is installed as a global script, just make the root folder of the game the current working directory, and run http-server.

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
  http://192.168.88.23:8080
Hit CTRL-C to stop the server
```

Then just go to the url in your web browser. In this case I can go to http://localhost:8080 , http://127.0.0.1:8080 , or the actual local ip as shown above that will differ from one network to another.

## Create a Build using rollup

I am using [rollup](https://rollupjs.org/introduction/) as a way to create a final build file using the main index.js file as a start point for the over all app.

```
$ rollup ./index.js --file ./build.js --format iife
```

## Zero Player Game - R0+

As of R5 I am just focusing on taking this project in a zero player game direction, like that of [progress quest](https://en.wikipedia.org/wiki/Progress_Quest). A game like this is also often known as a [True Idle game](https://www.reddit.com/r/incremental_games/comments/2kfozg/where_are_the_true_idle_games/). So in other words a kind of game where there is no human input at all, and thus all progression happens by way of logic that updates the state of AI controlled players. In R8 I started to stop support of taking direct control over a player object instance, as yet another step in this direction. However I would like to work on some drafts making use of the code in this over all project that will still be the kind of game that involve direct user interaction. It is just that I have to start making sacrifices when it comes to all the various ideas I have for the main game. Other ideas for a single player game, as well as the possibility of multiplayer, should be pulled out into side projects that may or may not ever progress into anything.

## Progress thus far

Progress on the development of this game has been very slow because of various factors including my real life job at Finger Lakes reuse. I am very much determined to see this one threw, so it would make sense to write a bit about the current status and direction of this game. As of R7 much of the core code that I want is very much in place at least. There is still a lot more to do in terms of working out bugs, and making the game playable for most people.

### R8 ( done 09/09/2025 ) - People DataBase

The main feature of R8 was to add a central people data base so that I can start having data for each person object in the game. The general idea here is that I will have a JOSN file that allows for me to add specific data for each and every person instance, this just sets speed for now, but in future revisions much more than that. As usual I was able to fix a whole lot of bugs while working on this one, and as such the over all state of the code is looking a little better. Still I have at least a few more revisions until I start to have something that looks like a game.

### R7 ( done 08/30/2025 ) - Menus

In R7 I added Menus, and with that a new ui.js library to help with the process of creating menus and adding them into the game. During this time I also made a lot of other improvements with people.js and other supporting files that are used along with that library in a effort to make people.js more reusable.

### R6 ( done 08/09/2025 ) - Spawn and exit areas, General Improvement's

The major new change with R6 was adding a new way to define spawn locations in maps by way have having an array of area objects rather than just a position object. In other words one or more objects with x, y, width, and height values rather than just a single object defining a single tile in a map that is a spawn point. Sense this was a very minor addition this time around, much of the time I was improving other features of the game that are all ready in place, many of which still need a fair amount of refinement. This included some minor improvements with the Schedule system that was introduced in R5, but the bulk of it I would say was with the AI which will likely need a great deal more work done in just about each additional revision moving forward for at least the foreseeable future.

### R5 ( done 07/20/2025 ) - Game Day Time, Schedule system, Color Tag System

I would like to have a system for game time and how it relates to real world time. That means having a certain amount of game time that will result in the span of a single game day. I would like for this to be something that can be adjusted in a way in which game time can go at the same rate as real world time, or much faster. Also I would at least like to start a draft on a pricing system that might take some time to get solid.

### R4 ( done 06/25/2025 ) - Tasks and actions started

With R4 the goal was to at least start to make things a little better organized with the AI as this might very well be the most complex part of the over all game. One way that I have found that might help a great deal would be to break down Person Class instance behavior into 'Tasks', and 'Actions'. To help make better sense of this, a Task would be something like donation intake, and an Action would be something like selecting and picking up an empty box. So a Task would be a way to start a Specific action, and then start yet another action depending on the outcome of the result of the previous action. However maybe a better way of expressing this is that a Task is a way of working with Actions?

### R3 ( done 06/10/2025 ) - Message System

The main feature added in R3 is a nice new message system that provides a way to displaying messages to the player in a command line type fashion. The intention is for this message library to also function as a set of debug tools, and other related features.

### R2 ( done 06/04/2025 ) - Inactive map updates

Before R2 only one map would be updated at any given time which was the current active map that is being rendered. This however will not work out so well because there will be a great number of things that will need to be updated at other maps even though they are not the current so called 'active map'. So with that said in this revision I worked out the changes that needed to be made so that all maps are updated over time. This of course will give rise to performance concerns in time, however I am all ready thinking about ways of addressing that, and also I need to get to that bridge first in other to care about it to begin with. So as long as this does not result in extreme performance drawbacks I do not see a problem.

### R1 ( done 05/22/2025 ) - Workers, Menu state started

Added a 'worker' type of Person class instance that allows for more than one 'player' object. This also allows for the player to select which worker they would like to take under direct control.

### R0 ( done 05/10/2025 ) - People, Items, Donations 

The very first Revision of course took a real long time to work out. The main reason why was because when I was first starting with this project I had so many competing ideas of how to go about even just getting started with this. For example I was trying to work out how to go about using the Phaser Physics Engine as a way to update the position stats of the Person Class instances. While doing so I started to run into all kinds of problems with collision detection and a lot of other general headaches. I still think that it is a good idea, and would help to make the game a lot more fun, however I decided to shelf the idea in favor of just simple path movement.


