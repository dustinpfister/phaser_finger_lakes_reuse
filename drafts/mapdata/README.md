# mapdata draft

This is a draft where I am testing out my 'mapdata' lib which is the current map system that is being used in the game as of R5. This system works by having a collection of MapData class instances that is also a class of sorts called MapDataCollection, or 'mdc' for short. At any given moment there is a single MapData instance that is the active map, this will be the map that is currently viewed. In the game there is also the map view state, but with this draft I am directly working with the lib alone, aside from some other needed assets such as the people lib.

