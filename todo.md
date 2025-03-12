# Phaser Finger Lakes Reuse

## R1 ( ) - Processing plugin, Workers

```
* (      ) - revisit collision detection
* (      ) - expand people.js with 
* (      ) - have a worker type of People class
* (      ) - have 'employee', and 'mod' sub type workers
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
```

## R0 ( ) - Customers, Donations plugin, items database, inventory 

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

  DONATIONS, ITEMS DATABASE, INVENTORY:
* (      ) - I will need to have a count of total items at the tables, and have donations stop when they are full ( for now ) 
* (      ) - just household type items ( for now )
* (      ) - the player can place the item into a households bin, or gayload
* (      ) - donation items magically move into bins and gayloards at a slow rate ( for now )
* (      ) - donation items magically move from households bins, and gayloads into inventory ( for now )
* (      ) - customers just magically buy inventory items ( for now )

  ARTWORK:
* (      ) - have shelfing tiles
* (      ) - have more tiles for items

  MISC:
* (      ) - many enter and exit locations for donators in map4
* (      ) - somehow donators are getting stuck in walls, have a way to detect this and adress it by destroying or relocating
* (      ) - favicon
```
