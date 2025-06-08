# Phaser Finger Lakes Reuse

## RX (    ) - PIC Situations

## RX (    ) - Rollup, dev dependencies
```
* (    ) use roll up to create builds of the game
* (    ) automate linting and formating
```

## RX (    ) - Custom Text Font
```
* (    ) - use a custom text font
```

## RX (    ) - Casher workers

## RX (    ) - Physics Draft
```
  PATH PROCESSOR PHYSICS DRAFT:
* (      ) - remove all the old pathProcessor functions from main people lib in favor of working on them as a draft project
```

## RX (    ) - Preloader
```
* (    ) - make use of preloader draft in full game
```

## RX (    ) - Material Types
```
* (      ) - have a mType for containers that is the kind of material that container is made of ('cardboard', 'wood', 'bb', ect)
* (      ) - have an 'accepts' prop for containers that is the kind of material that it will except
* (      ) - make mType a BaseItem class prop
```

## RX (    ) - Repersenative Sprites
```
  REP SPRITES :
* (    ) - work out a system where we have repersentaive sprites for collections of objects on shelfs.
```

## RX (    ) - People Data
```
* (      ) - people\_customers.json for hard coded data on each customer that can show up
* (      ) - people\_workers.json for all the workers that can show up
  MISC :
* (      ) - see about using 16 x 32 sprites for some tiles, else go with the idea of using another layer
```

## RX (    ) - Tasks and actions
```
The general idea is that each person that is a worker can be set to a given 'Task' such as a 'DI' task. 
Each task will then involve one or more actions such as 'findDonation', 'pickUpDonation', 'sortDonation', 
'pickUpSortedContainer', 'moveGayload', ect.

  /lib/people.js :
* (      ) - start work on Task and Actions
* (      ) - update People Type Code to make use of Tasks and Actions
* (      ) - have an updateTask method that can be used to change what a person is doing
```

## RX (    ) - Buttons
```
 UI buttons for things like setting itemMode of player, switching worker, ect
```

## RX (    ) - Game Day Time, Schedule system, Color Tag System
``` 
  /sheets :
* (      ) - new sprites for workers

  /lib/items.js :
* (      ) - have more than one household item
* (      ) - have it so that drops will pick one of a few household items each time

 /lib/people.js :
* (      ) - have a Person.setScheduledSubType method that will set the subtype of a person based on a timed schdedule
* (      ) - donations should be placed on the table by the donators
* (      ) - the player should not be able to place items on top of walls
* (      ) - the player should only be able to pick up items that are in range
* (      ) - the player should only be able to drop items in range
* (      ) - many enter and exit locations for donators in map4
* (      ) - each donator event object will contain the game day time, and number of donators that will show up
* (      ) - a simular system should also be used for shoppers


 /lib/schedule.js :
* (      ) - Start a lib that provides a system for the amount of real time a game day is.
* (      ) - have a single game day be 30 minutes ( for now )
* (      ) - have days of the week as part of the time system
* (      ) - have di disabled on Thursdays
* (      ) - color tag system built into schedule.js
* (      ) - schedule system for People class built into schedule.js
* (      ) - each new game day starts with an array of objects that are donator events
```

## R3 (    ) - Message System
```
  /drafts :
    * ( done ) - start a new mess puesh draft
    * (      ) - new MessPusher class that will be used to push messages to the screen rather than the javaScript console
    * (      ) - have differing kinds of messages for MessPusher such as 'say', 'debug'
    * (      ) - messages will go up as new ones are pushed in
    * (      ) - messages with higher index values in the array of messages will fade
    * (      ) - all messages will fade over time as no new ones come in

  /state/boot.js :
    * ( done ) - use console logger for console output

  /state/load.js :
    * ( done ) - use console logger for console output
 
  /state/mapview.js :
    * ( done ) - use console logger for console output
        
  /state/menu.js :
    * ( done ) - use console logger for console output

  /lib/items.js :
    * ( done ) - use console logger for console output

  /lib/mapdata.js :
    * ( done ) - use console logger for console output
    * (      ) - have an array of functions to call for layer-pointer-event method for the current itemMode
    * (      ) - make it so that findEmptyDropSpot method will not return a position that is a wall tile 
    * (      ) - use new message system to display debug info

  /lib/message.js :
    * ( done ) - start a new message.js lib that will be used to tell the player/debugger things they should know
    * ( done ) - new ConsoleLogger Class
    * ( done ) - use ConsoleLogger for console output in message.js
    * ( done ) - have a ConsoleLogger.getLineNumber method that will get the lineNumber of where the log happened
    * (      ) - start new MessPusher class based on the mess push draft

  /lib/pathfinder.js :
    * (      ) - use console logger for console output

  /lib/people.js :
    * ( done ) - use console logger for console output
    * (      ) - Have di worker move back to map 4 when they have no on hand items
    * (      ) - use say messages in new message system for things people say
    * (      ) - use people.dropItem method for donators
    * (      ) - use people.dropItem method for workers
    * (      ) - use people.dropItem method for player controled worker
    * (      ) - remove drop item code from people.onHandAction
    * (      ) - have a people.pickUpItem method
    * (      ) - have a way for a donator to handle a situation in which they can not find a spot
    * (      ) - fix isshue where donators are still placing items on top of each other

    * (      ) - improve how the worker goes to a donation box
```

## R2 ( done 06/04/2025   ) - Inactive map updates
````
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
