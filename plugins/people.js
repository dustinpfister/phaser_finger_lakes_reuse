(function(){

    const root = this;
    
    class Person extends Phaser.Physics.Arcade.Sprite {
    
        constructor (scene, x, y, texture, frame) {
            super(scene, x, y, texture, frame);
            scene.add.existing(this);
            scene.physics.add.existing(this);
            this.setCollideWorldBounds(true);
            this.depth = 2;
            this.setData({ path: [], hits: 0, idleTime: 0 });
        }
        
        offTileCheck (map, layer = 0) {
            const sprite = this;
            const tx = ( sprite.x - 8 ) / 16;
            const ty = ( sprite.y - 8 ) / 16;
            const TX = Math.floor(tx);
            const TY = Math.floor(ty);
            let t = sprite.getData('idleTime');
            t += 1;
            if( t >= 50){
                t = 0;
                const t4 = map.getTileAt(TX, TY, true, layer);
                const t5 = map.getTileAt(TX + 1, TY, true, layer);
                const t7 = map.getTileAt(TX, TY + 1, true, layer);
                const fx = tx - Math.floor(tx);
                const fy = ty - Math.floor(ty);
                if( fx < 0.50 && t4.index === 1 ){ sprite.x = t4.x * 16 + 8; }
                if( fx >= 0.50 && t5.index === 1 ){ sprite.x = t5.x * 16 + 8; }
                if( fy < 0.50 && t4.index === 1 ){ sprite.y = t4.y * 16 + 8; }
                if( fy >= 0.50 && t7.index === 1 ){ sprite.y = t7.y * 16 + 8; }
            }
            sprite.setData('idleTime', t);
        }
        
        setRandomPath (scene) {
        
            scene.map.setLayer(0);
            const walkable = scene.map.filterTiles((tile)=>{
                return tile.index === 1
            });
            const tile = walkable[ Math.floor( walkable.length * Math.random() ) ];
            this.setPath(scene, tile.x, tile.y);
        }
        
        setPath (scene, tx=2, ty=2) {
            const pathFinder = scene.plugins.get('PathFinderPlugin');
            const map = scene.map;
            const sprite = this;
            pathFinder.setGrid(map.layers[0].data, [1]);
            pathFinder.setCallbackFunction( (path) => { 
                path = path || [];
                sprite.setData({ path: path }) 
            });
            const stx = Math.floor( sprite.x / 16 );
            const sty = Math.floor( sprite.y / 16 );
            pathFinder.preparePathCalculation([stx, sty], [tx, ty]);
            pathFinder.calculatePath();
        }
        
        
    }
    

    class People extends Phaser.Physics.Arcade.Group {
    
        constructor (config) {
            config = config || {};
            config.classType = Person;
            
            
            const scene = config.scene
            const world = scene.physics.world;
            super(world, scene, config);
        }

        update (scene) {
        
        
        }

    }

    class PeoplePlugin extends Phaser.Plugins.BasePlugin {
        constructor (pluginManager) {
            super(pluginManager);
            
            
            this.People = People;
            this.Person = Person;
        } 
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PeoplePlugin;
        }
        exports.PeoplePlugin = PeoplePlugin;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('PeoplePlugin', (function() { return root.PeoplePlugin = PeoplePlugin; })() );
    } else {
        root.PeoplePlugin = PeoplePlugin;
    }

    return PeoplePlugin;
}).call(this);

