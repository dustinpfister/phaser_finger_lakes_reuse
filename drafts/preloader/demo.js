

class Demo extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Demo';
    }
    

    create () {
    
    }
    
    update () {
    
    }
    
}

class Loader extends Phaser.Scene {

    preload(){
    
        //this.load.setBaseURL('../../');
        this.load.setBaseURL('/');    
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        //this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16_atlas.json');
        //this.load.atlas('donations_16_16', 'sheets/donations_16_16.png', 'sheets/donations_16_16_atlas.json');
        
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

    constructor (config) {
        super(config);
        this.key = 'Loader';
    }
    

    create () {
    
        this.scene.add('Demo', Demo, false);
        
        this.scene.start('Demo');
      
    }
    
}


const config = {
    type: Phaser.WEBGL,
    parent: 'container_flr',
    canvas: document.querySelector('#canvas_flr'),
    width: 640,
    height: 480,
    backgroundColor: '#afafaf',
    scene: Loader,
    zoom: 1,
    render: { pixelArt: true  },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x:0 }
        }
    }
};
const demo = new Phaser.Game(config);


