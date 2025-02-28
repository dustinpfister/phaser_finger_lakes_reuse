(function(){

    const root = this;
    
    class Person extends Phaser.Physics.Arcade.Sprite {
    
        constructor (scene, x, y, texture, frame) {
        
        
            super(scene, x, y, texture, frame);
            
            scene.add.existing(this);
            scene.physics.add.existing(this);
        
        
        }
        
        offTileCheck (map) {
        
            const sprite = this;
        
            const tx = ( sprite.x - 8 ) / 16;
            const ty = ( sprite.y - 8 ) / 16;
            const TX = Math.floor(tx);
            const TY = Math.floor(ty);
            let t = sprite.getData('idleTime');
            t += 1;
            if( t >= 50){
                t = 0;
                const t4 = map.getTileAt(TX, TY, 0);
                const t5 = map.getTileAt(TX + 1, TY, 0);
                const t7 = map.getTileAt(TX, TY + 1, 0);
                const fx = tx - Math.floor(tx);
                const fy = ty - Math.floor(ty);
                if(  fx < 0.50 && t4.index === 1 ){ sprite.x = t4.x * 16 + 8; }
                if( fx >= 0.50 && t5.index === 1 ){ sprite.x = t5.x * 16 + 8; }
                if( fy < 0.50 && t4.index === 1 ){ sprite.y = t4.y * 16 + 8; }
                if( fy >= 0.50 && t7.index === 1 ){ sprite.y = t7.y * 16 + 8; }
            }
            sprite.setData('idleTime', t);
        }
    
    }
    

    class People extends Phaser.Physics.Arcade.Group {
    
        constructor (config) {
        
            config = config || {};
            
            config.classType = Person; //Phaser.Physics.Arcade.Sprite;
            
            
        
            const scene = config.world;
            
            
            const world = config.world.scene.scene.physics.world;
            super(world, scene, config);
            
            
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

