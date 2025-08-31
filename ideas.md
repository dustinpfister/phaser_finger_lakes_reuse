# Ideas list

If I get an idea for the game, or some other future project based on the code I work out here, I will park it here. This way I am not polluting the main todo list with content that might not even make it into the game. Also it is a bit of a downer to see this long list of things to do that I might never get to.


# NEXT UP

These are revisions that are next in line to start working on in the main todo list. At this point things might change in terms of whats next, and things might be pulled out of this list completely.

## R12 (    ) - Save State Manager in menu state

```
Of course a save state manager is a must have feature to get in place if I ever exspect for this game to be a final project that anyone will want to play. On the main menu I will want the top button to be 'start new / continue button' that will start a new game if there is no save at all, or continue a given game state in the manager. The second menu button will then be where the player can switch to a view in which they can create, copy, and delete game saves. This Save State manager can then also be used to set what game save will be the default save to use when clicking continue.

Saving the game is somehting that should just happen automaticly as part of the game update.

```

## R11 (    ) - Worker Schedule Menu

```
I will want a menu that allows for a player to adjust when someone will come in to work. For now this just means what days that show up. Beond that I might want to also allow for a player to adjust the clock in and out times for the day. However much of the more advanced stuff can wate to an addtional future revision
```

## R10 (    ) - Higher, and Fire workers Menu

## R9 (    ) - Accounting

```
Time for a proper Accounting system for the game. The main reason why is becuase additional revisions coming up will involve changes like adding payroal and so forth, so I will want code to help provide all of that.
```

# General Tasks

These are general tasks I would like to complete when it comes to various side focus from what the main goal is with a given revision.

```
  /drafts :
    * (      ) - people draft : start a custom AI Script for the worker people type with ACTIONS and TASKS
    * (      ) - message_messpusher : demo new alpha effects    
  /css : 
    * ( ) - revisit setting canvas size with css, try out an approche with screen size rather than just orientation
  /lib/items :
    * (      ) - have more than one household item
    * (      ) - have it so that drops will pick one of a few household items each time
  /lib/mapdata :
    * (      ) - make it so that findEmptyDropSpot method will not return a position that is a wall tile
  /lib/message  :
    * (      ) - message_messpusher : have an alpha effect that is also based on distance
    * (      ) - message_messpusher : have an alpha effect that is effected by time and distance
    * (      ) - I would like another tool to help with debugging where I can display a current set of variables
    * (      ) - have a class that will be used for the game display ( for money, ect )
  /lib/people :
    * (      ) - general drop can be used to drop a specfic item, or array of items on hand  
  /lib/phaser :
    * (      ) - try upgrading from 3.87.0 to v3.90.0, if you run into problems fall back until the latest the works is found.
  /lib/ui :
    * (      ) - can change from a 'free' and 'follow' camera mode
    * (      ) - in 'free' camera mode the arrow keys can be used to move the camera
    * (      ) - in 'free' camera mode the number keys can be used to change active map
    * (      ) - in 'follow' mode the camera will follow a given person
    * (      ) - in 'follow' mode 'w' can be used to cycle following workers and 'c' can be used to cycle customers
  /maps :
    * (      ) - add grass tiles to map 4
  /states/mapview :
    * (      ) - make use of schedule.js to spawn in ( and out ) workers
  /sheets :
    * (      ) - new sprites for workers
    * (      ) - new tiles for outside such as grass, trees
```



## RX (    ) - So Many More!
```
    * Pricing Programing Language ( Vishual, langage, somehting gear to setting priceses)
    * 'eCenter' Processing task
    * 'electronics' Processing task
    * 'buildingMaterials' Processing Task
    * 'framnedArt' Processing tasks
    * Processing Sub Tasks!? such as Processing Household Rugs
    * The Comunity Space
    * Bathrooms, cleaning them
    * Speaking of Cleaning yes cleaning, the store and so forth.
    * MOD task
    * Person In Charge Situations (PIC)
    * Person Physics
    * Material Types ( carboard, wood, Metal, ect )
    * Metel Scrap
    * Recycling Dumpster
    * use Preloader Draft for main game
    * Rollup, creating builds
    * Dev dependencies ( automate, linting, formating, ect )
    * Unit Testing
    * Repersenative Sprites
    * People Data for setting values for Workers, Customers, ect
    * Accounting / payroal / grants
```

## RX (    ) - General Data Folder
```
As of this writing I was working on R8 and I moved a bunch of root folders into a single new root json folder. Although I think that 
was a good move when it comes to making things more organized, it might be even better to have a single general data rolder at root. 
I will then want to move everything that is just data, rather than code, into this new main data folder.
```


## RX (    ) - Options Menu

```
Having an options menu item in the menu state would be nice. This would contain settings that improve performance, as well as adjust sound if there is any sound to adjust.
```

## RX (    ) - Getting started with Sound

```
Sound is somehting that I might get to dead last once I have a solid over all game that is fun to play.
```

## RX (    ) - Furniture Processing, PickUp, and Delivery
```
A worker other than the player should now also be able to work 'furniture'.
```

## RX (    ) - Furniture
```
Start working on having Furniture type objects showing up in donations. For now the player can pick up furniture and
move it to the sales floor. Shopers can also buy them, but in a way that does not make sense as they will just do so 
like any other item such as a coffee mug. So it goes without saying that much more will need to be addressed in future revisions.
```

## RX (    ) - Trash, Dumpster
```
Sadly much of the donations that we receive at reuse can not be resold. As a result of this they must be thrown out.
```

## RX (    ) - Processing Household workers, cart containers.
```
At any moment there should be zero or more workers processing items thus the main focus with this revision is
to add a 'processingHousehold' task for workers. This kind of task will involve having a worker pick up items in
the household processing area, price it, and then place it into a cart type container. Speaking of which at this time
I think I should also add cart type containers.
```

## RX (    ) - Donation Peaks
```
I would like to have a system where the number of donation events over the course of day, and the distrabution of 
them per hour will wax and wain from one game day to the next.

  /drafts : 
    * (      ) - people draft : start to turn the main people draft into a mini shop of sorts
    * (      ) - new people_donators draft : The focus for this draft will be on donators only
    * (      ) - people_donators draft : display an hour by hour bar chart
```

<!-- 

 SIMULATION MODE IDEAS

-->

## RX (    ) - One key on hand action automation
```
I have keyboard shortcuts for setting what the item mode should be for the current worker, however it would also be nice 
to have a single key that is pressed to prefrom an "on hand action sugestion" the process of which is automated by code. 
The general idea is that a current tile location that is near the worker will be highligthed, and the sugested action 
displayed. A single key such as the 'a' key can then be pressed to set the item mode of the worker, and prefrom the action 
at the tile. If from some reason the player does not like the sugested action, the 's' key can then be used to 
prefrom a new sugestion. The end result is then a real easy way to play in which I can just move to a location, press a single key,
then move to another location, and press another.

```

## RX (    ) - Mini Game States, 'Cashier' and 'box_stack'
```
The idea here is that when the player works as a cashier, they can enter a 'Casher' state by going up to the reg
and preform some kind of action to enter the casher state, rather than mapView. This will then bring up a view that
will look just like the shopify app in one part of the screen. Another part of the screen will show a current item
that a customer would like to buy.

There should always be at least 1 or more workers that are engaged in the task of working as a cashier at bolt the T and R
maps of the game. The basic idea with this revision at least is to just get started with this kind of task. Thus the player
will likly not be able to work this kind of task for the moment.

```

