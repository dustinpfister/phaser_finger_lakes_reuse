(function(){

    const root = this;
    
    class Person extends Phaser.Physics.Arcade.Sprite {
    
        constructor (scene, x, y, texture, frame) {
        
            super(scene, x, y, texture, frame);
        
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
            
            console.log('People');
            console.log(this);
            
            this.People = People;
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

