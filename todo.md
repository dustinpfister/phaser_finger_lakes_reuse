# Phaser Finger Lakes Reuse

## RX (    ) - Rollup, dev dependencies
```
* (    ) use roll up to create builds of the game
* (    ) automate linting and formating
```

## RX (    ) - Casher workers

## RX (    ) - Physics Draft
```
  PATH PROCESSOR PHYSICS DRAFT:
* (      ) - remove all the old pathProcessor functions from main people lib in favor of working on them as a draft project
```

## RX (    ) - Message System
```
* (    ) - work out a message system for telling the player things they should know
```

## RX (    ) - Preloader
```
* (    ) - make use of preloader draft in full game
```

## RX (    ) - Repersenative Sprites
```
  REP SPRITES :
* (    ) - work out a system where we have repersentaive sprites for collections of objects on shelfs.
```

## RX (    ) - Material Types
```
* (      ) - have a mType for containers that is the kind of material that container is made of ('cardboard', 'wood', 'bb', ect)
* (      ) - have an 'accepts' prop for containers that is the kind of material that it will except
* (      ) - make mType a BaseItem class prop
```

## RX (    ) - Improved Donators Spawn Rate
```
* (      ) - each new game day starts with an array of objects that are donator events
* (      ) - each donator event object will contain the game day time, and number of donators that will show up
* (      ) - a simular system should also be used for shoppers
```

## R3 (    ) - Inactive map updates
````
* (      ) - have a system for updating things like the number of donations and so forth for maps that are not active 
* (      ) - have workers always working even if they are not in the current map
* (      ) - have donator and shoper people types also continue to do what they do outside of active map
```

## R3 (    ) - People Data
```
* (      ) - people\_customers.json for hard coded data on each customer that can show up
* (      ) - people\_workers.json for all the workers that can show up
  MISC :
* (      ) - see about using 16 x 32 sprites for some tiles, else go with the idea of using another layer
```

## R2 (    ) - Game Day Time, Schedule system Color Tag System
``` 
  /lib/items.js :
* (      ) - have more than one household item
* (      ) - have it so that drops will pick one of a few household items each time

 /lib/people.js :
* (      ) - have a Person.setScheduledSubType method that will set the subtype of a person based on a timed schdedule

 /lib/schedule.js :
* (      ) - Start a lib that provides a system for the amount of real time a game day is.
* (      ) - have a single game day be 30 minutes ( for now )
* (      ) - have days of the week as part of the time system
* (      ) - have di disabled on Thursdays
* (      ) - color tag system built into schedule.js
* (      ) - schedule system for People class built into schedule.js
```

## R1 (    ) - Workers, Menu state started
```
  /sheets
* ( done ) - new sprites for shelfing
* (      ) - new sprites for workers

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
* (      ) - have a transparent background for the text display

  /states/menu.js :
* ( done ) - start a menu state
* ( done ) - have menu state show logo
* ( done ) - any key press or mouse click will result in mapview state starting.

* /states/reuse.js :
* ( done ) - delete old reuse state in favor of newer mapview.js that replaces it

  /lib/items.js :
* ( done ) - have a BaseItem.setPrice method
* ( done ) - all priced items can be color code 0 'white tag' for now

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
* ( done ) - fix bug that happens when a player enters a door
* (      ) - donations should be placed on the table by the donators
* (      ) - the player should not be able to place items on top of walls
* (      ) - the player should only be able to pick up items that are in range
* (      ) - the player should only be able to drop items in range
* (      ) - many enter and exit locations for donators in map4
* (      ) - have at one worker automate work at di
* (      ) - have one worker automate pricing and stocking

  /sheets
* ( done ) - menu_1.png sheet started with FLR logo

  / :
* ( done ) - favicon.ico

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
