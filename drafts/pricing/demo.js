
class PricingMethod {

    constructor ( opt= {} ) {
        opt = Object.assign({}, {
            desc: 'half_retail',
            getPrice : function(pm, item, item_data){
                return item_data.retail / 2 * item.condition;
        
            }
        }, opt);
        this.desc = opt.desc;
        this.getPrice = opt.getPrice;
        
    }
    
    
};


class Example extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Example';
    }
    
    create () {
    
    }
    
    update () {
    
    }
    
}

const config = {
    type: Phaser.WEBGL,
    parent: 'container_flr',
    canvas: document.querySelector('#canvas_flr'),
    width: 640,
    height: 480,
    backgroundColor: '#afafaf',
    scene: Example,
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


