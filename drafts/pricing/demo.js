

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
    return pricing_systems.hard_coded.half_retail( pricing, item, item_rec, unit_rec );
};

/********* **********
 PRICING CLASS
********** *********/

class Pricing {

    constructor ( opt= {} ) {
        this.system = opt.system || 'hard_coded';        // The pricing system to use
        this.key_method = opt.key_method || 'half_retail';   // The method to use in the current system
        this.db_item = opt.db_item || null;
        this.db_unit_price = opt.db_unit_price || null;
    }
    
    round (price) {
        const options = [
            0.10, 0.25, 0.50, 0.75,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
            100, 125, 150, 175,
            200, 225, 250, 275,
            300, 325, 350, 375,
            400, 425, 450, 500
        ];
        let i = 0;
        const len = options.length;
        let num = options[ len - 1 ];
        while(i < len){
            const opt = options[i]
            if(price <= opt){
                num = opt;
                break;
            }
            i += 1;
        }
        return num;
    }
    
    priceItem (item = {}) {
        const method = pricing_systems[ this.system ].get_method( this );
        const price = {
            item: item,
            item_rec: null,
            unit_rec: null,
            raw :   0,                 // raw price
            final : 0,                 // actual final price
            disp : '$0.00',            // display price
            color: null,               // a color tag color?
            valueOf : function(){
                return parseFloat(this.final);
            },
            toString : function(){
                return this.disp;
            }
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
        price.disp = '$' + price.final.toFixed(2);
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
        unit_price: { key: 'mug', count: 1 }
    },
    // https://www.target.com/p/20pc-flatware-set-silver-room-essentials-8482/-/A-82304741
    // 20pc Flatware Set Silver - Room Essentials™: Stainless Steel Silverware Set, Service for 4, Includes Forks, Spoons, Knives
    // $15.00
    flatware_set_room_essentials : {
        key: 'flatware_set_room_essentials',
        retail : 15, year: 2025,
        unit_price: { key: 'cutlery', count: 20 }
    },
    fork_plain : {
        key: 'fork_plain',
        retail : 0.75, year: 2025,
        unit_price: { key: 'cutlery', count: 1 }
    },
    tv_crt_rca13y1950 : {
        key: 'tv_crt_rca13y1950',
        retail : 300.00, year: 1950,
        unit_price: null
    },
};

/********* **********
GEN ITEM
********** *********/

const gen_item = () => {
    //const item_rec = db_item.mug_white;
    
    const options = Object.keys(db_item);
    const item_rec = db_item[ options[ Math.floor( options.length  * Math.random() ) ] ]
    
    const item = Object.assign({  }, item_rec);
    return item;
};

/********* **********
EXAMPLE
********** *********/

class Example extends Phaser.Scene {

    item = null
    t = 0
    
    constructor (config) {
        super(config);
        this.key = 'Example';
    }
    
    create () {
        const pricing_unit = new Pricing({
            system: 'hard_coded',
            key_method : 'unit_check', //'half_retail', 
            db_item : db_item,
            db_unit_price : db_unit_price
        });
        const pricing_half = new Pricing({
            system: 'hard_coded',
            key_method : 'half_retail', 
            db_item : db_item,
            db_unit_price : db_unit_price
        });
        this.registry.set('pricing1', pricing_unit);
        this.registry.set('pricing2', pricing_half);

        this.item = gen_item();
        
        this.item_disp1 = this.add.text(10, 50, '');
        this.item_disp2 = this.add.text(10, 150, '');
    }
    
    getInfo (item, key_pricing='pricing1') {
        const pricing = this.registry.get(key_pricing);
        const price = pricing.priceItem( item );
        return 'item key: ' + item.key + '\n' + 
        'price: ' + price.toString() + '\n' + 
        '( by ' + pricing.key_method + ' method of the ' + pricing.system + ' pricing system )'; 
    
    }
    
    update (time, delta) {
        this.t += delta;
        if(this.t >= 300){
            this.t %= 300;
            this.item = gen_item();
        }
        this.item_disp1.text = this.getInfo(this.item, 'pricing1');
        this.item_disp2.text = this.getInfo(this.item, 'pricing2');

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


