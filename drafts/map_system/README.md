# map_system draft

This is the start of a new map system that I might at some point use in place of what I have for the moment if I ever get around to it. 

## Just a single map that is updated as needed

With the current map system (as of R5 at least ), there is a single active map at any given moment. When the player changes what the current worker is, or moves a currently controlled worker threw a doorway that in turn will change what the current active map is. The idea that I have with this map system though is to never have a single active map, but rather just a single map that is used period. It is then the state of this single map that will change depending on the current world map location that is being viewed.

## Just one map for viewing, but map map data objects

Although the idea is to just have one map game object for having a view, there will still be many map data objects. Also depending on the world map position there map be as many as four map data objects being used to create the current view. In addition to this there will also still be a whole world of map data objects all of which will need to be updated at some kind of frequency.

## People and items outside of the current map location

When it comes to updating Person instances, and other objects outside of the current world map view this will have to be done headless somehow. There are two general ideas with this one of which is to have another map that is used for 'headless' updates without showing anything on screen. The other way would be to just update Person behavior in a way that does not depend on knowing details about the map that would be needed for doing things like path detection.

### Update People without moving them around

It would be possible to work out some code that has to do with updating people without having to figure out details such as where are they in the map at this very moment and so forth. Rather just vague actions will be preformed such as this Person at this map index just bought this item at same said map index. If the intention is to make a very large game map, with lots of people, items, and so forth there is a certain point where this kind of system will have to be used anyway because it will just take way to much processing overhead to update everything on each tick like I do at the moment.

