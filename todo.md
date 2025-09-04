# Phaser Finger Lakes Reuse todo list

This is what the current plan is when it comes to future work to get done on FLR. For additional ideas on what to do net be sure to check the ideas.md file. If any additional ideas come to mind be sure to park them there for starters, and only update this todo list when needed.

## R8 (    ) - People Database

```
I am going to want to be able to supply data that will contain all kinds of information about people in general. This will contain info such as a persons name, and other details that will effect for example the speed at which they walk. Info about a person will be relevant to the possibility of them being a worker, or customer. For example the starting wage that they might want would be a key detail if they are deployed as a worker in the game, however the kinds of items that they like to buy would of course be relevant to how they will behave when deployed into the game as a customer.

Sense the focus is on people, I would like to take a moment to work a little more on the AI while I am at it. I am noticing some weird isshues where people just stop and do nothing for a while, they even get stuck, so there are some bugs to work out with that for sure.

  /json :
    * (done) start a json folder
    * (done) move /items to json/items
    * (done) move /maps to json/maps
    * (done) move /sheets to /json/sheets
    * (done) start a /json/people folder
  /json/items :
    * () I will want more items beyond just a plain white mug now
  /json/people :
    * (done) start a people_core.json file that will be a first 'core' set of people in the game.
    * (done) a person data object should contain name, speed, and sheetKey, and frameset values.
  /lib/items :
    * (done) - start an ItemTools object starting with ItemTools.genIndex method
    * (done) - update getItemData helper to make use of an itemIndex in the registry that was created using ItemTools.genIndex
    * (done) - an items file should contain the actual items data in an object called items, rather than the root object
    * (done) - an items file should allow for header data, and a sheets array in the header should be used in place of strings for each item
    * (done) - no need for item index when calling getItemData any more.
  /lib/people :
    * (done) - start a worker folder, and with that a ai_worker.js file
    * (done) - start a common folder
    * (done) - break down all of the core actions into stand alone files in the common folder
    * (done) - start a customer folder with an ai_customer.js file
    * (done) - finish breaking down worker actions in the new worker folder.
    * (done) - break down action_worker_di down into fine grain files for each action
    * (done) - finish breaking down customer actions in the new customer folder.
    * () - see about updating worker AI so that they do not get stuck.
    * () - see about updaing donator ai so that they do not just stop and do nothing when there is too much stuff in donations.
    * () - make use of people data when creating people objects
  /json/sheets
    * (done) - new people_core sheet
  /states/boot.js
    * (done) - have it so that TASKS_WORKER object is used in place of the MAIN task object for workers
    * (done) - have a TASKS_CUSTOMER, and ACTIONS_CUSTOMER in boot.js and add to the registry
  /states/load.js :
    * (done) - load people_core.json
    * (done) - call ItemTools.genIndex in create method
    * (done) - load new people_core png
  /
    * (      ) - use rollup.js to create a final R8 build when ready to finish revision
    * (      ) - update readme to reflect R8 changes, and commit R8 when done with this revision
```

