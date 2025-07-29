

const pricing_systems = {};

/********* **********
HARD CODED PRICING
********** *********/
pricing_systems.hard_coded = {};

pricing_systems.hard_coded.get_method = function( pricing ){
    return pricing_systems.hard_coded[ pricing.key_method ];
};

pricing_systems.hard_coded.half_retail = ( pricing, item, item_rec, unit_rec ) => {
    return item_rec.retail * 0.50;
};
    
pricing_systems.hard_coded.unit_check = ( pricing, item, item_rec, unit_rec ) => {
    if( unit_rec ){
        return unit_rec.price * item.unit_price.count;
    }
    return PricingSystems.hard_coded( item, itemRec, unitRec );
};

/********* **********
 PRICING CLASS
********** *********/

class Pricing {

    constructor ( opt= {} ) {
        this.system = 'hard_coded';        // The pricing system to use
        this.key_method = 'half_retail';   // The method to use in the current system
        this.db_item = opt.db_item || null;
        this.db_unit_price = opt.db_unit_price || null;
    }
    
    round (price) {
    
    
    
    
        return parseFloat( price ).toFixed( 2 );
    }
    
    priceItem (item = {}) {
        const method = pricing_systems[ this.system ].get_method( this );
        
        const price = {
            item: item,
            item_rec: null,
            unit_rec: null,
            raw :   0,                // raw price
            final : 0,                // actual final price
            color: null               // a color tag color?
        };
        
        if(!this.db_item){
            console.warn('No item data base!');
            return price;
        }
        if(this.db_item){
            price.item_rec = this.db_item[ item.key ]
        }
        if( item.unit_price && this.db_unit_price && this.db_item ){
            price.unit_rec = this.db_unit_price[ item.unit_price.key  ];
        }
        price.raw = method(this, item, price.item_rec, price.unit_rec);
        price.final = this.round( price.raw );
        return price
    
    }
    
    
};

/********* **********
UNIT PRICE DATABASE
********** *********/

const db_unit_price = {
    mug        : { price: 0.50, per: 'unit' },
    cutlery    : { price: 0.25, per: 'unit' },
    board_2_4  : { price: 0.10, per: 'LF' }
};

/********* **********
ITEMS DATABASE
********** *********/

const db_item = {
    // https://www.walmart.com/ip/ProSub-11oz-Premium-AAA-Ceramic-White-Sublimation-Mug-Blank/804306810
    // ProSub 11oz Premium AAA Ceramic White Sublimation Mug Blank
    // $3.95
    mug_white : {
        key: 'mug_white',
        retail : 3.95, year: 2025,
        unit_price: { key: 'mug', count: 1, set: false }
    },
    // https://www.target.com/p/20pc-flatware-set-silver-room-essentials-8482/-/A-82304741
    // 20pc Flatware Set Silver - Room Essentials™: Stainless Steel Silverware Set, Service for 4, Includes Forks, Spoons, Knives
    // $15.00
    flatware_set_room_essentials : {
        key: 'flatware_set_room_essentials',
        retail : 15, year: 2025,
        unit_price: { key: 'cutlery', count: 20, set: true }
    },
    fork_plain : {
        key: 'fork_plain',
        retail : 0.75, year: 2025,
        unit_price: { key: 'cutlery', count: 1, set: false }
    }
};

const gen_item = () => {
    const item_rec = db_item.mug_white;
    const item = Object.assign({  }, item_rec);
    
    return item;
};

class Example extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Example';
    }
    
    create () {
    
        const pricing = new Pricing({
            db_item : db_item,
            db_unit_price : db_unit_price
        });
        this.registry.set('pricing', pricing);
        
        const item = gen_item()
        
        console.log( pricing.priceItem( item ) ) 
    
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


