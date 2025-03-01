(function(){

    const root = this;


    class DonationsPlugin extends Phaser.Plugins.BasePlugin {
        constructor (pluginManager) {
            super(pluginManager);
            
            const People = pluginManager.get('PeoplePlugin').People;
            
            
            
            this.donators = new People({
                scene: this.game.scene.keys.Reuse,
                defaultKey: 'people_16_16',
                frame: 'pl_down',
                maxSize: 20,
                createCallback : (person) => {
                    //person.depth = 2;
                    person.body.setDrag(500, 500);
                    //person.setData({ path:[], hits: 0, idleTime: 0 })                 
                }
            });
           
            //this.donators.get(0,0)
            
            
            
            
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

