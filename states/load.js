class Load extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Load';
    }

    preload(){
    
        this.load.setBaseURL('./');
               
        this.load.plugin('PathFinderPlugin', 'plugins/pathfinding.js', false);
        this.load.plugin('PeoplePlugin', 'plugins/people.js', false);
        //this.load.plugin('DonationsPlugin', 'plugins/donations.js', false);
                
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16_atlas.json');
        
        this.load.json('map1_data', 'maps/map1_data.json');
        this.load.tilemapCSV('map1', 'maps/map1.csv');
        this.load.json('map2_data', 'maps/map2_data.json');
        this.load.tilemapCSV('map2', 'maps/map2.csv');
        this.load.json('map3_data', 'maps/map3_data.json');
        this.load.tilemapCSV('map3', 'maps/map3.csv');
        this.load.json('map4_data', 'maps/map4_data.json');
        this.load.tilemapCSV('map4', 'maps/map4.csv');
        
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

