# Phaser Finger Lakes Reuse

This is a game where I am simulating how to work a job at [finger lakes reuse mega center in Ithaca New York](https://ithacareuse.org/). This project is still very much in development, so for now much of my focus is on the AI, Game Time System, and many other supporting libs that provide the core game logic. I am not writing all of the code from the ground up though mind you as this project works on top of [Phaser](https://phaser.io/)

## Install

As of R5 there is still no electron version, and nothing is published anywhere in terms of builds for specific OS platforms. So for now the way to get this working is to clone down the source code at a given point and then use a web sever ( such as [http-server](https://www.npmjs.com/package/http-server) which is what I use ) to host the root folder locally and then go to the address that it is being hosted in a web browser ( typically something like http://localhost:8080 )

```
$ git clone --depth 1 
$ sudo npm install -g http-server
```

## Progress thus far

Progress on the development of this game has been very slow because of...well...the usual. However I am very much determined to eee this one threw so I will have a section here for whats new with this.

## R5 ( done 07/20/2025 ) - Game Day Time, Schedule system, Color Tag System

I would like to have a system for game time and how it relates to real world time. That means having a certain amount of game time that will result in the span of a single game day. I would like for this to be something that can be adjusted in a way in which game time can go at the same rate as real world time, or much faster. Also I would at least like to start a draft on a pricing system that might take some time to get solid.

## Number of Players

In time I would like to make this at least a one player game, if not multiplayer. However for now it is very much a zero player game. At the time of this writing the game is still very much in a kind of [alpha state](https://en.wikipedia.org/wiki/Software_release_life_cycle), so I do not have a clear idea as to when I will get make the game at least one player.

### Zero Player Game - R0+

As of R5 I am just focusing on taking this project in a zero player game direction, like that of [progress quest](https://en.wikipedia.org/wiki/Progress_Quest). A game like this is also often known as a [True Idle game](https://www.reddit.com/r/incremental_games/comments/2kfozg/where_are_the_true_idle_games/). So in other words a kind of game where there is no human input at all, and thus all progression happens by way of logic that updates the state of AI controlled players.

### One Player Game – R?+

Although the direction is going in that of a zero player game I would also like to, at some point, make something that is fun to play but also practical in the sense that it can be used as a way to train new [employees](https://ithacareuse.org/staff/), [volunteers](https://ithacareuse.org/volunteer/), and people returning to work via the [reset program](https://ithacareuse.org/reset/). 

### Multiplayer – R?+

If I ever get there, and of course that is a very big if, I might work on some sever side code, and with that client system changes that will allow for multiplayer. As of this writing that is a total pipe dream as it is just me working on this thing.