## R7 ( done 08/30/2025 ) - Menus, UI Buttons, better keyboard controls
```
I would like to start a lib that will be used to create UI elements, manily buttons, that can be used to
create menus and UI actions.

  /css : 
    * ( done ) - find a way to have bars on the top/bottom or sides depending on ratio of window/screen
  /drafts :
    * ( done ) - ui_menu draft : have a draft to make use of new ui lib
    * ( done ) - ui_menu draft : work out a canvas solution for buttons
    * ( done ) - ui_menu draft : have a collection of menu buttons that preform various actions when clicked
    * ( done ) - ui_menu draft : make use of the Menu class of ui.js
    * ( done ) - schedule_todays_colors : start a new draft where the focus is just on todays colors.
    * ( done ) - schedule_todays_colors : the current set of tags should be highligheded
    * ( done ) - people draft : set custom TASKS and Actions for the draft project
  /lib/items :
    * ( done ) - have items.js in a new items folder compleate with a readme file
  /lib/people :
    * ( done ) - have a way to define what actions are used when creating a People class instance
    * ( done ) - have a tasks.js file that will contain a new Task Class
    * ( done ) - Have a GlobalControl object is ui that will be used to update the main UI Controls
    * ( done ) - have a Task class just like that if the Action class
    * ( done ) - create an instance of Task as person user data just as with Action
    * ( done ) - have a way to define what tasks are used when creating a people class instance just like with Action
    * ( done ) - a TASKS object should have a 'default' task, and the same should be true of ACTIONS objects
    * ( done ) - bug fix so that a custom set of TASK and ACTIONS objects set in boot.js will work
  /lib/mapdata  :
    * ( done ) - make it so that mapdata has its own folder, and readme file, update links for main game and drafts.
    * ( done ) - start a README.md file for mapdata lib
    * ( done ) - have a zero player mode
    * ( done ) - if in zero player mode do not use itemMode code in layer_pointer_event
    * ( done ) - new layer_pointer_event event code to use when in zero player mode that centers the camera for now
  /lib/pathfinding :
    * ( done ) - have pathfinding.js in a new pathfinding folder complete with a readme file
  /lib/schedule :
    * ( done ) - have schedule.js in a new schedule folder complete with a readme file
    * ( done ) - start a README file for schedule
  /lib/ui
    * ( done ) - start a lib folder for ui complete with README and ui.js file
    * ( done ) - have a Menu class
    * ( done ) - have a Menu.createConf static methiod for Menu to help in the process of making a conf object
    * ( done ) - have a Menu.createCanvas static method for Menu    
    * ( done ) - Menu.createConf has a default main draw method
    * ( done ) - The creation of the canvas used for a menu, should be part of the normal setup process
    * ( done ) - I would like to use ui.js as a way to define main global keyboard controls
    * ( done ) - a Menu should have a Select Feature that sets a current 'selected' button index
    * ( done ) - have keyboard controls for changing the selected buttons in a menu
    * ( done ) - have the enter button also be a way to 'press' a current 'selected' button.
    * ( done ) - new draw_button method to be called for each button in a menu 
    * ( done ) - can define what the draw_button method is when creating the menu
    * ( done ) - hovering over a button with a mouse cursor will 'select' that buttons index
    * ( done ) - zero player mode can be switched by pressing z
    * ( done ) - can move the camera when in zero player mode
    * ( done ) - can switch the active map when in zero player mode
    * ( done ) - I will want to be able to set a menu key when cretaing a menu
    * ( done ) - use setScrollFactor with menu buttons 
    * ( done ) - set depth of menu buttons to 10
    * ( done ) - a record for the menu in the registry should be made in ui.js using the new menu key value
    * ( done ) - I will want a moveCam method
    * ( done ) - have a way to adjust the position of buttons relative to the main menu position
    * ( done ) - have a GlobalControl.setMap method   
  /states/boot.js :
    * ( done ) - setting what the default ACTIONS should be for a Person 
  /states/mapview.js :
    * ( done ) - make use of new UI Global Controls
    * ( done ) - make sure to set zero player mode to true by default
    * ( done ) - have a menu class instance in mapview
    * ( done ) - have buttons for controling camera position
    * ( done ) - have buttons for switching active map
  /states/menu.js :
    * ( done ) - make use of new ui lib in menu state
  /README.md :
    * ( done ) - update readme to reflect R7 changes, and commit R7 when done with this Revision
```

