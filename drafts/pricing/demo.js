
const UnitPriceDB = {
    mug        : { price: 0.50, per: 'unit' },
    cutlery    : { price: 0.25, per: 'unit' },
    board_2_4  : { price: 0.10, per: 'LF' }
}

const ItemsDB = {
    // https://www.walmart.com/ip/ProSub-11oz-Premium-AAA-Ceramic-White-Sublimation-Mug-Blank/804306810
    // ProSub 11oz Premium AAA Ceramic White Sublimation Mug Blank
    // $3.95
    mug_white : {
        retail : 3.95,
        year: 2025,
        unit_price: {
           key: 'mug',
           count: 1
        }
    },
    // https://www.target.com/p/20pc-flatware-set-silver-room-essentials-8482/-/A-82304741
    // 20pc Flatware Set Silver - Room Essentials™: Stainless Steel Silverware Set, Service for 4, Includes Forks, Spoons, Knives
    // $15.00
    flatware_set_room_essentials : {
        retail : 15,
        year: 2025,
        unit_price: {
           key: 'cutlery',
           count: 20
        }
    },
    fork_plain : {
        retail : 0.75,
        year: 2025,
        unit_price: {
           key: 'cutlery',
           count: 1
        }
    }
}

const PricingSystems = {};

PricingSystems.hard_coded = {
    half_retail : ( itemData, unitRec, next ) => {
        return itemData.retail * 0.50;
    },
    unit_check : ( itemData, unitRec, next ) => {
        if( unitRec ){
            return unitRec.price * itemData.unit_price.value;
        }
        return next;
    }
}

class Pricing {

    constructor ( opt= {} ) {
        this.system = 'hard_coded'; // the pricing system to use
        
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


