# Phaser Finger Lakes Reuse

## R2 ( ) - New Map System
```
* () work on map system draft, get it solid.
```

## R2 ( ) - Items Database
```
  ITEMS MIN DATA STORED:
* (    ) - work out a system where min data is stored in place of sprites for everything \( item_key, set price \)
* (    ) - use min data in the process of creating the sprite again when needed
* (    ) - work out a system where we have repersentaive sprites for collections of objects on shelfs.
```


## R1 ( ) - Workers

```
  WORKERS:
* (      ) - have a worker type of People class
* (      ) - have an'employee' subclass for workers
* (      ) - have at least 4 workers for now

  ONE CUSTOMERS/WORKERS FOR EACH MAP 
* (      ) -  have a workers and customers people class for each map
* (      ) -  have it so that customers can move from one map to another 
* (      ) -  have workers always working even if they are not in the current map

  MISC:
* (      ) - revisit collision detection
* (      ) - see about having a currentWorker propery for the player object that is the current worker that the player is playing as
* (      ) - can switch between workers
* (      ) - new worker sprites, have one for each worker
* (      ) - people_workers.json for data on each worker
* (      ) - people_customers.json for data on each customers
* (      ) - see about getting map.setCollisionByExclusion to work without problem
* (      ) - use the reUse data manager for keys like playerX and so forth
* (      ) - getPeopleType helper in people.js
* (      ) - see about using 16 x 32 sprites for some tiles, else go with the idea of using another layer
* (      ) - new path processing code that allows for smooth, and fast player movement.
* (      ) - smoother transitions between maps
* (      ) - failsafe for getting stuck in a wall for people in general, including coworkers
* (      ) - have a Person.drop method that will drop what the person has onHand
* (      ) - In the event that there are tables near by the drop method will place them there
```

## R0 ( ) - People, Items Database, Donations 

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

  MOVE ITEMS BETWEEN CONTAINERS:
* (      ) - get itemMode 3 working
* (      ) - get itemMode 1 working with containers that have contents
* (      ) - get itemMode 1 working with stand alone items
* (      ) - have it so that the player can move a blue bin to a whole other map
* (      ) - have a supply of empty blue bins in map1
* (      ) - have more than one household item, and use the key names when cretaing

  PRICING ITEMS :
* (      ) - Have an area where the player can price an item

  STOCKING:
* (      ) - The player can place an item in an area where a shopper can see it

  SHOPERS:
* (      ) - shopers can see find items
* (      ) - shopers can pull items into there on hand collection
* (      ) - shopers can buy items
* (      ) - money displayed

  MISC:
* (      ) - fix frame names for containers to frameEmpty, frameStuff, frameFull
* (      ) - donations should be placed on the table by the donators
* (      ) - many enter and exit locations for donators in map4
* (      ) - somehow donators are getting stuck in walls, have a way to detect this and adress it by destroying or relocating
* (      ) - favicon
```