## R6 ( done 08/09/2025 ) - Spawn and exit areas, General Improvement's
```
I would like to have an array of areas for each map to define where a person can spawn or exit. This means having
arrays of objects, for each map, and each object defines an x and y position along with a width and height. 
So then this will mean updates to the hard coded data of each map, as well as to logic mainly in the map data lib.

Sense the main focus of this revision will be fairly easy to complete, I will also want to take time to make many 
various general improvements to the over all project as a whole. Much still needs to be done with Schedule system 
that I put in place in R5, both with the lib itself and also how it is used with other libs such as people.js, and 
states such as mapview. Speaking of people.js there are a lot of bugs to fix with that one as well, mainly with the 
AI, and the way I define tasks and actions.

  /css :
    * ( done ) - update css so that it takes up the whole page
    * ( done ) - see about using css so that the canvas will scale, but keep native ratio

  /drafts :
    * ( done ) - readme files at least started for all drafts
    * ( done ) - fix mapdata draft with new spawn areas
    * ( done ) - get keyboard controls working with mapdata draft
    * ( done ) - fix css links for all drafts
    * ( done ) - message_messpusher draft: change position of mess game object
    * ( done ) - update html and config for all drafts so that they use hard coded canvas
    * ( done ) - pricing draft: Show results with simple half retail method
    * ( done ) - pricing draft: update readme to write about current state of pricing system
    * ( done ) - people draft : update to work with spawn areas

  /items :
    * ( done ) - add an plain box container
    * ( done ) - ItemCollection.getEmpties should also check if an item is a Container
    * ( done ) - have a BaseItem.isEmpty method

  /lib/mapdata :
    * ( done ) - have a get_di_tiles method for the mapData class 

  /lib/message :
    * ( done ) - add a debug screen Class
    * ( done ) - create a message folder, add message.js to it, and start a README.md file for message
    * ( done ) - update links to message.js for main game, as well as all drafts.

  /lib/people :
    * ( done ) - use new people spawnAreas arrays over that of a single spawnAt object
    * ( done ) - use new people spawnAreas to functions as exit areas as well
    * ( done ) - the People.setMapSpawnLocation method should make use of height and width values
    * ( done ) - have a getMapSpawnLocation as well as setMapSpawnLocation method for the Person class  
    * ( done ) - have customers use the new People.getMapSpawnLocation method to find and exit area 
    * ( done ) - when People.getMapSpawnLocation is called filter by type flags
    * ( done ) - have a People.data.spawnStack array of objects
    * ( done ) - have a People.pushSpawnStack method
    * ( done ) - update PEOPLE_TYPES.customer.canSpawn to make use of People.data.spawnStack
    * ( done ) - move people.js to /lib/people/people.js and start a README.md for the lib
    * ( done ) - have a setDone method for the Action class
    * ( done ) - use the done property of an action object in place of people.getData('action_done')
    * ( done ) - update TASKS.di to get workers to bring items to map 1 again
    * ( done ) - update TASKS.shopping to get shopers to buy items again
    * ( done ) - update TASKS.donate to get donators to leave when they are done    
    * ( done ) - always set a path for the customer_goto_exit action when the no path method is called
    * ( done ) - using Person.getData('act') in People.update method
    * ( done ) - make actions class an exteral lib in the people lib folder    
    * ( done ) - Make the drop action, part of the core set of actions, built into action.js 
    * ( done ) - Make the pickup action, part of the core set of actions, built into action.js 
    * ( done ) - Make the goto_map action, part of the core set of actions, built into action.js 
    * ( done ) - have a worker_player_control action
    * ( done ) - updated di task to handle 'have_items' result of 'worker_di_idle' action better 
    * ( done ) - have a action_worker_di.js file that will contain worker di actions only
    * ( done ) - have a action_customer.js file that will contain all customer actions
    * ( done ) - make get_di_tiles method a part of map data lib
    * ( done ) - have a action_core.js that will contain all current common actions
    * ( done ) - made ACTIONS_WORKER_DI.worker_di_return a custom action of its own   
    * ( done ) - start a whole new di task that is a clear start from what was in place before
    * ( done ) - get workers to recycle empty boxes when at di with new di task code
    * ( done ) - expand more on people/README.md
    * ( done ) - have custom code for di_worker_pickup_empty rather than calling common pickup action
    
  /lib/schedule.js :
    * ( done ) - fix bug where system is not working when real moad is set to false
    * ( done ) - have a getByDelta method that will give hour, and minute values that are a given delta into the future
    * ( done ) - have a disp_top and disp_bottom prop for timed events
    * ( done ) - have a new on_tick event that will fire on each update regardless if the timed event is in effect or not
    * ( done ) - have a lines2 for the debug screen
    
  /maps :
    * ( done ) - update maps 1-4 to have common people objects, that also have spawnArea arrays
    * ( done ) - remove old main spawnAt, and exitAt objects for maps 1-4
    * ( done ) - have plain box instances in map4 for the sake of testing out worker AI
    * ( done ) - make map 4 larger from 9 to 16 lines

  /states/boot.js :
    * ( done ) - have a PEOPLE_SPAWN_RATE const to replace 'CUSTOMER_SPAWN_RATE', and also work for people in general
    
  /states/mapview.js :
    * ( done ) - start an addTimedEvents method that will be called in the update method
    * ( done ) - display of on hand items stoped working for the player controled worker, see if that can be fixed
    * ( done ) - timed events spawn shoppers at map_t also
    * ( done ) - use new debug screen message lib feature
    * ( done ) - make sure that the starting player worker starts on player control task
    * ( done ) - more info displayed in debug screen

  / :
    * ( done ) - del old index-extended html file
    * ( done ) - move phaser.min.js to a lib folder
    * ( done ) - start a css folder with a readme and move style.css there
    * ( done ) - add a hard coded canvas element to be used with the main game in the index.html
    * ( done ) - update Phaser GameConfig in index.js to make use of hard coded canvas
    * ( done ) - add a container div in index.html

  /README.md :
    * ( done ) - update readme to reflect R6 changes, and commit R6 when done with this Revision
```

