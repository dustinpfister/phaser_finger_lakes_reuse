
class Demo extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Demo';
    }
    

    create () {
      
    }
    
}


const config = {
    canvas: document.getElementById('page_canvas'),
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: '#afafaf',
    scene: Demo,
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


