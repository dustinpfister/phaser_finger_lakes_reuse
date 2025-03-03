(function(){

    const root = this;


    class DonationsPlugin extends Phaser.Plugins.BasePlugin {
        constructor (pluginManager) {
            super(pluginManager);
            
            
            
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