## R5 ( done 07/20/2025 ) - Game Day Time, Schedule system, Color Tag System
```
I would like to have a system for game time and how it related to real world time. That means having a certian amount 
of game time that will result in the span of a single game day. I would like for this to be something that can be 
adjusted in a way in which game time can go at the same rate as real world time, or much faster. Also I would at least 
like to start some drafts that will be further refined for future revisions. One example of this kind of draft would
be on a pricing system.

  /drafts :
    * ( done ) - have an index.html for color system draft
    * ( done ) - color table demo for color system draft
    * ( done ) - display table for color system, draft
    * ( done ) - make color system draft a demo of COLOR in new schedule.js
    * ( done ) - start a new draft to test out the new game time system in schedule.js
    * ( done ) - the schedule draft should demo TimeBar
    * ( done ) - have three scheudle demos for game time, real time, and color tag system
    * ( done ) - the schedule game time and real events draft should demo TimedEvents
    * ( done ) - rename mess_pusher to message_messpusher
    * ( done ) - people draft: update to make use of a map data files
    * ( done ) - people draft: start README file 
    * ( done ) - people draft: update map data    
    * ( done ) - people draft: use MapDataCollection.update method
    * ( done ) - mapdata draft: update draft to fix errors
    * ( done ) - mapdata draft: use MapDataCollection.update method
    * ( done ) - pricing draft: start draft project    
    
  /sheets :
    * ( done ) - have a sprite sheet for the timebar
    * ( done ) - info for color tag frames in timebar sheet
    * ( done ) - update timebar sheet atlas to have color tag frames
    * ( done ) - color text for color tag frames in timebar sheet
    
  /states/load.js
    * ( done ) - load timebar sheet 
    
  /states/mapview.js
    * ( done ) - use MapDataCollection.update method
    * ( done ) - make updates to mapview to create and display the timebar
    * ( done ) - line up display of money with the timebar
    * ( done ) - display the current time

  /lib/items.js :
    * ( done ) - can give an options object when Calling Container or Item Class

  /lib/mapdata.js :
    * ( done ) - update Container/Item Class call with options object
    * ( done ) - containers will default to empty object in MapData.setupDonations method
    * ( done ) - have a MapDataCollection.update method

  /lib/people.js :
    * ( done ) - update Container/Item Class call with options object
    * ( done ) - default CUSTOMER_SPAWN_RATE in init of customer people type
    * ( done ) - data object for map 0 in worker people type 

  /lib/schedule.js :
    * ( done ) - Start a lib that provides a system for the amount of real time a game day is.
    * ( done ) - start a GameTime class
    * ( done ) - have a GameTime.multi prop that is the number of times to multiply the rate of real world time
    * ( done ) - have a GameTime.set method that can be used as a way to set the current game time
    * ( done ) - have a GameTime.step method that can be used to step the current game time by a given update delta
    * ( done ) - start an TimeBar class that can be used to display the current state of GameTime, and its Timed Events
    * ( done ) - TimeBar used to display Time and Date.
    * ( done ) - use TimeBar to display current state for Color Tags
    * ( done ) - color tag system built into schedule.js    
    * ( done ) - start a Timed Event Class
    * ( done ) - use the message log system as with all other libs
    * ( done ) - a Timed event object contains a start time, and duration time
    * ( done ) - have a onStart, onUpdate, and onEnd callback function for each timed event object
    * ( done ) - as a game day progresses, TimedEvent objects will start at the set time
    * ( done ) - options for addTimedEvent method
    * ( done ) - old events should be purged out of the GameTime instnace
    * ( done ) - have a realTime mode where the time is just the current system time
    * ( done ) - can add callbacks by way of options object when using addTimedEvent method of GameTime class
    * ( done ) - timeBar using the same font as in the message system
    * ( done ) - Make TimeBar a stand alone class that does not extend anything
    * ( done ) - Have the all Canvas, Image, BitmapText, ect objects as properties of TimeBar
    * ( done ) - TimeBar shows the current state for printing, cull, 25%, 50%, and 75% off using the background canvas   
    * ( done ) - TimeBar should have a group of sprites that are each used to display events that are comming up
    * ( done ) - use the timebar sprite sheet for main background    
    * ( done ) - use the timebar sprite sheet for timed event sprite backgrounds
    * ( done ) - use the timebar sprite sheet for color tag backgrounds
    * ( done ) - have a TimedEvent.createGameObjects method
    * ( done ) - the TimedEvent.createGameObjects method should also create the canvas and other objects use for an info overlay
    * ( done ) - position text for timed events using TimedEvent.img
    * ( done ) - fixed bug where sprite is not set to visible   
    * ( done ) - have a TimedEvent.killDisplayObjects method.
    
  /README.md :
    * ( done ) - start an install section
    * ( done ) - write a section that outlines the progress of the game thus far
    * ( done ) - update readme to reflect R5 changes, and commit R5
```


