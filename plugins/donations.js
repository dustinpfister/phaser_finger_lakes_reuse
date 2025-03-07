(function(){

    const root = this;
    
    


    class DonationsPlugin extends Phaser.Plugins.BasePlugin {
        constructor (pluginManager) {
            super(pluginManager);
            
            console.log('this is donations!');
            
            let n = 1;
            
            const json = pluginManager.game.cache.json.get('household_' + n);      
            
            console.log(json);
            
        } 
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = DonationsPlugin;
        }
        exports.DonationsPlugin = DonationsPlugin;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('DonationsPlugin', (function() { return root.DonationsPlugin = DonationsPlugin; })() );
    } else {
        root.DonationsPlugin = DonationsPlugin;
    }

    return DonationsPlugin;
}).call(this);

