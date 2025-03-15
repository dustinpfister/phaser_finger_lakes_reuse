class Load extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Load';
    }

    preload(){
    
        console.log('Loading...');
    
        this.load.setBaseURL('./');
               
        this.load.plugin('PathFinderPlugin', 'plugins/pathfinding.js', false);
        this.load.plugin('PeoplePlugin', 'plugins/people.js', false);
        this.load.plugin('ItemsPlugin', 'plugins/items.js', false);
        //this.load.plugin('DonationsPlugin', 'plugins/donations.js', false);
                
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16_atlas.json');
        this.load.atlas('donations_16_16', 'sheets/donations_16_16.png', 'sheets/donations_16_16_atlas.json');
        
        
        
        const reg = this.game.registry;
        
        let i_map = 1;
        while(i_map <= 4){
        
            reg.set('map_items' + i_map, []);
        
            console.log(i_map)
            
            
        
            this.load.json('map' + i_map + '_data', 'maps/map' + i_map + '_data.json');
            this.load.tilemapCSV('map' + i_map, 'maps/map' + i_map + '.csv');
        
            i_map += 1;
        }
        
        console.log(reg.list);
        
        this.load.json('household_1', 'items/household_1.json');
            
        const gr = this.add.graphics();
        
        gr.fillStyle(0x000000);
        gr.fillRect(0,0,640,480);
           
        this.load.on(Phaser.Loader.Events.PROGRESS, (progress) => {   
            gr.lineStyle(20, 0xffffff, 1);
            gr.beginPath();
            gr.arc(320, 240, 100, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(270 + 360 * progress), false);
            gr.strokePath();
        });
        
    }
    
    create () {
    
        const items = {};
    
    
        Object.assign(items, this.cache.json.get('household_' + 1) );
    
        this.registry.set('items', items);
        
        
    
        console.log( this );
    
        //this.scene.start('World');
        this.scene.start('Reuse');
              
    }

}

export {
    Load
}