## R4 ( done 06/25/2025 ) - Tasks and actions started
```
The general idea is that each person that is a worker, or any type really, can be set to a given 'Task' 
such as a 'DI' task. Each task will then involve one or more actions such as 'findDonation',
'pickUpDonation', 'sortDonation', 'pickUpSortedContainer', 'moveGayload', ect. Shopper Type People 
can also have tasks beyond just that of, well... shop. For example one other task might be to 'pickUp' a
pice of furniture that they bought before hand. However that might be a matter for a future revision

  /state/mapview.js :
    * ( done ) - fix bug with worker switching is not working at all
    * ( done ) - work out new system for worker switching where we end up cycling threw all workers

  /lib/items.js :
    * ( done ) - have a ItemCollection.getEmpites method
    * ( done ) - canGet and canSell prop for containers

  /lib/mapdata.js :
    * ( done ) - use mdc instance as a place to store numbers that will be used for people class names
    * ( done ) - try out setting up the player in the MapDataCollection constructor
    * ( done ) - have a md.findItemAtSpot method
    * ( done ) - have a general md.findSpot method
    * ( done ) - have a md.findWalkToNear method
    * ( done ) - can give an empty array of indices when using findEmptyDropSpot method
    
  /lib/people.js :
    * ( done ) - start work on Tasks and Actions By creating a collection of actions to use to create tasks
    * ( done ) - each action should have an init method that will be called once when a person enters this action from another one
    * ( done ) - each action should also have noPath, and update methods
    * ( done ) - have a people.setTask and people.setAction methods
    * ( done ) - update People Type Code to make use of Tasks and Actions
    * ( done ) - have a People.setSpawnRate method
    * ( done ) - have a Person.say method
    * ( done ) - have a donation_goto_droplocation action
    * ( done ) - have a donation_drop action
    * ( done ) - have a customer_goto_exit action
    * ( done ) - have a worker_di_idle action  
    * ( done ) - have a worker_di_return action that will cause the worker to return to di
    * ( done ) - get worker_di_return to work from any map index
    * ( done ) - start an Action Class
    * ( done ) - start a general goto_map action
    * ( done ) - start having well defined options for actions
    * ( done ) - use new action options feature to make worker_di_return an abstraction using goto_map action
    * ( done ) - start a general drop action
    * ( done ) - general drop action can be used to drop all items on hand
    * ( done ) - start a general pickup action
    * ( done ) - use pickup action to have di workers pickup donation items
    * ( done ) - general pickup action can be used to pick up an item or container
    * ( done ) - have a worker_item_price action
    * ( done ) - get pickup, price, drop, return cycle work with di task
    * ( done ) - have a worker_di_recyle_empty action
    * ( done ) - have di workers place empty boxes in the recylcing bin
    * ( done ) - fix bug where boxes get placed on top of recycling bin
    * ( done ) - fix bug where donators stop comming
    * ( done ) - get shoppers working in map 1 again
    * ( done ) - start a shopping task
    * ( done ) - have a shopper_idle action 
    * ( done ) - have a shopper_find_itemofinterest action that will cause a person to find an item they would like to buy
    * ( done ) - have a shopper_buy_itemofinterest action that will cause a person to buy an item of interest that they have
    * ( done ) - get shoppers to buy items
    * ( done ) - fix bug where shoppers are getting stuck becuase of no action when a 'no_ioi_to_buy' result happens
    * ( done ) - fix bug where di workers are placing items on top of walls
    * ( done ) - door check for workers only at this time
```

## R3 ( done 06/10/2025 ) - Message System
```
The goal here is to at least start, but maybe not yet finish a 'Message System'. This will include a custom way to log to the
console for the sake of debugging, but also provide other on screen ways of displaying info to help with debugging. In addition
to this the system can also be used for the sake of just having a way to display messages to the player.

  /drafts :
    * ( done ) - start a new mess push draft
    * ( done ) - use mess pusher to test out the ConsoleLogger feature of message.js
    * ( done ) - use mess pusher to test out the once and reset methods of ConsoleLogger
    * ( done ) - use mess pusher to test out the conditional method of ConsoleLogger
    * ( done ) - use mess pusher to test out the MessPusher feature of message.js

  /fonts :
    * ( done ) - start png and xml for 'min' font
    * ( done ) - finish upercase letters for 'min' font
    * ( done ) - finish numbers for 'min' font
    * ( done ) - finish must have symbols for 'min' font
    * ( done ) - have a min-3px-5-px font

  /state/boot.js :
    * ( done ) - use console logger for console output

  /state/load.js :
    * ( done ) - use console logger for console output
    * ( done ) - load new 'min' font
 
  /state/mapview.js :
    * ( done ) - use console logger for console output
    * ( done ) - create a MessPusher instance here in mapview state
        
  /state/menu.js :
    * ( done ) - use console logger for console output

  /lib/items.js :
    * ( done ) - use console logger for console output

  /lib/mapdata.js :
    * ( done ) - use console logger for console output

  /lib/message.js :
    * ( done ) - start a new message.js lib that will be used to tell the player/debugger things they should know
    * ( done ) - new ConsoleLogger Class
    * ( done ) - use ConsoleLogger for console output in message.js
    * ( done ) - have a ConsoleLogger.getLineNumber method that will get the lineNumber of where the log happened
    * ( done ) - have once and reset methods for ConsoleLogger
    * ( done ) - new conditional method of ConsoleLogger
    * ( done ) - new MessPusher class that will be used to push messages to the screen rather than the javaScript console
    * ( done ) - messages will go up as new ones are pushed in
    * ( done ) - all messages will fade over time
    * ( done ) - MessPusher.push method can take a sting or array of strings as content to push
    * ( done ) - have differing kinds of messages for MessPusher such as 'say', 'debug'
    * ( done ) - tint color based on message type

  /lib/pathfinder.js :
    * ( done ) - use console logger for console output

  /lib/people.js :
    * ( done ) - use console logger for console output
    * ( done ) - use say messages in new message system for things people say
    
```

## R2 ( done 06/04/2025   ) - Inactive map updates
````
In previous revisions only the current 'active' map was being updated. I have found that in one way or another what 
goes on in other maps will also need to be updated. At some point this might prove to be expensive in terms of
processing overhead. However as long as it is not a problem there is just updating all maps rather than just the
current map that is displayed to the player. If performance becomes a problem there is looking into ways to update 
things in a way in which not every little detail is updated on each main frame tick, but that is a matter for a future 
revision that is way into the future at this point.

  /states/mapview.js :
