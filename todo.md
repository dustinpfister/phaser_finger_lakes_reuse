# Phaser Finger Lakes Reuse

## R1 ( ) - Processing plugin, Workers

```
* (      ) - expand people.js with 
* (      ) - have 'employee', and 'mod' type workers
* (      ) - see about having a currentWorker propery for the player object that is the current worker that the player is playing as
* (      ) - can switch between workers
* (      ) - new worker sprites, have one for each worker
* (      ) - people_workers.json for data on each worker
* (      ) - people_customers.json for data on each customers
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


  DONATIONS, ITEMS DATABASE, INVENTORY: 
* (      ) - customers just magically buy inventory items
* (      ) - start an Item Database in the form one JSON file ( for now )
* (      ) - have an onhand property that is what a Person has in there posission.
* (      ) - just household type items ( for now )
* (      ) - the player can place the item into a households bin, or gayload
* (      ) - donation items magically move into bins and gayloards at a slow rate ( for now )
* (      ) - donation items magically move from households bins, and gayloads into inventory ( for now )
* (      ) - start an inventory plugin

 MISC:
* (      ) - use the reUse data manager for keys like playerX and so forth
* (      ) - see about using 16 x 32 sprites for some tiles, else go with the idea of using another layer
* (      ) - favicon
```
