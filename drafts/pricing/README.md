# Pricing Draft

At Reuse one of the major things that comes up in discussions with coworkers is second hand donation item pricing methodology. There are a lot of factors to take into account when it comes to pricing a second hand item, such as the original retail value, how old it is, the condition and so forth. So there is a need to make a system, or collection of systems to help with the process of pricing items.

## 1.0 - Overview of the Complexly of the Situation

In order to work out a good system for this kind of thing it might be best to go over a few things to outline just how complex this problem is, and thus why a complex system is needed to help address a complex problem.

### 1.1 - The half of retail method, and its many flaws

When many of us start working we are often told that the general rule of thumb is to just price things at about half the retail value, or lower depending on the condition of the item. Most of the time this kind of easy to follow pricing methodology will work just fine, but in other cases it is a gross oversimplification of a complex problem. Often going by the half of retail method will still result in the item sitting on the floor for way to long, and thus we have to go with a kind of 1/4th or even 1/10th of the retail price method. Also what about vintage items from say the 1950's, do you go by half the original retail price from then? Of course Not! When it comes to vintage items we often go by a method that can be described as a "How many times the original retail value" kind of method.

### 1.2 - Exotic Furniture Items, and Typical Reuse Clientele

One example where the half of retail value method fails badly is with the occasional Furniture item that goes for well over a thousand Dollars at retail. It is rare that we get these kinds of items, never the less they come in now and then. Say a chair comes in that does very much retail for $1,500 comes in, and it is a condition that more or less passes as new. Does one then price it for $750 as stipulated by way of the half retail method? In a way I guess one is not wrong in doing so. However the kind of person that would spend that much money on a chair would rarely if ever visit reuse. Thus the typical situation is that an item like this will sit on the floor for a full six weeks, at which point it will get priced down by way of the cull process. It will then eventual sell of course, but often at a price much lower, and all the while this Item takes up precious floor space.

### 1.3 - CRT Televisions, Inventory Count, Retro Gaming, and E-bay Resellers

When I first started pricing electronics at reuse I would slap a $3 price tag on CRT Television sets, going by a kind of pricing methodology that is based on a kind of attitude where I viewed CRT TV’s as a kind of functioning e-waste. That is that I would price them very low in the hope that someone would buy them and get them out of the store, betting that it would be faster compared to waiting for 'Sunnking' to come to pick up our e-waste. 

Who in their right mind would want to buy a CRT this day in age? I would think to myself. However one day a coworker of mine decided to price a CRT at a whopping 30 bucks! I did not laugh at them for it, as I was curious if it would sell as a price that is ten times that of what I usual price it at. As a result it turns out that there are a lot of people in the world that are in the market to buy a CRT, and I think one of the main driving reasons why is a renewed, and growing interest in retro console video games systems. Another driving factor to this might be e-bay resellers that are looking to buy one to turn around and resell to buyers of CRTS online, and for Prices much higher than what we can typically get locally.

One major Problem with CRT’s is that they are heavy, and also take up a bit of volume as well. However this can be addressed by just taking a quick inventory of how many we have in stock at the moment. If we have say 5 or so, maybe price them cheeper than usual. If there are currently zero, maybe price them closer to whatever the maximum that market will bare.

Speaking about the maximum that market will bare, I am seeing some CTR’s go for as much as $200, and even higher depending on various factors on Ebay. One factor that comes up is typical of most second hand items which is of course when was it made. That is that a Functioning CRT from early turn of the millennium is not the same thing as a functioning CRT from the early 1970’s. What is not typical of most items is the question of having an integrated VCR in it. If that is the case does the TV work but not the VCR? Does both the TV and VCR work, if so even if it is a late model CTR it might sell for the same amount of money as a CRT from the 1970’s as that is very much a sought out feature in these. When it comes to very old CTRS form the 60’s and 70’s, even if they do not work, they go for a lot.

RCA   14-S-7071G – 1957 -  $1,350.00

## 2.0 - A Pricing Class

A number of Ideas come to mind for working out solutions for a Pricing system. One idea is to actually Develop my own Programming language to aid in the process of authoring pricing methodologies. That might prove to be to hard for many co-works to use though, so then yet another idea is to work out some kind of visual programming solution. In any case I think that I will need a main, common, Pricing class that will work with whatever system is used to generate a final produce that is the pricing method.

With that said I have started out with something like this:

```js
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
```

I think I am on the right track at least, however maybe a better way is to just have a collection of pricing functions. For starters there can just be hard coded pricing functions, built into the actually logic of the game. However the additional pricing systems would be just to allow for users to generate there own pricing functions. So regardless if the system is lexical, or visual, the final product should be a pricing function.