* ( done ) - using mdc.ForAllMaps method to update all mapData objects rather than just the active one
* ( done ) - set active and visible values of people class instances in the main update loop.
* ( done ) - use text2 to debug things with aspects of the player object and map tiles

  /lib/mapdata.js
* ( done ) - made a change to mdc.doorCheck to allow for setting a map other than the active map
* ( done ) - mdc.doorCheck will now return a door object or null
* ( done ) - have a md.findDoorFrom method
* ( done ) - fix bug that happens when a worker does threw a door
* ( done ) - find out why a workers on hand items do not go with them
* ( done ) - have a md.getItemsAtPX method
* ( done ) - use md.getItemsAtPX in pointer down event
* ( done ) - have a md.findEmptyDropSpot method using the md.getItemsAtPX method
* ( done ) - have a md.getItemsAtTile method and use that for the findEmptyDropSpot method
* ( done ) - update code in layer0 pointer event to get info on tile and items
* ( done ) - have a layer pointer event method outside of MapData constructor

  /lib/people.js :
* ( done ) - make updates to people types so that they will work on the current map.
* ( done ) - make Person.onHandAction part of the People class
* ( done ) - use onHand add and remove methods in People.onHandAction method just like with donators
* ( done ) - see about using onHandAction method in donator people types
* ( done ) - fixed bug where donations can not be opened
* ( done ) - have a people.transToNewMap method
* ( done ) - use the md.findDoorFrom method to get a door position
* ( done ) - see about having a coworker move from map4 to map1
* ( done ) - Have di worker drop off on hand items when in map1
* ( done ) - donators use md.findEmptyDropSpot method
* ( done ) - fixed 'can only child this Container when it is empty' with donators by not using onHandAction method
* ( done ) - have a people.dropItem method
```

## R1 ( done 05/22/2025 ) - Workers, Menu state started

```
I will also want to have 'Worker' types of People and not just 'Customers'. This means that the main player object is actually just 
an instance of a 'worker' type of Person Class instance. The player can take direct control of any worker by just cycling threw them.
The general idea then is to allow any worker that is not under player control to switch to AI control. However getting into that
is something that will need to be refined in future revisions.

  /sheets
* ( done ) - new sprites for shelfing

  /states/boot.js :
* ( done ) - remove code that uses old reuse state
* ( done ) - have boot.js create the Menu State
* ( done ) - setting a default value for 'gameSave'

  /states/load.js :
* ( done ) - load new menu1 sheet
* ( done ) - have load start menu rather than just jumping into mapview

  /states/mapview.js :
* ( done ) - removed code that has to do with cretaing a player object in favor of letting the MapDataCollection Class create it
* ( done ) - player can cycle workers
* ( done ) - display money value text on screen and have it fixed to the camera
* ( done ) - have money text value set to the current value of gameSave
* ( done ) - text position adjusted with 2x zoom
* ( done ) - have a transparent background for the text display

  /states/menu.js :
* ( done ) - start a menu state
* ( done ) - have menu state show logo
* ( done ) - any key press or mouse click will result in mapview state starting.
* ( done ) - display rev number

* /states/reuse.js :
* ( done ) - delete old reuse state in favor of newer mapview.js that replaces it

  /lib/items.js :
* ( done ) - have a BaseItem.setPrice method
* ( done ) - all priced items can be color code 0 'white tag' for now
* ( done ) - have an ItemCollection.getDrops method

  /lib/mapdata.js :
* ( done ) - have a People Class instance for each map for new workers people type
* ( done ) - use the People.spawnPerson method to create the first worker object that will be the player
* ( done ) - fixed problem with speed by passing pConfig object when calling Person Class
* ( done ) - have an employee down frame
* ( done ) - fixed problem when a player controled worker goes threw a door
* ( done ) - when a worker goes threw a door it will change to being a part of the worker collection of the new map
* ( done ) - fixed bug when changing item mode
* ( done ) - have 6 workers, 3 in mega t, 2 in mega r, and 1 in back
* ( done ) - parse any starting items as well as containers for the map
* ( done ) - set starting prices for the start items in the map

  /lib/people.js :
* ( done ) - Person.setRandomSubType method
* ( done ) - Person.setMapSpawnLocation method
* ( done ) - have setSubType methods for each Person Type \( customer, worker \)
* ( done ) - get sub person type helper method
* ( done ) - spawn conditions for base people types
* ( done ) - have a new path count total for people types
* ( done ) - fix bug that has to do with spawning workers
* ( done ) - have a person number of a People collection
* ( done ) - shopers can find items
* ( done ) - shopers can buy items, doing so just adds the shelf price to gameState.money for now
* ( done ) - an item will destroy after being bought
* ( done ) - fixed door bug by updating worker and customer People class instances before path callback
* ( done ) - fixed bug where a item is being bought more than once
* ( done ) - workers just autoset prices of items for now.
* ( done ) - have one worker automate the process of getting donation drop items

  /sheets
