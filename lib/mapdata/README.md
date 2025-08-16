# MapData Lib

This is what I have for the Main Map System for Finger Lakes Reuse that is composed of a MapData Class, and also a main MapDataCollection Class that is used to manage a collection of MapData Instances. Sense a MapData instance does not just consist of a map, but also what is in the map, this lib also depends on people.js, and items.js.

## How to Define a Map

A map is composed of both a csv, and json file, where the csv file is used to set what the tile index is for each cell in a map, and then the json file is used to define everything else about the map.

##

```js
import { MapLoader } from '../lib/mapdata/mapdata.js';

class Load extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Load';
    }

    preload(){
        this.load.setBaseURL('./');

        this.load.image('map_16_16', 'sheets/map_16_16.png');
        this.load.atlas('menu_1', 'sheets/menu_1.png', 'sheets/menu_1.json');
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16.json');
        this.load.atlas('donations_16_16', 'sheets/donations_16_16.png', 'sheets/donations_16_16.json');

        // MAP DATA
        MapLoader({
          scene: this,
          urlBase: 'maps/', //'drafts/mapdata/',
          mapIndicesStart: 1, mapIndicesStop: 5
        });
    }
    
    create(){
    
    }
};

```

## Create a MDC

```js
    import { MapData, MapDataCollection, MapLoader } from '../lib/mapdata/mapdata.js';
    const start_map_index = 4;
    const mdc = new MapDataCollection(this, { startMapIndex: start_map_index });
    this.registry.set('mdc', mdc);
```
