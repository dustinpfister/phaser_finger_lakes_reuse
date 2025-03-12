(function(){

    const root = this;
    
    class Item extends Phaser.GameObjects.Sprite {
    
        constructor (scene, data, x=-1, y=-1) {
            super(scene, x, y, 'donations_16_16', 'bx_close')
            this.desc = data.desc;
            this.value = data.value;
            this.depth = 3;
            scene.add.existing(this);
        }

    }


    class ItemsPlugin extends Phaser.Plugins.BasePlugin {
    
        constructor (pluginManager) {
            super(pluginManager);  
        }
        
        createItem ( scene, data, x, y ) {
        
            return new Item(scene, data, x, y);
        
        }
         
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = ItemsPlugin;
        }
        exports.ItemsPlugin = ItemsPlugin;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('ItemsPlugin', (function() { return root.ItemsPlugin = ItemsPlugin; })() );
    } else {
        root.ItemsPlugin = ItemsPlugin;
    }

    return ItemsPlugin;
}).call(this);