* ( done ) - menu_1.png sheet started with FLR logo

  / :
* ( done ) - favicon.ico
* ( done ) - delete unused plugins folder
```

## R0 ( done 05/10/2025 ) - People, Items, Donations 

```
This is the very first state of the game that took way to long to finish. Much of what I want and need is in place, but very buggy.
Of course that is just what is to be expected this early in development.

* ( done ) - start with R0 of phaser start project
* ( done ) - extended the Group class in World to create new People class
* ( done ) - start a Donations plugin that will be used for when the player starts working donations
* ( done ) - start new people plugin
* ( done ) - See about using People class for Donators in Donations plugin
* ( done ) - also now have a Person Class that is an extension of Sprite in new people plugin
* ( done ) - see about getting extended sprites working, by making a simple demo script in place of index
* ( done ) - Rename World class to Reuse to help adress confustion with world phaser class
* ( done ) - got Person.offTileCheck working by adressing mistake when calling map.getTileAt
* ( done ) - see about setting making setSpritePath part of Person class and rename it to just setPath
* ( done ) - make set random path part of the person class.
* ( done ) - People class update method
* ( done ) - People class spawnPerson Method
* ( done ) - People Class Path Processing
* ( done ) - Get Collision detection working with new Person Class 
* ( done ) - start using main game data manager
* ( done ) - sprites for customers
* ( done ) - have a data manager for the People class
* ( done ) - Expand People class with a type property that can be just 'customer' ( for now )
* ( done ) - Have a subType property for People that can be 'shoper', or 'donator'
* ( done ) - Have a customer property for each map
* ( done ) - Use customer map objects for setting sub types and sub type props
* ( done ) - have a cash property of the People Class that is the amount of money they have to buy something, pay for any kind of fee, ect.
* ( done ) - Customers should have their own spawn locations that are defined on a map by map basis
* ( done ) - player Person should have a type of 'employee'
* ( done ) - start a collection of update methods, and any other needed logic, on a Person Type and supType basis
* ( done ) - customers should also have one or more exit locations defined in map JSON data
* ( done ) - have a map tile for donation tables
* ( done ) - have donation tables in map 4
* ( done ) - update donator logic to have them go to the donation tables
* ( done ) - have a People.onCollide(gameObject) method that will also call custom methods for each type and subtype of Person
* ( done ) - update donator logic to have them go to the exit, after going to the table
* ( done ) - have an onhand property that is what a Person has in there posission.
* ( done ) - have donators go to the exit defined in the map
* ( done ) - start an Item Database in the form of one JSON file ( for now )
* ( done ) - start an item class in the donations plugin
* ( done ) - might not want or need a donations plug-in at all, for now I am going to just expand reuse.js and the people.js plugin.
* ( done ) - create main item database in load state create method
* ( done ) - I will want to have a sprite sheet for the various kinds of tiles that will be used for donations
* ( done ) - I will need an atlas for donation sprites, and load these assets
* ( done ) - I am going to go with sprites for various objects such as donations
* ( done ) - have the donation sprites move with the donators
* ( done ) - I will need to have a count of total items at the tables, and have donations stop when they are full ( for now ) 
* ( done ) - just household type items ( for now )
* ( done ) - fix isshue where I can not have a mixture of subTypes of a person
* ( done ) - fix isshue where wrong frame is set when spawning shoppers
* ( done ) - have items snap to the grid
* ( done ) - have a tile for an open box with items in it
* ( done ) - have a tile for the white mug item
* ( done ) - see about having a map items map# for each map in the reg in place of the single donations that is used for all maps
* ( done ) - when a person is destroyed there on hand items should also be destroyed
* ( done ) - fix bug where items to not get added to donation groups property
* ( done ) - see about fixing bug where donator on hand items get added to the maps donation group when map is switched
* ( done ) - blue bin tiles
* ( done ) - the player can click a box the first time to open it
* ( done ) - the player can then click on it again to remove an item and pull it into there on hand inventory
* ( done ) - use 'tile' key of item data to set the sheet and frame to use
* ( done ) - move code that has to do with attaching a pointer down event into the item class
* ( done ) - parent container is not working I will have to go with a droped boolen in the item class
* ( done ) - have a limit for the number of items the player can hold
* ( done ) - have the item show up in the scene
* ( done ) - have a common person class update method, and have it update the position of on hand items relative to person.
* ( done ) - Start a BaseItem class that will be used for the Item Class
* ( done ) - Start a seperate container class that will also extend a BaseItem class
* ( done ) - use new container class for donation boxes
* ( done ) - start a blue bin def for containers
* ( done ) - each map should have an object collection, which will be used to set the default location and state of blue bins
* ( done ) - make it so that a container can be a collection of items rather than just a way to generate items
* ( done ) - the key for a container should be a property
* ( done ) - fix bug where blue bins keep getting created each time you enter the map, by only doing so if they are not there to begin with
* ( done ) - make key part of the base item class
* ( done ) - have a find item by name method in reuse
* ( done ) - blue bins should be added to the donations group for the map in which they are located
* ( done ) - on hand items can then be placed into blue bins by clicking on the item while near a blue bin
* ( done ) - set a container to an empty frame when empty
* ( done ) - have empty donation bioxes just destroy when empty ( for now )
* ( done ) - Player class Item modes \( 1 item pickup, 2 item drop, 3 container pickup/drop \)
* ( done ) - using keyboard numbers to set itemMode for the player
* ( done ) - get itemMode 1 working
* ( done ) - i might want to call onHandAction method of player in resue.js rather that people.js 
* ( done ) - get itemMode 2 working
* ( done ) - itemMode 2 should drop items one at a time
* ( done ) - itemMode 2 should add droped items to a container if it is droped at the location of the container
* ( done ) - change contents from a group to a plain old array, and use it to store plain objects rather than sprites
* ( done ) - the plain objects in container arrays will have just basic info such as the item key that can be used to recreate the sprite when needed
* ( done ) - spawnItem Container class method
* ( done ) - can remove items from a container that has contents rather than drops
* ( done ) - get itemMode 1 working with stand alone items
* ( done ) - get itemMode 3 working
* ( done ) - autoCull feature for containers
* ( done ) - have a recycling bin container type, and place one in map4.
* ( done ) - make it so that empty boxes in a recycling bin purge out ( for now )
* ( done ) - canNotChild property for containers
* ( done ) - start a draft for working out a module form of pathfinding.js
* ( done ) - make the pathfinding demo a phaser project where I can click around on a grid
* ( done ) - start a preloader draft
* ( done ) - display progress with loading phaser
* ( done ) - display loading of additional phaser script
* ( done ) - start a main phaser script when loading is done
* ( done ) - see about getting addtional phaser loader to work
* ( done ) - have lib form of people.js plugin
* ( done ) - strart an item.js lib that makes use of the items code in the people.js plugin.
* ( done ) - start an items draft
* ( done ) - come up with a way to access item data in scene.cache.json over that of the items and containers reg keys
* ( done ) - display items in items demo
* ( done ) - start a people draft
* ( done ) - update people lib code to work with people draft
* ( done ) - just have a basic hard coded map that will work well enough to make sure path processing works
* ( done ) - get path processing to work with this new person lib
* ( done ) - see about improving path processing so that the player does not get stuck in walls
* ( done ) - start a pathProcessorCurve function
* ( done ) - start a mapdata.js lib
* ( done ) - start a new draft where the focus is on the use of people.js, items.js, and mapdata.js
* ( done ) - have a MapData class that will be used to create all mapData for each map
* ( done ) - have a MapDataCollection class
* ( done ) - make more than one map for the mapdata demo
* ( done ) - get going threw doors working for the mapdata demo
* ( done ) - when doing threw a door, have the player spawn at the door location
* ( done ) - have an ItemCollection Class in item.js lib
* ( done ) - in MapData have it so each map has a donations property that is an Instance of ItemCollection.
* ( done ) - add items to map0, and map1 for mapdata draft
* ( done ) - see about fixing weird bug where one blue bin can not be clicked ( it was becuase of depth ).
* ( done ) - get on hand actions working with new libs rather than  plugins
* ( done ) - have items in players on hand inventory show up.
* ( done ) - have it so that the player can move a blue bin to a whole other map
* ( done ) - get picking up of loose items working again
* ( done ) - use new add to active MapData method
* ( done ) - make sure that items droped in one map from another move to the itemCollection of the current map where it is droped.
* ( done ) - have a map2 for mapdata draft
* ( done ) - make it so that donators show up in map2 of mapdata draft
* ( done ) - get donators working without isshue in map2 of mapdata draft
* ( done ) - customers need to purge out when they reach an exit in the map
* ( done ) - have it so that the tile sheets, and indices used are defined in the map data
* ( done ) - have it so that the walkabule tiles are defined in the map data
* ( done ) - add tables to map2 in mapdata draft
* ( done ) - have a MapData.canWalk method
* ( done ) - update all code that checks for say tile index 1 to new system with tile index arrays in json map data
* ( done ) - make it so that only the customer group for the current active map will show up
* ( done ) - the player should be able to click the donations
* ( done ) - use MAX MAP DONATIONS COST in registry if there
* ( done ) - have an ItemCollection for customer onhand items
* ( done ) - have it so that on hand items will not show up if not in the current active map
* ( done ) - new MapData.getRandomWalkTo method
* ( done ) - make it so that shoppers show up in map1 of mapdata draft
* ( done ) - make the current state of the mapData draft the current main game
* ( done ) - changes made to boot and load states
* ( done ) - see about fixing problems with not being able to move wright in main game maps
* ( done ) - use a frame prefix in the item data
* ( done ) - get open, and stuff frames working with containers
```
