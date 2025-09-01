(function () {
   'use strict';

   /********* **********
    1.0) Message - const
   ********** *********/
   const COLORS = {
      SAY: 0x00ff00,
      INFO: 0x00ffff,
      DEBUG: 0xff0000
   };
   /********* **********
    2.0) ConsoleLogger class
   ********** *********/
   // it is a little tricky, but yes there is a way to call a Class instance as if it where a function
   // by extending the Core JS Function Class. Also must give credit where due with this so...
   // https://stackoverflow.com/questions/49279702/calling-class-instance-as-a-function-in-javascript
   class ConsoleLogger extends Function {

       constructor ( opt = {} ) {
           super("...args", "return this.called(...args)");
           this._pos = 0;
           this.id = opt.id || '';
           this.cat = opt.cat || '';
           this.appendID = !!opt.appendID ? false : true;
           const func = this.bind( this );     
           this.calls = 0;
           this.callMax = 1;
           return Object.assign(func, this);
       }
       
       condition ( test = function(){ return false } ) {
           if( test.call(this) ){
               this.called.apply(this, Array.from(arguments).slice(1, arguments.length) );
           }
       }
       
       once () {
           if( this.calls  < this.callMax){
               this.called.apply(this, arguments);
               this.calls += 1;
           }
       }
       
       reset( count = 0, max = 1 ) {
           this.calls = count;
           this.callMax = max;
       }
       
       getLineNumber () {
           try {
               throw Error('');
           } catch(err) {
               const patt = new RegExp(this.id + '\.js');
               let m = err.stack.match( patt );
               let dat = '';
               if(m){
                   dat = err.stack.substr(m.index, 100).split(')')[0].split(':');
               }
               return dat;    
           }
           return [];
       }
       
       called ( ) {
           const logger = this;
           const ln = logger.getLineNumber();      
           Array.from( arguments ).forEach(function ( arg )  {
               if( logger.appendID ){
                   console.log(logger.cat + '_' + logger.id + ' '+ ln[1] +':' + ln[2] + ' : ', arg );
               }
               if( !logger.appendID ){
                   console.log( arg );
               }
           });
       }
       
   }/********* **********
    3.0) Instance of ConsoleLogger for message.js
   ********** *********/
   new ConsoleLogger({
       id: 'message',
       cat: 'lib',
       appendId: true
   });
   /********* **********
    4.0) MessPusher class
   ********** *********/
   const pushLine = (mp, text='', type='SAY' ) => {
       if(mp.capsOnly){
           text = text.toUpperCase();
       }
       let i = mp.maxLines - 1;
       while(i > 0 ){
           const line = mp.lines[i];
           const lineUnder = mp.lines[i - 1];
           line.getData('t');
           line.setData('type', lineUnder.getData('type').toUpperCase() );
           line.text = lineUnder.text;
           line.setData('t', lineUnder.getData('t') );  
           i -= 1;
       }  
       const line0 = mp.lines[0];
       line0.setData('type', type.toUpperCase());
       line0.text = text;
       line0.setData('t', mp.maxT);
       line0.alpha = 1;
   };

   class MessPusher {

       constructor ( opt = { key: 'min_3px_5px', scene: null } ) {
           this.scene = opt.scene;
           this.key = opt.key;
           this.maxLines = opt.maxLines || 3;
           this.maxT = opt.maxT || 5000;
           this.lineHeight = opt.lineHeight || 12;
           this.capsOnly = opt.capsOnly || false;
           this.sx = opt.sx || 0;
           this.sy = opt.sy || 0;
           this.lines = [];
           let i = 0;
           while(i < this.maxLines ){
               const y = this.sy - this.lineHeight * i;
               const line = this.scene.add.bitmapText( this.sx, y, this.key, '');
               line.setScrollFactor(0, 0);
               line.depth = 7;   
               line.setData('type', 'INFO');
               line.setData('index', i);
               line.setData('t', 0);
               this.lines.push( line );
               i += 1;
           } 
       }

       push (text, type='say') {
           if( typeof text === 'string' ){
                   pushLine(this, type + ': ' + text, type);
           }
           if( typeof text === 'object' ){
               let i = 0, len = text.length;
               while(i < len){
                   if(i === 0){
                       pushLine(this, type + ': ', type);
                   }
                   let str = i + ' > ' + text[i];
                   pushLine(this, str, type);
                   i += 1;
               }
           }
       }
       
       update ( delta = 30 ) { 
           let i = 0;
           while(i < this.maxLines ){
               const line = this.lines[i];
               this.sy - this.lineHeight * i;
               line.setDropShadow(1, 1, 0x2a2a2a, 1);      
               const color = COLORS[ line.getData('type') ] || 0xffffff;
               line.setCharacterTint(0, line.text.length, true, color);     
               let t = line.getData('t');
               t -= delta;
               t = t < 0 ? 0 : t;     
               line.alpha = t / this.maxT;
               line.setData('t', t);
               i += 1;
           }
       }

   }
   /********* **********
    5.0) Debug Screen
   ********** *********/
   class DebugScreen extends Phaser.GameObjects.Image {
       constructor ( opt= {} ) { 
           opt = Object.assign( {}, {
               fontSize: 10, w:640, h: 480, x: 320, y: 240, d: 100, alpha: 0.75,
               active: false, lines_x: 10, lines2_x: 330
           }, opt );
           opt.texture = opt.scene.textures.createCanvas('debug_screen', opt.w, opt.h);
           super(opt.scene, opt.x, opt.y, 'debug_screen', 0);  
           this.setDepth(opt.d);
           this.setScrollFactor(0, 0);
           this.fontSize = opt.fontSize;
           this.font =  this.fontSize + 'px monospace';
           this.alpha = opt.alpha;
           this.desc = opt.desc || 'Debug Screen';
           opt.scene.add.existing(this);
           this.lines = opt.lines || ['foo', 'bar', 'baz'];
           this.lines2 = opt.lines2 || ['one', 'two', 'three'];
           this.lines_x = opt.lines_x;
           this.lines2_x = opt.lines2_x;
           this.active = opt.active;
           this.w = opt.w;
           this.h = opt.h;
           this.draw();
       }
       
       setActive (state=true){
           this.active = state;
           this.draw();
       }
       
       toggleActive () {
           this.active = !this.active;
           this.draw();
       }
       
       draw () {
           const ctx = this.texture.context;
           if(!this.active){
               ctx.clearRect(0,0,this.w, this.h);
           }
           if(this.active){
               ctx.fillStyle = 'rgba(0,0,0,' + this.alpha + ')';
               ctx.fillRect(0,0, this.w, this.h); 
               ctx.fillStyle = 'white';
               ctx.textBaseline = 'top';
               ctx.font = this.font;
               ctx.fillText(this.desc, 10, this.fontSize );
               const lines_x = this.lines_x;
               this.lines.forEach( (str, i) => {
                   const size = this.fontSize;
                   ctx.fillText(str, lines_x, size + size * ( i + 2 ) );
               });
               const lines2_x = this.lines2_x;
               this.lines2.forEach( (str, i) => {
                   const size = this.fontSize;
                   ctx.fillText(str, lines2_x, size + size * ( i + 2 ) );
               });
           }
           this.texture.refresh();
       }
       
   }

   const log$7 = new ConsoleLogger({
       cat: 'lib',
       id: 'items',
       appendId: true
   });

   const ItemTools = {};

   ItemTools.genIndex = (scene, file_names=[] ) => {
       const index = { files: [], items: {} };
       file_names.forEach( (fn, file_index) => {
           const items = scene.cache.json.get(fn).items;
           index.files[file_index] = fn;
           Object.keys(items).forEach( ( item_key ) => {
               index.items[item_key] = file_index;
           });
       });
       scene.registry.set('items_index', index);
   };


   /********* **********
   ITEMS ( BaseItem, Item, and Container Classes )
   ********** *********/

   const getItemData = (scene, key='hh_mug_1') => {
       const itemsIndex = scene.registry.get('items_index');
       const fi = itemsIndex.items[key];
       const fn = itemsIndex.files[fi];
       const data = scene.cache.json.get(fn);
       const item_data = data.items[key];
       if(typeof item_data.tile.sheet === 'number'){
           item_data.tile.sheet = data.header.sheets[ item_data.tile.sheet  ];
       }
       return Object.assign({}, item_data);
   };
       
   class BaseItem extends Phaser.GameObjects.Sprite {
       
       constructor (scene, key, x, y, sheet, frame) {
           super(scene, x, y, sheet, frame);
           this.iType = 'BaseItem';
           this.canGet = true;
           this.canSell = true;
           this.canRecyle = true;
           this.key = key;
           this.depth = 1;
           this.priced = false;
           this.droped = false;
           this.contents = [];
           this.drop_count = 0;
           this.canChildOnEmpty = true;
           this.desc = '';
           this.price = {
               color: null,
               departIndex: 0,
               shelf: 0,
               final: 0
           };
       }
       
       setPrice( shelf, color=0 ){
           this.price.color = color;
           this.price.shelf = shelf;
           const discount = 0;
           this.price.final = parseFloat( String( ( shelf * ( 1 - discount ) ).toFixed( 2 ) ) );
       }
       
       getTilePos () {    
           return {
               x : Math.floor( this.x / 16 ),
               y : Math.floor( this.y / 16 )
           }
       }
       
       isEmpty () {
           return this.drop_count <= 0 && this.contents.length === 0;
       }
           
   }
       
   class Item extends BaseItem {
       
       constructor (scene, key, opt={}, x=0, y=0) {
           const data = getItemData(scene, key );
           super(scene, key, x, y, data.tile.sheet, data.tile.frame);
           this.iType = 'Item';
           this.desc = data.desc;
           this.value = data.value;
           this.drop_count = data.drop_count || 0;
       }
               
   }
       
   class Container extends BaseItem {
       
       constructor (scene, key="blue_bin", opt={}, x=-1, y=-1) {
           const data = getItemData(scene, key );
           super(scene, key, x, y, data.tile.sheet, data.tile.frame);
           this.iType = 'Container';
           this.desc = data.desc;
           this.canChildOnEmpty = data.canChildOnEmpty;
           this.drop_count = data.drop_count || 0;
           this.capacity = data.capacity;
           this.autoCull = data.autoCull || false;
           this.canGet = data.canGet || false;
           this.canSell = data.canSell || false;
           this.canRecyle = data.canRecyle || false;
           this.contents = data.contents || [];
           this.prefix = data.tile.prefix;
           this.setFrame(this.prefix + '_close');
       }
           
       addItem (item) {
           if(item.iType === 'Container' && !item.canChildOnEmpty){
               log$7( 'This Container can not be a Child of another' );
               return false;
           }
           if(item.iType === 'Container' && item.canChildOnEmpty && (item.drop_count > 0 || item.contents.length > 0) ){
               log$7( 'can only child this Container when it is empty' );
               return false;
           }
           if(this.autoCull && this.contents.length >= this.capacity){
               const len = this.contents.length + 1 - this.capacity;
               this.contents.splice(this.capacity - 1, len);
           }
           if(this.contents.length < this.capacity){
               this.setFrame(this.prefix + '_stuff');
               item.x = this.x;
               item.y = this.y;
               const itemRec = {
                   key: item.key, iType : item.iType
               };
               this.contents.push(itemRec);
               item.destroy(true, true);
               return true;
           }
           return false;
       }
           
       spawnItem (scene) {
           let item_new = null;
           const conLen = this.contents.length;
           this.setFrame(this.prefix + '_close');  
           let drop_count = this.drop_count;
           if( drop_count === 0 && conLen > 0){
               const itemRec = this.contents.pop();
               this.setFrame(this.prefix + '_stuff');
                    
               if(itemRec.iType === 'Item'){
                   item_new = new Item(scene, itemRec.key, {}, 0, 0 );
               }
               if(itemRec.iType === 'Container'){
                   item_new = new Container(scene, itemRec.key, { drop_count: 0, contents: []}, 0, 0 );
               }
               scene.add.existing( item_new );
           }
           if( drop_count > 0 ){
               //this.setFrame('bx_full');
               this.setFrame(this.prefix + '_stuff');
               item_new = new Item(scene, 'hh_mug_1', {}, 0, 0 );   
               scene.add.existing( item_new );
               drop_count -= 1;
               this.drop_count = drop_count;
           }
           if(this.drop_count <= 0 && conLen <= 0){
               this.setFrame(this.prefix + '_empty');
           } 
           return item_new;
       }
           
   }

   class ItemCollection extends Phaser.GameObjects.Group {

       constructor (scene, opt) {
           super(scene, [], { maxSize: 40 });
       }
       
       getItemType ( iType='Item', canSell=false ){
           return this.getChildren().filter( (item) => {
               return item.canGet && canSell && item.iType === iType;
           });
       }
       
       getDrops () {
           return this.getChildren().filter( (item) => {
               return item.canGet && item.iType === 'Container' && item.drop_count > 0;
           });
       }
       
       getEmpties (canRecyle = true) {
           return this.getChildren().filter( (item) => {
               return item.iType === 'Container' && item.canGet && canRecyle === item.canRecyle && item.drop_count <= 0 && item.contents.length === 0;
           }); 
       }
   }

   const ACTIONS_CORE = {};
   ACTIONS_CORE.default = {
       init: function (mdc, md, people, scene, person) {},
       noPath: function (mdc, md, people, scene, person, opt) {}
   };
   ACTIONS_CORE.drop = {
       opt : {
           max_tiles: 8,
           count: 1,
           at: null,
           empty: [1]
       },
       init: function (mdc, md, people, scene, person, opt) {
           const onHand = person.getData('onHand');
           person.setData('itemMode', 2);
           if( onHand.length > 0 ){
               let i_item = onHand.length;
               let dc = 0;
               while(i_item-- && dc != opt.count ){
                   const item = onHand[i_item];    
                   let pos_drop = md.findEmptyDropSpot( person.getTilePos(), opt.max_tiles, opt.empty );
                   if(opt.at){
                       pos_drop = opt.at;
                   }         
                   if(pos_drop === null){
                       person.say('I can not find a space to drop items!');
                       this.setDone('no_space');
                   }
                   if(pos_drop != null){
                       if(pos_drop.iType === 'Container' && opt.at){
                           const pos = pos_drop.getTilePos();
                           people.onHandAction(scene, person, pos_drop, md, pos.x, pos.y);
                       }else {
                           item.x = pos_drop.x * 16 + 8;
                           item.y = pos_drop.y * 16 + 8;
                           item.droped = true;
                           mdc.addItemTo(item, md, 'donations');
                           people.onHand.remove(item);
                           person.setData('onHand', []);
                       }
                   }
               }
               this.setDone('items_droped');
           }
       }
   };
   ACTIONS_CORE.goto_map = {
       opt: {
           index: 1,
           pos: null
       },
       update: function (mdc, md, people, scene, person, opt) {
           const action = person.getData('act');
           person.getTilePos();
           if(md.index === opt.index){
               if(opt.pos){
                   person.setPath(scene, md, pos.x, pos.y);
               }
               action.setDone('at_map');
           }
       },
       noPath: function (mdc, md, people, scene, person, opt) {
           const pos1 = person.getTilePos();
           let door = md.getDoorAt(pos1.x, pos1.y);
           if(!door || (door && md.index != opt.index)){   
               const options = md.hardMapData.doors.map((door)=>{  return door.to.mapNum });
               const min = Math.min.apply(null, options);  
               const door_to_map = options.some(( mapNum )=>{ return mapNum === opt.index  });
               const to_map = door_to_map ? opt.index : min;
               let pos2 = md.findDoorFrom(pos1.x, pos1.y, to_map, false);
               if(pos2){
                   person.setPath(scene, md, pos2.x, pos2.y);
               }
           }
       }
   };
   ACTIONS_CORE.pickup = {
       opt : {
           container: false,
           canRecyle: false,
           min_dist: 2,
           max_items: 3,
           type: 'drop'
       },  
       init: function (mdc, md, people, scene, person, opt, delta) {
           person.setData('itemOfInterest', null);
       },    
       update: function (mdc, md, people, scene, person, opt, delta) {
           const oh = person.getData('onHand'), action = person.getData('act');
           if(oh.length >= opt.max_items){
               action.setDone('have_items');
               person.setData('path', []);    
           }
       },
       noPath : function(mdc, md, people, scene, person, opt){
           const action = person.getData('act');
           person.setData('itemMode', 1);
           if(opt.container){
               person.setData('itemMode', 3);
           }
           let ioi = person.getData('itemOfInterest');
           const oh = person.getData('onHand');
           person.getData('maxOnHand');
           if(!ioi && oh.length < opt.max_items){
               let items = [];
               if(opt.type === 'drop'){
                   items = md.donations.getDrops();
               }
               if(opt.type === 'empty'){
                   items = md.donations.getEmpties( opt.canRecyle );
               }
               if(items.length > 0){
                   ioi = items[0];
                   person.setData('itemOfInterest', ioi);
               }
               if(items.length === 0){
                   person.say('No Items to Pickup!');
                   action.setDone('no_items');
               }
           }
           if(!ioi && oh.length >= opt.max_items){
               console.log('so yes this is a condition that happens ');
           }
           if(ioi){
               const pos_item = ioi.getTilePos();
               const d = Phaser.Math.Distance.BetweenPoints(pos_item, person.getTilePos());
               if(d > opt.min_dist){
                   const tile = md.findWalkToNear(pos_item, 10);
                   if(tile){
                       person.setPath(scene, md, tile.x, tile.y);
                   }
                   if(!tile){
                       person.setDone('can_not_get_to');
                   }
               }
               if(d <= opt.min_dist && opt.type === 'drop'){
                   people.onHandAction(scene, person, ioi, md, pos_item.x, pos_item.y);
                   action.setDone('pickup_drop');
                   person.setData('itemOfInterest', null);
               }
               if(d <= opt.min_dist && opt.type === 'empty'){
                   people.onHandAction(scene, person, ioi, md, pos_item.x, pos_item.y);
                   action.setDone('pickup_empty');
                   person.setData('itemOfInterest', null);
               }       
           }
       }
   };
   ACTIONS_CORE.player_control = {
       init: function (mdc, md, people, scene, person) {}
   };
   ACTIONS_CORE.wonder = {
       opt: {
           next_spot: false,
           pause : 1200,
           t: 0,
           getOut : function(mdc, md, people, scene, person, opt){
               return false
           }
       },
       update: function (mdc, md, people, scene, person, opt, delta) {
           const action = person.getData('act');
           opt.t -= delta;
           opt.t = opt.t < 0 ? 0 : opt.t;
           if( opt.getOut(mdc, md, people, scene, person, opt) ){
               action.setDone('get_func_true');
           } 
       },
       noPath: function (mdc, md, people, scene, person, opt) {
           if(!opt.next_spot){
              opt.t = opt.pause;
              opt.next_spot = true;
           }
           if(opt.next_spot && opt.t === 0){
               const tile = md.getRandomWalkTo();
               person.setPath(scene, md, tile.x, tile.y);
               opt.next_spot = false;
           }
       }
   };

   const ACTIONS_WORKER_DI = {};

   const find_drop_spot = function(tile){
       const md = this, items = md.getItemsAtTile( tile ), item = items[0];
       if(item){
           return item.drop_count > 0;
       }
       return false;
   };
   ACTIONS_WORKER_DI.pickup_empty = {
       opt : {
           container: true,
           canRecyle: true,
           min_dist: 2,
           max_items: 1
       },  
       init: function (mdc, md, people, scene, person, opt, delta) {
           person.setData('itemOfInterest', null);
       },    
       update: function (mdc, md, people, scene, person, opt, delta) {
           const oh = person.getData('onHand'), action = person.getData('act');
           if(oh.length >= opt.max_items){
               action.setDone('have_items');
               person.setData('path', []);    
           }
       },
       noPath : function(mdc, md, people, scene, person, opt){
           const action = person.getData('act');
           let ioi = person.getData('itemOfInterest');
           const oh = person.getData('onHand');
           person.getData('maxOnHand');
           if(!ioi && oh.length < opt.max_items){
               const items = md.donations.getEmpties( opt.canRecyle );
               if(items.length > 0){
                   ioi = items[0];
                   person.setData('itemOfInterest', ioi);
               }
               if(items.length === 0){
                   action.setDone('no_items');
               }
           }
           if(ioi){
               const pos_item = ioi.getTilePos();
               const d = Phaser.Math.Distance.BetweenPoints(pos_item, person.getTilePos());
               if(d > opt.min_dist){
                   const tile = md.findWalkToNear(pos_item, 10);
                   if(tile){
                       person.setPath(scene, md, tile.x, tile.y);
                   }
                   if(!tile){
                       action.setDone('can_not_get_to');
                   }
               }
               if(d <= opt.min_dist ){
                   person.setData('itemMode', 3);
                   people.onHandAction(scene, person, ioi, md, pos_item.x, pos_item.y);
                   action.setDone('have_empty');
                   person.setData('itemOfInterest', null);
               }       
           }
       }
   };

   ACTIONS_WORKER_DI.pickup_drop = {
       opt: {
           near: {x: 35, y: 4}, limit: 50,
           type: 'drop', container: false, max_items: 1
       },
       update: function (mdc, md, people, scene, person, opt) {
           const oh = person.getData('onHand');
           if(md.index === 4 && oh.length === 0){
               const spot = md.findSpot(opt.near, find_drop_spot, opt.limit);
               if(spot){
                   people.setAction(scene, mdc, md, person, 'pickup', opt);
               }
               if(!spot){
                   this.setDone('no_empty_items');
               }
           }
       },
       noPath: function (mdc, md, people, scene, person, opt) {
           if(opt.spot);
       }
   };

   ACTIONS_WORKER_DI.worker_di_idle = {
       opt:{},
       update: function (mdc, md, people, scene, person, opt) {
           //const player = scene.registry.get('player');
           const oh = person.getData('onHand');
           if( md.index != 4 && oh.length === 0 ){
                this.setDone('empty_handed');
           }
           if( md.index != 4 && oh.length > 0 ){
                this.setDone('have_items');
           }
           if( md.index === 4  && oh.length === 0 ){
                this.setDone('idle_without_items');
           }
           if( md.index === 4  && oh.length > 0 ){
                this.setDone('idle_with_items');
           }
       }
   };
   ACTIONS_WORKER_DI.worker_di_return = {
       update: function (mdc, md, people, scene, person, opt) {
           if(md.index === 4){
               this.setDone('at_di');
           }
       },
       noPath: function (mdc, md, people, scene, person, opt) {
           const pos1 = person.getTilePos();
           let door = md.getDoorAt(pos1.x, pos1.y);
           if(!door || (door && md.index != 4)){   
               const options = md.hardMapData.doors.map((door)=>{  return door.to.mapNum });
               const min = Math.min.apply(null, options);  
               const door_to_map = options.some(( mapNum )=>{ return mapNum === 4  });
               const to_map = door_to_map ? 4 : min;
               let pos2 = md.findDoorFrom(pos1.x, pos1.y, to_map, false);
               if(pos2){
                   person.setPath(scene, md, pos2.x, pos2.y);
               }
           }
       }
   };


   ACTIONS_WORKER_DI.worker_di_recycle_empty = {
       opt: {},
       init: function(mdc, md, people, scene, person, opt, delta) {
            person.setData('itemOfInterest', null);
            const bin = md.getRecycling();
            const onHand = person.getData('onHand');
            if(onHand.length === 0){
                this.setDone('nothing_on_hand');
                return;
            }
            if(bin){
                const pos_bin = bin.getTilePos();
                const pos = md.findWalkToNear(pos_bin, 10);
                if(pos){
                    person.setData('itemOfInterest', bin);
                    person.setPath(scene, md, pos.x, pos.y);
                }
                if(!pos){
                    this.setDone('no_spot');
                }
            }
            if(!bin){
                person.say('No bin at this map!');
                this.setDone('no_bin');
            }       
       },
       update : function(mdc, md, people, scene, person, opt, delta) {
           const ioi = person.getData('itemOfInterest');
           const path = person.getData('path');
           if(ioi && path.length === 0){
                this.setDone('at_bin');
           }
       }
   };

   ACTIONS_WORKER_DI.worker_di_process = {
       opt: {
           maxCount: 5,
           count: 5
       },
       init: function(mdc, md, people, scene, person, opt, delta) {
           const oh = person.getData('onHand');  
           oh.forEach( (item) => {
               item.setPrice(0.50, 0);
           });
       },
       update: function(mdc, md, people, scene, person, opt, delta) {},
       noPath: function(mdc, md, people, scene, person, opt){
           const oh = person.getData('onHand');
           person.getData('maxOnHand');
           if(oh.length > 0 && opt.count > 0 ){
                const pos = md.getRandomWalkTo();
                person.setPath(scene, md, pos.x, pos.y);
                opt.count = opt.count - 1;    
           }    
           if(oh.length > 0 && opt.count <= 0 ){
                people.setAction(scene, mdc, md, person, 'drop', { count: 1 } );
           }
       }
   };

   const ACTIONS_CUSTOMER = {};
   ACTIONS_CUSTOMER.customer_goto_exit = {
       init: function (mdc, md, people, scene, person) {
           md.hardMapData;
           const pos_exit = people.getMapSpawnLocation( md, person );
           person.setData('trigger_pos', {x: pos_exit.x, y: pos_exit.y });
           person.setData('path', []);
       },
       update : function(mdc, md, people, scene, person, opt, delta){
           const cPos = person.getTilePos();
           const tPos = person.getData('trigger_pos');
           if(cPos.x === tPos.x && cPos.y === tPos.y){
               this.setDone('at_exit');
           }
       },
       noPath: function (mdc, md, people, scene, person) {
           person.getTilePos();
           const tPos = person.getData('trigger_pos');
           md.hardMapData;
           if(tPos.x === -1 && tPos.y === -1){
               const pos_exit = people.getMapSpawnLocation( md, person );
               person.setData('trigger_pos', {x: pos_exit.x, y: pos_exit.y });
           }
           person.setPath(scene, md, tPos.x, tPos.y);
       }
   };
   ACTIONS_CUSTOMER.shopper_idle = {
       init: function (mdc, md, people, scene, person) {},
       update : function(mdc, md, people, scene, person, opt, delta){
           const items = md.donations.getItemType('Item');
           if(items.length === 0){
               this.setDone('no_items');
           }
           if(items.length >= 1){
               this.setDone('items_to_buy');
           }
       }
   };
   ACTIONS_CUSTOMER.shopper_wonder = {
       init: function (mdc, md, people, scene, person) {},
       update : function(mdc, md, people, scene, person, opt, delta){
           const items = md.donations.getItemType('Item', true),
           action = person.getData('act');
           if(items.length >= 1){
               action.setDone('items_found');
           }
       },
       noPath : function(mdc, md, people, scene, person){
           const tile = md.getRandomWalkTo();
           person.setPath(scene, md, tile.x, tile.y);
       }
   };
   ACTIONS_CUSTOMER.shopper_find_itemofinterest = {
       init: function (mdc, md, people, scene, person) {},
       update : function(mdc, md, people, scene, person, opt, delta){
           let ioi = person.getData('itemOfInterest');
           const items = md.donations.getItemType('Item', true);
           if(!ioi && items.length > 0){
               const iLen = items.length;
               const item = items[ Math.floor(Math.random() * iLen) ];
               person.setData('itemOfInterest', item);
               this.setDone('have_ioi');
           }
           if( !person.getData('itemOfInterest') || items.length === 0 ){
               this.setDone('no_ioi');
           }
       }
   };
   ACTIONS_CUSTOMER.shopper_buy_itemofinterest = {
       update: function (mdc, md, people, scene, person) {
           let ioi = person.getData('itemOfInterest');
           if(ioi){
               const pos_item = ioi.getTilePos();
               const pos_person = person.getTilePos();
               if( pos_person.x === pos_item.x && pos_person.y === pos_item.y ){
                   person.x = pos_item.x * 16 + 8;
                   person.y = pos_item.y * 16 + 8;
                   let gs = scene.registry.get('gameSave');
                   gs.money += ioi.price.shelf;
                   scene.registry.set('gameSave', gs);
                   people.clearAllIOI(ioi);
                   ioi.destroy();
                   person.setData('itemOfInterest', null);
                   this.setDone('items_bought');
               }
           }
           if(!ioi){
               this.setDone('no_ioi_to_buy');
           }
       },
       noPath: function(mdc, md, people, scene, person, opt){
           let ioi = person.getData('itemOfInterest');  
           if(ioi){
               const pos_item = ioi.getTilePos();
               person.setPath(scene, md, pos_item.x, pos_item.y);
           }
       }
   };
   // an action where a person would like to find a location to drop off items
   // that they have on hand that are unprocessed items to be donated to reuse.
   // Once such a location has been found, the person will then go to that location.
   ACTIONS_CUSTOMER.donation_goto_droplocation = {
       init: function (mdc, md, people, scene, person) {
           const tPos = person.getData('trigger_pos');
           tPos.x = -1; tPos.y = -1;
       },
       update: function (mdc, md, people, scene, person) {
           const onHand = person.getData('onHand');
           const cPos = person.getTilePos();
           const tPos = person.getData('trigger_pos');
           if( onHand.length > 0 && tPos.x === -1 && tPos.y === -1 ){
               const tiles_di = md.get_di_tiles( scene );
               if(tiles_di.length > 0){    
                   const dt = tiles_di[ Math.floor( tiles_di.length * Math.random() ) ];
                   const tiles_near_di = md.map.getTilesWithin(dt.x - 1, dt.y -1, 3, 3).filter( (tile) => { return md.canWalk(tile) });
                   const t = tiles_near_di[ Math.floor( tiles_near_di.length * Math.random() ) ];
                   person.setData('trigger_pos', {x: t.x, y: t.y });
               }
           }
           if( onHand.length === 0 ){
               this.setDone('nothing_on_hand');
           }
           if( cPos.x === tPos.x && cPos.y === tPos.y ){
              this.setDone('at_drop_location');
              person.setData('path', []);
          }
       },
       noPath: function (mdc, md, people, scene, person) {
          const cPos = person.getTilePos();
          const tPos = person.getData('trigger_pos');  
          if(tPos.x != -1 && tPos.y != -1 && !(cPos.x === tPos.x && cPos.y === tPos.y) ){
              person.setPath(scene, md, tPos.x, tPos.y);
          }
       }
   };

   const ACTIONS_DEFAULT = Object.assign({}, ACTIONS_CORE, ACTIONS_WORKER_DI, ACTIONS_CUSTOMER  );
   class Action {
       constructor (scene, people, person, key='wonder', opt={}) {
       
       
           this.ACTIONS = opt.ACTIONS || ACTIONS_DEFAULT;
           this.def = this.ACTIONS[ key ];
           if(!this.def){
               this.def = {};
           }
           this.def.opt = this.def.opt || {};
           this.scene = scene;
           this.people = people;
           this.person = person;
           this.key = key;
           this.mdc = this.scene.registry.get('mdc');
           this.done = false;
           this.result ='';
           this.opt = Object.assign({}, this.def.opt, opt);
       }
       setDone (result='done') {
           this.done = true;
           this.result = result;
       }
       callFunc (type='init', md, delta ){
           const func = this.def[type];
           if(func){
               func.call(this, this.mdc, md, this.people, this.scene, this.person, this.opt, delta);
           }
       }
       init ( md ) { this.callFunc('init', md); }
       update ( md, delta ) { this.callFunc('update', md, delta); }
       noPath ( md ) { this.callFunc('noPath', md); }
   }

   // This is based on what I found here
   // PathFinder License: MIT.
   // Copyright (c) 2013 appsbu-de
   // https://github.com/appsbu-de/phaser_plugin_pathfinding
   // I just made a few changes to get it working with phaser 3
   // In addition I am using my own message.js for logging
   // ~ Dustin ( https://github.com/dustinpfister )

   const log$6 = new ConsoleLogger ({
       cat: 'lib',
       id: 'pathfinding',
       appendId: true
   });

   const EasyStar = {};

   EasyStar.Node = function(parent, x, y, costSoFar, simpleDistanceToTarget) {
       this.parent = parent;
       this.x = x;
       this.y = y;
       this.costSoFar = costSoFar;
       this.simpleDistanceToTarget = simpleDistanceToTarget;
       this.bestGuessDistance = function() {
           return this.costSoFar + this.simpleDistanceToTarget;
       };
   };

   EasyStar.Node.OPEN_LIST = 0;
   EasyStar.Node.CLOSED_LIST = 1;

   EasyStar.PriorityQueue = function(criteria,heapType) {
       this.length = 0; //The current length of heap.
       var queue = [];
       var isMax = false;
       if (heapType==EasyStar.PriorityQueue.MAX_HEAP) {
           isMax = true;
       } else if (heapType==EasyStar.PriorityQueue.MIN_HEAP) {
           isMax = false;
       } else {
           throw heapType + " not supported.";
       }

       this.insert = function(value) {
           if (!value.hasOwnProperty(criteria)) {
               throw "Cannot insert " + value + " because it does not have a property by the name of " + criteria + ".";
           }
           queue.push(value);
           this.length++;
           bubbleUp(this.length-1);
       };

       this.getHighestPriorityElement = function() {
           return queue[0];
       };

       this.shiftHighestPriorityElement = function() {
           if (this.length === 0) {
               throw ("There are no more elements in your priority queue.");
           } else if (this.length === 1) {
               var onlyValue = queue[0];
               queue = [];
               this.length = 0;
               return onlyValue;
           }
           var oldRoot = queue[0];
           var newRoot = queue.pop();
           this.length--;
           queue[0] = newRoot;
           swapUntilQueueIsCorrect(0);
           return oldRoot;
       };

       var bubbleUp = function(index) {
           if (index===0) {
               return;
           }
           var parent = getParentOf(index);
           if (evaluate(index,parent)) {
               swap(index,parent);
               bubbleUp(parent);
           } else {
               return;
           }
       };

       var swapUntilQueueIsCorrect = function(value) {
           var left = getLeftOf(value);
           var right = getRightOf(value);
           if (evaluate(left,value)) {
               swap(value,left);
               swapUntilQueueIsCorrect(left);
           } else if (evaluate(right,value)) {
               swap(value,right);
               swapUntilQueueIsCorrect(right);
           } else if (value==0) {
               return;
           } else {
               swapUntilQueueIsCorrect(0);
           }
       };

       var swap = function(self,target) {
           var placeHolder = queue[self];
           queue[self] = queue[target];
           queue[target] = placeHolder;
       };

       var evaluate = function(self,target) {
           if (queue[target]===undefined||queue[self]===undefined) {
               return false;
           }		
           var selfValue;
           var targetValue;		
           //Check if the criteria should be the result of a function call.
           if (typeof queue[self][criteria] === 'function') {
               selfValue = queue[self][criteria]();
               targetValue = queue[target][criteria]();
           } else {
               selfValue = queue[self][criteria];
               targetValue = queue[target][criteria];
           }
           if (isMax) {
               if (selfValue > targetValue) {
                   return true;
               } else {
                   return false;
               }
           } else {
               if (selfValue < targetValue) {
                   return true;
               } else {
                   return false;
               }
           }
       };

       var getParentOf = function(index) {
           return Math.floor(index/2)-1;
       };

       var getLeftOf = function(index) {
           return index*2 + 1;
       };

       var getRightOf = function(index) {
           return index*2 + 2;
       };
   };

   EasyStar.PriorityQueue.MAX_HEAP = 0;
   EasyStar.PriorityQueue.MIN_HEAP = 1;

   EasyStar.instance = function() {
       this.isDoneCalculating = true;
       this.pointsToAvoid = {};
       this.startX;
       this.callback;
       this.startY;
       this.endX;
       this.endY;
       this.nodeHash = {};
       this.openList;
   };
   EasyStar.js = function() {
       var STRAIGHT_COST = 10;
       var DIAGONAL_COST = 14;
       var pointsToAvoid = {};
       var collisionGrid;
       var costMap = {};
       var iterationsSoFar;
       var instances = [];
       var iterationsPerCalculation = Number.MAX_VALUE;
       var acceptableTiles;
       var diagonalsEnabled = false;

       this.setAcceptableTiles = function(tiles) {
           if (tiles instanceof Array) {
               //Array
               acceptableTiles = tiles;
           } else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
               //Number
               acceptableTiles = [tiles];
           }
       };

       this.enableDiagonals = function() {
           diagonalsEnabled = true;
       };

       this.disableDiagonals = function() {
           diagonalsEnabled = false;
       };

       this.setGrid = function(grid) {
           collisionGrid = grid;
           //Setup cost map
           for (var y = 0; y < collisionGrid.length; y++) {
               for (var x = 0; x < collisionGrid[0].length; x++) {
                   if (!costMap[collisionGrid[y][x]]) {
                       costMap[collisionGrid[y][x]] = 1;
                   }
               }
           }
       };

       this.setTileCost = function(tileType, cost) {
           costMap[tileType] = cost;
       };

       this.setIterationsPerCalculation = function(iterations) {
           iterationsPerCalculation = iterations;
       };
   	
       this.avoidAdditionalPoint = function(x, y) {
           pointsToAvoid[x + "_" + y] = 1;
       };

       this.stopAvoidingAdditionalPoint = function(x, y) {
           delete pointsToAvoid[x + "_" + y];
       };

       this.stopAvoidingAllAdditionalPoints = function() {
           pointsToAvoid = {};
       };

       this.findPath = function(startX, startY ,endX, endY, callback) {
           //No acceptable tiles were set
           if (acceptableTiles === undefined) {
               throw "You can't set a path without first calling setAcceptableTiles() on EasyStar.";
           }
           //No grid was set
           if (collisionGrid === undefined) {
               throw "You can't set a path without first calling setGrid() on EasyStar.";
           }
           //Start or endpoint outside of scope.
           // I fixed what I think is a bug here ~Dustin
           if (startX < 0 || startY < 0 || endX < 0 || endY < 0 || 
           startX > collisionGrid[0].length-1 || startY > collisionGrid.length-1 || 
           endX > collisionGrid[0].length-1 || endY > collisionGrid.length-1) {        
               log$6('start or end point is out of bounds.');
               log$6(startX, startY, endX, endY);
               log$6(collisionGrid[0].length-1, collisionGrid.length-1);
               throw "Your start or end point is outside the scope of your grid.";
           }
           //Start and end are the same tile.
           if (startX===endX && startY===endY) {
               callback([]);
           }
           //End point is not an acceptable tile.
           var endTile = collisionGrid[endY][endX];
           var isAcceptable = false;
           for (var i = 0; i < acceptableTiles.length; i++) {
               if (endTile === acceptableTiles[i]) {
                   isAcceptable = true;
                   break;
               }
           }
           if (isAcceptable === false) {
               callback(null);
               return;
           }
           //Create the instance
           var instance = new EasyStar.instance();
           instance.openList = new EasyStar.PriorityQueue("bestGuessDistance",EasyStar.PriorityQueue.MIN_HEAP);
           instance.isDoneCalculating = false;
           instance.nodeHash = {};
           instance.startX = startX;
           instance.startY = startY;
           instance.endX = endX;
           instance.endY = endY;
           instance.callback = callback;
           instance.openList.insert(coordinateToNode(instance, instance.startX, 
               instance.startY, null, STRAIGHT_COST));
           instances.push(instance);
       };

       this.calculate = function() {
           if (instances.length === 0 || collisionGrid === undefined || acceptableTiles === undefined) {
               return;
           }
           for (iterationsSoFar = 0; iterationsSoFar < iterationsPerCalculation; iterationsSoFar++) {
               if (instances.length === 0) {
                   return;
               }
               //Couldn't find a path.
               if (instances[0].openList.length===0) {
                   instances[0].callback(null);
                   instances.shift();
                   continue;
               }
               var searchNode = instances[0].openList.shiftHighestPriorityElement();
               searchNode.list = EasyStar.Node.CLOSED_LIST;
               if (searchNode.y > 0) {
                   checkAdjacentNode(instances[0], searchNode, 0, -1, STRAIGHT_COST * 
                       costMap[collisionGrid[searchNode.y-1][searchNode.x]]);
                   if (instances[0].isDoneCalculating===true) {
                       instances.shift();
                       continue;
                   }
               }
               if (searchNode.x < collisionGrid[0].length-1) {
                   checkAdjacentNode(instances[0], searchNode, 1, 0, STRAIGHT_COST *
                       costMap[collisionGrid[searchNode.y][searchNode.x+1]]);
                   if (instances[0].isDoneCalculating===true) {
                       instances.shift();
                       continue;
                   }
               }
               if (searchNode.y < collisionGrid.length-1) {
                   checkAdjacentNode(instances[0], searchNode, 0, 1, STRAIGHT_COST *
                       costMap[collisionGrid[searchNode.y+1][searchNode.x]]);
                   if (instances[0].isDoneCalculating===true) {
                       instances.shift();
                       continue;
                   }
               }
               if (searchNode.x > 0) {
                   checkAdjacentNode(instances[0], searchNode, -1, 0, STRAIGHT_COST *
                       costMap[collisionGrid[searchNode.y][searchNode.x-1]]);
                   if (instances[0].isDoneCalculating===true) {
                       instances.shift();
                       continue;
                   }
               }
               if (diagonalsEnabled) {
                   if (searchNode.x > 0 && searchNode.y > 0) {
                       checkAdjacentNode(instances[0], searchNode, -1, -1,  DIAGONAL_COST *
                           costMap[collisionGrid[searchNode.y-1][searchNode.x-1]]);
                       if (instances[0].isDoneCalculating===true) {
                           instances.shift();
                           continue;
                       }
                   }
                   if (searchNode.x < collisionGrid[0].length-1 && searchNode.y < collisionGrid.length-1) {
                       checkAdjacentNode(instances[0], searchNode, 1, 1, DIAGONAL_COST *
                           costMap[collisionGrid[searchNode.y+1][searchNode.x+1]]);
                       if (instances[0].isDoneCalculating===true) {
                           instances.shift();
                           continue;
                       }
                   }
                   if (searchNode.x < collisionGrid[0].length-1 && searchNode.y > 0) {
                       checkAdjacentNode(instances[0], searchNode, 1, -1, DIAGONAL_COST *
                           costMap[collisionGrid[searchNode.y-1][searchNode.x+1]]);
                       if (instances[0].isDoneCalculating===true) {
                           instances.shift();
                           continue;
                       }
                   }
                   if (searchNode.x > 0 && searchNode.y < collisionGrid.length-1) {
                       checkAdjacentNode(instances[0], searchNode, -1, 1, DIAGONAL_COST *
                           costMap[collisionGrid[searchNode.y+1][searchNode.x-1]]);
                       if (instances[0].isDoneCalculating===true) {
                           instances.shift();
                           continue;
                       }
                   }
               }
           }
       };

       var checkAdjacentNode = function(instance, searchNode, x, y, cost) {
           var adjacentCoordinateX = searchNode.x+x;
           var adjacentCoordinateY = searchNode.y+y;
   		
           if (instance.endX === adjacentCoordinateX && instance.endY === adjacentCoordinateY) {
               instance.isDoneCalculating = true;
               var path = [];
               var pathLen = 0;
               path[pathLen] = {x: adjacentCoordinateX, y: adjacentCoordinateY};
               pathLen++;
               path[pathLen] = {x: searchNode.x, y:searchNode.y};
               pathLen++;
               var parent = searchNode.parent;
               while (parent!=null) {
                   path[pathLen] = {x: parent.x, y:parent.y};
                   pathLen++;
                   parent = parent.parent;
               }
               path.reverse();
               instance.callback(path);
           }

           if (pointsToAvoid[adjacentCoordinateX + "_" + adjacentCoordinateY] === undefined) {
               for (var i = 0; i < acceptableTiles.length; i++) {
                   if (collisionGrid[adjacentCoordinateY][adjacentCoordinateX] === acceptableTiles[i]) {
   					
                       var node = coordinateToNode(instance, adjacentCoordinateX, 
                           adjacentCoordinateY, searchNode, cost);
   					
                       if (node.list === undefined) {
                           node.list = EasyStar.Node.OPEN_LIST;
                           instance.openList.insert(node);
                       } else if (node.list === EasyStar.Node.OPEN_LIST) {
                           if (searchNode.costSoFar + cost < node.costSoFar) {
                               node.costSoFar = searchNode.costSoFar + cost;
                               node.parent = searchNode;
                           }
                       }
                       break;
                   }
               }

           }
       };

       var coordinateToNode = function(instance, x, y, parent, cost) {
           if (instance.nodeHash[x + "_" + y]!==undefined) {
               return instance.nodeHash[x + "_" + y];
           }
           var simpleDistanceToTarget = getDistance(x, y, instance.endX, instance.endY);
           if (parent!==null) {
               var costSoFar = parent.costSoFar + cost;
           } else {
               costSoFar = simpleDistanceToTarget;
           }
           var node = new EasyStar.Node(parent,x,y,costSoFar,simpleDistanceToTarget);
           instance.nodeHash[x + "_" + y] = node;
           return node;
       };

       var getDistance = function(x1,y1,x2,y2) {
           return Math.sqrt(Math.abs(x2-x1)*Math.abs(x2-x1) + Math.abs(y2-y1)*Math.abs(y2-y1)) * STRAIGHT_COST;
       };
   };


   class PathFinder {

       constructor () {
           if (typeof EasyStar !== 'object') {
               throw new Error("Easystar is not defined!");
           }
           this.parent = parent;
           this._easyStar = new EasyStar.js();
           this._grid = null;
           this._callback = null;
           this._prepared = false;
           this._walkables = [0];
       }
           
       setGrid (grid, walkables, iterationsPerCount) {
           iterationsPerCount = iterationsPerCount || null;
           this._grid = [];
           for (var i = 0; i < grid.length; i++) {
               this._grid[i] = [];
               for (var j = 0; j < grid[i].length; j++){
                   if (grid[i][j])
                   this._grid[i][j] = grid[i][j].index;
               else
                   this._grid[i][j] = 0;
               }
           }
           this._walkables = walkables;
           this._easyStar.setGrid(this._grid);
           this._easyStar.setAcceptableTiles(this._walkables);
           // initiate all walkable tiles with cost 1 so they will be walkable even if they are not on the grid map, jet.
           for (i = 0; i < walkables.length; i++){
               this.setTileCost(walkables[i], 1);
           }
           if (iterationsPerCount !== null) {
               this._easyStar.setIterationsPerCalculation(iterationsPerCount);
           }
       }
           
       setTileCost (tileType, cost) {
           this._easyStar.setTileCost(tileType, cost);
       }
           
       setCallbackFunction (callback) {
           this._callback = callback;
       }
           
       preparePathCalculation (from, to) {
           if (this._callback === null || typeof this._callback !== "function") {
               throw new Error("No Callback set!");
           }

           var startX = from[0],
           startY = from[1],
           destinationX = to[0],
           destinationY = to[1];

           this._easyStar.findPath(startX, startY, destinationX, destinationY, this._callback);
           this._prepared = true;
       }
           
       calculatePath  () {
           if (this._prepared === null) {
               throw new Error("no Calculation prepared!");
           }

           this._easyStar.calculate();
       }

   }

   const log$5 = new ConsoleLogger({
       cat: 'lib',
       id: 'task'
   });
   const TASKS_DEFAULT = {};
   TASKS_DEFAULT.default = {
       init: function (mdc, md, people, scene, person) {
           const pType = person.getData('type'),
           psType = person.getData('subType');
           if(pType === 'worker'){
               people.setTask(scene, mdc, md, person, 'di' );
           }     
           if(pType === 'customer' && psType === 'donator'){
               people.setTask(scene, mdc, md, person, 'donate' );
           }
           if(pType === 'customer' && psType === 'shopper'){
               //log( person.name, psType );
               people.setTask(scene, mdc, md, person, 'shopping' );
           }
       },
       update: (mdc, md, people, scene, person) => {
       
       }
   };
   TASKS_DEFAULT.player_control = {
       init: (mdc, md, people, scene, person) => {
           people.setAction(scene, mdc, md, person, 'player_control' );
       },
       update: (mdc, md, people, scene, person) => {}
   };
   TASKS_DEFAULT.di = {
       init: (mdc, md, people, scene, person, opt) => {
           people.setAction(scene, mdc, md, person, 'worker_di_idle' );    
       },
       update: (mdc, md, people, scene, person, opt, delta) => {
           person.getData('action_done');
           const oh = person.getData('onHand');
           person.getData('maxOnHand');
           const action = person.getData('act');
           const item = oh[0];
           // for one reason or another a worker finds themselves to be idle
           // while working di. There are a few outcomes here that involve where
           // they are, and what they have on hand at the moment
           if(action.done && action.key == 'worker_di_idle'){
               if(action.result === 'empty_handed'){
                   people.setAction(scene, mdc, md, person, 'worker_di_return' );
               }
               if(action.result === 'have_items'){
                    if(md.index != 4){
                        people.setAction(scene, mdc, md, person, 'worker_di_process', {   } );
                    }
                    if(md.index === 4){
                        people.setAction(scene, mdc, md, person, 'goto_map', { index: 1 } );
                    }
               }
               if( action.result === 'idle_without_items' ){
                   if(md.index === 4){
                       const count_empty = md.donations.getEmpties().length;
                       const count_drops = md.donations.getDrops().length;
                       if(count_empty > 0){
                           people.setAction(scene, mdc, md, person, 'pickup_empty', { } );
                           return;
                       }
                       if(count_drops > 0){
                           people.setAction(scene, mdc, md, person, 'pickup_drop', { } );
                           return;
                       }
                       people.setAction(scene, mdc, md, person, 'wonder', { 
                           getOut : function(mdc, md, people, scene, person, opt){
                               return count_empty > 0 || count_drops > 0;
                           }
                       });
                   }
                   if(md.index != 4){
                       people.setAction(scene, mdc, md, person, 'worker_di_return' );
                   }
               }
               if( action.result === 'idle_with_items' ){
                   if(md.index === 4){
                       if(item.iType === 'Item'){
                           people.setAction(scene, mdc, md, person, 'goto_map', { index: 1 } );
                       }
                       if(item.iType === 'Container' && item.isEmpty() ){ 
                           people.setAction(scene, mdc, md, person, 'worker_di_recycle_empty', { } );
                       }
                       if(item.iType === 'Container' && !item.isEmpty() );
                   }
                   if(md.index != 4){
                       people.setAction(scene, mdc, md, person, 'worker_di_process', {   } );
                   }
               }
           }
           if( action.done && action.key == 'goto_map' ){
               // (only one result 'at_map' )
               if(md.index != 4){
                   people.setAction(scene, mdc, md, person, 'worker_di_process', {   } );
               }
               if(md.index === 4){
                   people.setAction(scene, mdc, md, person, 'worker_di_idle', {   } );
               }
           }
           if( action.done && action.key === 'pickup'){
                   people.setAction(scene, mdc, md, person, 'worker_di_idle', {   } );
           }
           if( action.done && action.key === 'pickup_drop'){
               // possible results > 'no_empty_items'
               if(action.result === 'no_empty_items'){
                   log$5('di worker has a result of no_empty_items when set to pickup_drop action!');
                   log$5('set to worker_di_idle then?...\n\n');
                   people.setAction(scene, mdc, md, person, 'worker_di_idle', {   } );
               }
           }
           if( action.done && action.key === 'pickup_empty'){
               // possible results > 'have_empty'
               if(action.result == 'have_empty'){
                   people.setAction(scene, mdc, md, person, 'worker_di_recycle_empty', { } );
               }
               if(action.result != 'have_empty'){
                   log$5('pickup_empty action ended in a result other than have_empty result is :' + action.result);
               } 
           }
           if( action.done && action.key === 'worker_di_recycle_empty'){
               // possible results > 'nothing_on_hand', 'no_spot', 'no_bin', 'at_bin'
               if(action.result === 'at_bin'){
                   const ioi = person.getData('itemOfInterest');
                   people.setAction(scene, mdc, md, person, 'drop', { at: ioi, count: 1 });
               }
               if(action.result === 'nothing_on_hand' || action.result === 'no_spot' || action.result === 'no_bin' ){
                   people.setAction(scene, mdc, md, person, 'worker_di_idle', {   } );
               }
           }
           if( action.done && action.key === 'drop' ){
               // possible results > 'no_space', 'items_droped'
               if(action.result === 'items_droped'){
                   people.setAction(scene, mdc, md, person, 'worker_di_idle', {   } );
               }
               if(action.result === 'no_space'){
                   log$5('di worker can not complete a drop action, as there is no space!?');
                   log$5('set to worker_di_idle then?...\n\n');
                   people.setAction(scene, mdc, md, person, 'worker_di_idle', {   } );
               }
           }
           
           if(action.done && action.key == 'worker_di_return'){
               // possible results > 'at_di'
               people.setAction(scene, mdc, md, person, 'worker_di_idle' );
           }
       }
   };
   TASKS_DEFAULT.shopping = {
       init: (mdc, md, people, scene, person) => {
           people.setAction(scene, mdc, md, person, 'shopper_idle' );
       },
       update: (mdc, md, people, scene, person) => {
           const act = person.getData('act');
           if( act.key === 'shopper_idle' && act.done ){
               if(act.result === 'no_items'){
                   people.setAction(scene, mdc, md, person, 'shopper_wonder', { } );
               }
               if(act.result === 'items_to_buy'){
                   people.setAction(scene, mdc, md, person, 'shopper_find_itemofinterest', { } );
               }   
           }
           if( act.key === 'shopper_wonder' && act.done ){
               if(act.result === 'items_found'){
                   people.setAction(scene, mdc, md, person, 'shopper_find_itemofinterest', { } );
               }
           }
           if( act.key === 'shopper_find_itemofinterest' && act.done ){
               if(act.result === 'have_ioi'){
                   people.setAction(scene, mdc, md, person, 'shopper_buy_itemofinterest', { } );
               }
               if(act.result === 'no_ioi'){
                   people.setAction(scene, mdc, md, person, 'shopper_idle', { } );
               }
           }
           if( act.key === 'shopper_buy_itemofinterest' && act.done ){
               if( act.result === 'items_bought' || act.result === 'no_ioi_to_buy' ){
                   people.setAction(scene, mdc, md, person, 'shopper_idle', { } );
               }
           }
       }
   };
   TASKS_DEFAULT.donate = {
       init: (mdc, md, people, scene, person) => {
           people.setAction(scene, mdc, md, person, 'donation_goto_droplocation' );
       },
       update: (mdc, md, people, scene, person) => {
           const action = person.getData('act');
           if( action.done ){
               if(action.key === 'donation_goto_droplocation'){
                   people.setAction(scene, mdc, md, person, 'drop', { max_tiles: 16 } );
                   return;
               }
               if(action.key === 'drop'){
                   people.setAction(scene, mdc, md, person, 'customer_goto_exit' );
                   return;
               }
               if(action.key === 'customer_goto_exit' && action.result === 'at_exit' ){
                   people.kill(person);
                   return;
               }
           } 
           const max_donations = scene.registry.get('MAX_MAP_DONATIONS') || 10;
           const donations = md.donations;
           const donations_incoming = people.totalOnHandItems();
           const donations_drop = donations.children.size;
           const donations_total = donations_incoming + donations_drop;
           if(donations_total >= max_donations){
               people.setAction(scene, mdc, md, person, 'customer_goto_exit');
           }
       }
   };

   const TASK_DEFAULTS = { key : 'default' };
   class Task {
       constructor (scene, people, person, opt={}) {
           opt = Object.assign({}, TASK_DEFAULTS, opt);
           this.TASKS = opt.TASKS || TASKS_DEFAULT;
           this.key = opt.key;
           this.opt = opt;
       }
       init (mdc, md, people, scene, person) {
           const task = this.TASKS[ this.key ];
           if(!task){
               //log('no task for key: ' + this.key);
               return;
           }
           const init = task.init;
           if(init){
              init.call(this, mdc, md, people, scene, person, this.opt);
           }
       }
       update (mdc, md, people, scene, person, delta) {
           const task = this.TASKS[ this.key ];
           if(!task){
               //log('no task object for key: ' + this.key);
               return;
           }
           const update = task.update;
           if(update){
               update.call(this, mdc, md, people, scene, person, this.opt, delta);
           }
       }
   }

   const log$4 = new ConsoleLogger({
       cat: 'lib',
       id: 'people',
       appendId: true
   });
   const NOOP = function(){};

   /********* **********
   1.0) Person Class
   ********** *********/
   class Person extends Phaser.Physics.Arcade.Sprite {

       constructor (scene, opt={}, pConfig={} ) {
           opt = Object.assign({}, { curveSpeed: 1 }, opt );
           pConfig = Object.assign({}, { }, pConfig );
           super(scene, opt.x, opt.y, opt.texture, opt.frame);
           scene.add.existing(this);
           scene.physics.add.existing(this);
           this.TASKS = pConfig.TASKS;
           this.ACTIONS = pConfig.ACTIONS;
           this.setCollideWorldBounds(true);
           this.depth = 3;
           this.nCurve = 0;
           this.speedCurve = pConfig.curveSpeed || 0.20;
           this.vecCurve = new Phaser.Math.Vector2();
           this.curve = null;     
           this.setData({
               task : { },
               act : { foo: 'bar' },
               //action_done: false,
               //action_result: '',
               itemOfInterest: null,
               path: [], pathCT: 0,
               hits: 0, idleTime: 0,
               onHand: [], maxOnHand: 3,
               trigger_pos: {x: -1, y: -1},
               type: '', subType: '',
               itemMode: 1,   // 1 item pickup, 2 item drop, 3 container pickup/drop, 0 tile info
               moveFrame: 0, sp: {}
           }); 
       }
       
       say (mess='') {
           this.scene.mp.push(mess, 'SAY');
       }
       
       setToTilePos (p) {
           p = p === undefined ? this.getTilePos() : p ;
           this.x = p.x * 16 + 8;
           this.y = p.y * 16 + 8;
       }
      
       getTilePos () {    
           return {
               x : Math.floor( this.x / 16 ),
               y : Math.floor( this.y / 16 )
           }
       }
           
       setConf (pConfig) {
           const person = this;
           Object.keys(pConfig).forEach((key)=>{
               person.setData(key, pConfig[key]);
           });
       }
       
       kill () {
          this.getData('onHand').forEach( (item) => {
              item.destroy(true, true);
          });
          this.destroy(true, true);
       }
       
       pathProcessorCurve (scene, cb=NOOP) {
           let path = this.getData('path');
           const speed = 50 - Math.round(49 * this.speedCurve);
           let i = this.nCurve / (speed * path.length );
           if(path.length > 0 && i <= 1){             
               this.curve.getPoint(i, this.vecCurve);
               this.x = this.vecCurve.x;
               this.y = this.vecCurve.y;        
               this.nCurve += 1;
           }
           if(i >= 1){
               cb(scene, this);     
           }
       }
           
       setPath (scene, md, tx=2, ty=2) {
           this.nCurve = 0;
           let curve = null;
           const pf = new PathFinder();
           const sprite = this;
           pf.setGrid( md.map.layers[0].data, md.hardMapData.tilePalette.walkable );
           pf.setCallbackFunction( (path) => { 
               path = path || [];
               sprite.setData({ path: path });
               if(path.length > 1){
                   curve = new Phaser.Curves.Path(path[0].x * 16 + 8, path[0].y * 16 + 8);
                   let i = 1;
                   while(i < path.length){
                       const pt = path[i];
                       curve.lineTo( pt.x * 16 + 8, pt.y * 16 + 8 );
                       i += 1;
                   }
               }
           });
           const stx = Math.floor( sprite.x / 16 );
           const sty = Math.floor( sprite.y / 16 );
           pf.preparePathCalculation([stx, sty], [tx, ty]);
           pf.calculatePath();
           this.curve = curve;
           const pc = this.getData('pathCT');
           this.setData('pathCT', pc + 1);
       }
           
       update (scene) {
           const person = this;
           const onHand = person.getData('onHand');
           if(onHand){
               const len = onHand.length;
               if(len > 0){
                   let i = 0;
                   while(i < len){
                       const item = onHand[i];
                       item.x = person.x + 8;
                       item.y = person.y - 8 - i * 2;
                       i += 1;
                   }
               }
           }
       }
           
   }
   /********* **********
    2.0) PEOPLE_TYPES ( customer, worker )
   ********** **********/    
   const PEOPLE_TYPES = {};

   const get_pt = ( ty ) => {
       if(typeof ty === 'object'){
           ty = ty.getData('type');
       }
       return PEOPLE_TYPES[ ty ];
   };

   const get_spt = (person, subType=false) => {
       if(!subType){
           subType = person.getData('subType');
       }
       const pt = get_pt( person.getData('type') );
       return pt[subType];
   };
          
   PEOPLE_TYPES.worker = {

       data : {
           0 :  { count: 1, spawn: 0 },
           1 :  { count: 1, spawn: 0 },
           2 :  { count: 1, spawn: 0 },
           3 :  { count: 1, spawn: 0 },
           4  : { count: 2, spawn: 0 }
       },

       init: function(mdc, md, people, scene){},

       setSubType: function (mcd, md, people, scene, person ) {
           person.setData('subType', 'employee');   
           person.name = mcd.newName( 'employee' );
       },
       
       canSpawn : function (mcd, md, people, scene, now) {
           const dat = this.data[ md.index ];
           people.children.size;
           if( dat.spawn < dat.count ){
               dat.spawn += 1;
               return true;
           }
           return false;
       }

   };
       
   PEOPLE_TYPES.worker.employee = {

       update: (mdc, md, people, scene, person) => {},

       create: (mdc, md, people, scene, person) => {
           people.setMapSpawnLocation(md, person);
       }
       
   };
       
   PEOPLE_TYPES.customer = {

       init: function(mdc, md, people, scene){
           people.setData('lastSpawn', new Date() );
           const sr = scene.registry.get('CUSTOMER_SPAWN_RATE') || 3000;
           people.setSpawnRate( sr.min, sr.delta );
       },

       setSubType: function (mdc, md, people, scene, person ) {
           people.setRandomSubType( person );
           person.name = mdc.newName( person.getData('subType') );
       },
       
       canSpawn : function (mdc, md, people, scene, now) {
           const lastSpawn = people.getData('lastSpawn');
           const t = now - lastSpawn;
           const current_count = people.children.size;
           const max = scene.registry.get('CUSTOMER_MAX_SPAWN_PER_MAP');
           const sr = scene.registry.get('CUSTOMER_SPAWN_RATE');
           const spawnStack = people.getData('spawnStack');
           if(current_count < max && spawnStack.length > 0 && t >= people.spawnRate){
               people.setData('lastSpawn', now);
               people.setSpawnRate( sr.min, sr.delta );
               let spawnData = spawnStack[0] || {};
               if(spawnData.count <= 0){
                   spawnStack.shift();
                   spawnData = spawnStack[0] || {};
               }
               if(current_count < max && spawnData.count > 0){
                   spawnData.count -= 1;
                   return true;
               }   
           }
           if(current_count >= max && t >= people.spawnRate){
                people.setData('lastSpawn', now);
                people.setSpawnRate( sr.min, sr.delta );
           }   
           return false;
       }

   };
       
   PEOPLE_TYPES.customer.shopper = {
       
       update: (mdc, md, people, scene, person) => {},
       
       create: (mdc, md, people, scene, person) => {
           people.setMapSpawnLocation(md, person);
       },
       
       noPath: (mdc, md, people, scene, person) => {}
           
   };

   PEOPLE_TYPES.customer.donator = {
       
       update: (mdc, md, people, scene, person) => {},

       create: (mdc, md, people, scene, person) => {
           const max_donations = scene.registry.get('MAX_MAP_DONATIONS') || 10;
           const donations = md.donations;
           const donations_incoming = people.totalOnHandItems();
           const donations_drop = donations.children.size;
           const donations_total = donations_incoming + donations_drop;
           people.setMapSpawnLocation(md, person);
           if(donations_total < max_donations){
               const donation = new Container(scene, 'box_items_hh', {}, person.x, person.y);
               scene.add.existing(donation);
               person.setData('onHand', [ donation ] );
               people.onHand.add(donation);
           }
           person.setData('itemMode', 2);
       },
       
       noPath: (mdc, md, people, scene, person) => {}
       
   };

   const PEOPLE_DEFAULTS = {
       type: 'customer', subTypes: ['shoper', 'donator'], subTypeProbs: [ 1.00, 0.00 ], cash: 100,
       ACTIONS: null, TASKS: null
   };
   /********* **********
   3.0) PEOPLE CLASS
   ********** *********/
   class People extends Phaser.Physics.Arcade.Group {
       
       constructor (config, pConfig) {
           config = config || {};
           pConfig = Object.assign({}, PEOPLE_DEFAULTS, pConfig || {} );
           config.classType = Person;
           const scene = config.scene;
           const world = scene.physics.world;
           super(world, scene, config);
      
           this.number = 0;
           this.data = new Phaser.Data.DataManager(this,  new Phaser.Events.EventEmitter() );
           this.onHand = new ItemCollection();
           this.setData('spawnStack', [] );
           this.setData('lastSpawn', new Date());
           this.setData('type', pConfig.type);
           this.setData('subTypes', pConfig.subTypes);
           this.setData('subTypeProbs', pConfig.subTypeProbs);
           this.setData('pConfig', pConfig);
           this.spawnRate = pConfig.spawnRate;
           this.md = pConfig.md;
           const pt = get_pt( this );
           pt.init(scene.registry.get('mdc'), this.md, this, config.scene);
       }
       
       getData (key, value){ return this.data.get(key); }
       
       setTask (scene, mdc, md, person, taskKey = 'default' ) {
           const people = this;
           const task = new Task(scene, this, person, { key: taskKey, TASKS: person.TASKS });
           person.setData('task', task);
           
           task.init(mdc, md, people, scene, person);
       }
       
       setAction (scene, mdc, md, person, actionKey = 'default', opt ) {
           //person.action = actionKey;
           const opt_action = Object.assign({}, { ACTIONS: person.ACTIONS }, opt);
           person.setData('act', new Action( scene, this, person, actionKey, opt_action  ) );
           person.getData('act').init(md);
       }
       
       setData (key, value){ return this.data.set(key, value); }
       
       setRandomSubType (person){
           const subTypes = this.getData('subTypes');
           const subTypeProbs = this.getData('subTypeProbs');
           const roll = Math.random();
           let a = subTypeProbs[0];
           let i_subType = 0;
           while(i_subType < subTypes.length){
               if(roll < a){
                   person.setData('subType', subTypes[i_subType] );
                   break;
               }
               a += subTypeProbs[i_subType];
               i_subType += 1;
           }
       }
       
       transToNewMap ( person, nmd, md ) {
           md = md === undefined ? this.md : md;
           const pType = person.getData('type');
           md[pType].remove(person);
           nmd[pType].add(person);      
           let i = 0;
           const onHand = person.getData('onHand');
           const len = onHand.length;
           while(i < len){
               const item = onHand[i];
               this.onHand.remove(item);
               nmd[pType].onHand.add(item);  
               i += 1;
           }
       }
       
       getMapSpawnLocation (md, person) {
           let areas = md.hardMapData.people.spawnAreas;
           let location = areas;
           if( areas instanceof Array ){
             const pType = person.getData('type');
             const options = areas.filter( ( loc ) => {
                 if( loc.type != undefined && loc.type != 'all' ){
                   return pType === loc.type;
                 }
                 return true;
             });
             const i = Math.floor( options.length * Math.random() );
             location = options[i];
           }
           const pos = {};
           pos.x = location.x + Math.floor( location.w * Math.random() );
           pos.y = location.y + Math.floor( location.h * Math.random() );
           return pos;
       }
       
       pushSpawnStack (opt={}) {
           const stack = this.getData('spawnStack');
           const spawnData = {};
           spawnData.ms_min = 1000;
           spawnData.count = opt.count === undefined ? 5 : opt.count;
           stack.push(spawnData);
       }
       
       setMapSpawnLocation (md, person) {
           const pos = this.getMapSpawnLocation (md, person);
           person.setToTilePos(pos);
       }
       
       setSpawnRate( tMin=500, Tdelta=500 ){
           this.spawnRate = tMin + Math.round(Tdelta * Math.random());
       }
           
       spawnPerson (mdc, md, scene, isPlayer=false) {
           const children = this.getChildren();
           const people = this;
           const pConfig = this.getData('pConfig');
           const now = new Date();
           const ty = this.getData('type');
           const pt = get_pt(ty);
           if( pt.canSpawn(mdc, md, this, scene, now) ){
               const config = Object.assign({}, { number: this.number, people: children }, pConfig);
               const person = this.get( { x: 0, y: 0, texture: 'people_16_16', frame:0 }, config );
               if(isPlayer){
                   scene.registry.set('player', person);
               }
               this.number += 1;
               person.setData('type', this.getData('type') );
               pt.setSubType(mdc, md, this, scene, person);
               const st = get_spt( person );
               st.create(mdc, md, this, scene, person);
               person.setFrame( person.getData('subType') + '_down');
      
               people.setAction(scene, mdc, md, person, 'default' );
               people.setTask(scene, mdc, md, person, 'default' );

               
               return person;
           }
           return null;
       }
       
       kill (person) {
          person.getData('onHand').forEach( (item) => {
              item.destroy(true, true);
          });
          this.remove(person, true, true);
       }
       
       totalOnHandItems(){
           return this.children.entries.filter( ( person ) => {
               return person.getData('onHand').length > 0;
           }).length;
       }
    
       clearAllIOI (item){
           this.getChildren().forEach( (person) => {
               const ioi = person.getData('itemOfInterest');
               if(ioi === item){
                   person.setData('itemOfInterest', null);
                   person.setData('path', []);
               }
           });
       }
       
       dropItem( scene, person, item, md, tx, ty ){
           const oh = person.getData('onHand');
           scene.registry.get('mdc');
           person.setData('itemMode', 2);
           if(typeof item === 'number'){
               item = oh[item];
           }   
           const pos_drop = md.findEmptyDropSpot( cPos, 8 );       
           if(pos_drop === null){
               log$4('can not find a space for the drop!', 'SAY');
           }       
           if(pos_drop != null){
               person.setData('itemMode', 2);
               item.x = pos_drop.x * 16 + 8;
               item.y = pos_drop.y * 16 + 8;
               item.droped = true;
               mdc.addItemTo(item, md, 'donations');
               people.onHand.remove(item);
               person.setData('onHand', []);           
           }
       }
       
       onHandAction (scene, person, item, md, tx, ty) {
           const people = this;
           const onHand = person.getData('onHand');
           const maxOnHand = person.getData('maxOnHand');
           const im = person.getData('itemMode');
           const mdc = scene.registry.get('mdc');
           const pos_person = person.getTilePos();
           const pos_item = item? item.getTilePos(): {x:0, y:0};
           const d = Phaser.Math.Distance.BetweenPoints( pos_person, pos_item  );
           // pick up an item
           if( im === 1 ){
              if(d < 2 && item.droped && onHand.length < maxOnHand ){
                   if( item.iType === 'Container'){
                       const item_new = item.spawnItem(scene);
                       if(item_new){
                           item_new.setPrice(0.50, 0);
                           onHand.push( item_new );
                           people.onHand.add(item_new);
                       }
                   }
                   if( item.iType === 'Item' ){
                       item.setPrice(0.50, 0);
                       mdc.removeItemFrom(item, md, 'donations');
                       onHand.push( item );
                       people.onHand.add(item);
                   }
              }
              if(onHand.length >= maxOnHand);
           }
           // drop what you have on hand
           if( im === 2 && onHand.length > 0 ){
              if( item ){
                  if(item.iType === 'Container'){
                      item.setFrame(item.prefix + '_close');
                      const item2 = onHand.pop();
                      const res = item.addItem( item2 );
                      if(res){
                          people.onHand.remove(item2);
                      }
                      if( !res ){
                          onHand.push(item2);
                      }
                  }
              }
              if( !item ){ // drop a loose item       
                  const item2 = onHand.pop();
                  item2.x = tx * 16 + 8;
                  item2.y = ty * 16 + 8;
                  mdc.addItemTo(item2, md, 'donations');
                  people.onHand.remove(item2);     
              }
           }
           // pick up a container
           if( im === 3 && item ){
               if(item.iType === 'Container'){
                   mdc.removeItemFrom(item, md, 'donations'); 
                   item.setFrame(item.prefix + '_close');
                   onHand.push( item );
                   people.onHand.add(item);
               } 
           }
       }

       update (scene, md, delta) {
           const mdc = scene.registry.get('mdc'); scene.registry.get('player');
           this.getData('subTypes');
           const arr_people = this.getChildren();
           this.spawnPerson(mdc, md, scene);
           let i_people = arr_people.length;
           while(i_people--){
               const person = arr_people[i_people];
               const action = person.getData('act');
               const spt = get_spt( person, person.getData('subType') );
               //if(spt && ( person != player && !mdc.zeroPlayerMode ) ){
               if(spt){
                   spt.update(mdc, md, this, scene, person);
                   const tx = Math.floor(person.x / 16);
                   const ty = Math.floor(person.y / 16);
                   md.map.getTileAt(tx, ty, false, 0);
                   if(!action.done && person.getData('path').length === 0){
                       action.noPath(md);
                   }
                   person.update(scene);
                   person.pathProcessorCurve( scene, (scene, person) => {
                       // !!! just door checks for 'worker' type people ( for now )
                       if(person.getData('type') === 'worker'){
                           mdc.doorCheck(scene, person, md);
                       }
                       person.setData('path', []);
                       person.nCurve = 0;    
                   });
                   if(!action.done){
                       action.update(md, delta);
                   }
                   //TASKS[person.task].update(mdc, md, this, scene, person);
                   

                   
                   person.getData('task').update(mdc, md, this, scene, person);
                   
               }                                
           }
       }
       
   }

   const log$3 = new ConsoleLogger ({
       cat: 'lib',
       id: 'mapdata',
       appendId: true
   });

   const boundingBox = function (x1, y1, w1, h1, x2, y2, w2, h2) {
       return !(
           (y1 + h1) < y2 ||
           y1 > (y2 + h2) ||
           (x1 + w1) < x2 ||
           x1 > (x2 + w2));
   };

   const layer_pointer_event = ( scene, md  ) => {
       return (pointer, px, py) => {
           const player = scene.registry.get('player'),
           mdc = scene.registry.get('mdc'),
           tx = Math.floor( pointer.worldX / 16 ),
           ty = Math.floor( pointer.worldY / 16 ),
           tile = md.map.getTileAt(tx, ty, false, 0),
           items = md.getItemsAtPX(px, py),
           item = items[0];
           if(mdc.zeroPlayerMode){
               log$3('zero player mode');
               log$3(tx + ', ' + ty);
               log$3(items);
               log$3('');
           }
           if(!mdc.zeroPlayerMode && player){
               const itemMode = player.getData('itemMode'),
               pos = player.getTilePos();   
               if(item){
                   md.worker.onHandAction(scene, player, item, md, pos.x, pos.y);
               }
               if(tile && !item){
                   if(!md.canWalk(tile) ){
                       log$3(tile.index);
                   }
                   if(md.canWalk(tile) && itemMode != 2 && itemMode != 0 ){    
                       player.setPath(scene, scene.registry.get('mdc').getActive(), tx, ty);
                   }
                   if(itemMode === 2 ){
                       md.worker.onHandAction(scene, player, item, md, tx, ty);
                   }
               }    
               if(itemMode === 0){
                   if(tile){
                       log$3('********** **********');
                       log$3('tile info: ');
                       log$3('pos: ' + tile.x + ',' + tile.y);
                       log$3(tile);
                       log$3('********** **********');
                   }
                   if(items){
                       log$3('********** **********');
                       log$3('items info: ');
                       log$3('num of items: ' + items.length);
                       log$3(items);
                       log$3('********** **********');
                   }
               }
           }
       };
   };

   class MapData {

       constructor (scene, map_index=0, opt) {
           opt = opt || {};
           const md = this;
           this.mdc = opt.mdc;
           this.index = map_index;
           opt.sheet = opt.sheet || 'map_16_16';
           const hmd = this.hardMapData = scene.cache.json.get('map' + map_index + '_data');
           const data = scene.cache.tilemap.get('map' + map_index).data.trim().split(/\n/g).map( (row, i_row) => {
               return row.split(',').filter((n)=>{ return !(String(parseInt(n)) === 'NaN') }).map((n, i_col) => {
                   const i = parseInt(n);
                   return hmd.tilePalette.indices[i][1];
               });    
           });
           const map = this.map = scene.make.tilemap({ data: data, layers:[], tileWidth: 16, tileHeight: 16 });
           const tiles = this.tiles = map.addTilesetImage(opt.sheet);
           const layer0 =  this.layer0 = map.createLayer(0, tiles);
           layer0.depth = 0;
           layer0.visible = false;
           layer0.active = false;
           this.setupDonations(scene);
           layer0.setInteractive();
           layer0.on('pointerdown', layer_pointer_event( scene, md ) );
           this.customer = new People({
               scene: scene,
               defaultKey: 'people_16_16',
               maxSize: 10,
               
               createCallback : (person) => {}
           },{
               type: 'customer',
               TASKS: scene.registry.get('TASKS_CUSTOMER'),
               ACTIONS: scene.registry.get('ACTIONS_CUSTOMER'),
               md: md,
               spawnRate: 0,
               curveSpeed: 0.95,
               subTypes: hmd.customer.subTypes,
               subTypeProbs: hmd.customer.subTypeProbs
           });
           this.worker = new People({
               scene: scene,
               defaultKey: 'people_16_16',       
               maxSize: 10,
               createCallback : (person) => {}
           },{
               type: 'worker',
               TASKS: scene.registry.get('TASKS_WORKER'),
               ACTIONS: scene.registry.get('ACTIONS_WORKER'),
               md: md,
               spawnRate: 0,
               curveSpeed: 0.95,
               subTypes: [ 'employee' ],
               subTypeProbs: [ 1.00 ]
           }); 
       }
       
       getRecycling() {
           const rbins = this.donations.getChildren().filter( (item ) => {
               return item.key === 'recycle_bin';
           });
           if(rbins.length > 0){
               return rbins[0];
           }
           return null;
       }
       
       getItemsAtTile(pos = {x: 0, y: 0 }){
          return this.donations.getChildren().filter( (item ) => {
              const pos_item = item.getTilePos();
              if(!pos_item){
                  return false;
              }
              return pos_item.x === pos.x && pos_item.y === pos.y;
          });
       }
       
       getItemsAtPX (px=0, py=0) {
          return this.donations.getChildren().filter( (item) => {
              return boundingBox(item.x - 8, item.y - 8, 16, 16, px, py, 1, 1);
          }); 
       }
       
       canWalk (tx, y) {
          let t = tx;
          if(typeof tx != 'object'){
              t = this.map.getTileAt(tx, ty);
          }
          const w = this.hardMapData.tilePalette.walkable;
          let i = w.length;
          while(i--){
              if(w[i] === t.index){
                  return true;
              }
          }
          return false;
       }
       
       findSpot (pos, func, limit=10) {
           let spot = {x: pos.x, y: pos.y}, i = 0;
           while(i < limit){
               const rad = Math.PI * 2 / 8 * ( i % 8 );
               const ray = 1.00 + Math.floor( i / 8 );
               spot.x = pos.x + Math.round( Math.cos( rad ) * ray );
               spot.y = pos.y + Math.round( Math.sin( rad ) * ray );
               const tile = this.map.getTileAt(spot.x, spot.y);
               if(tile){
                   if( func.call(this, tile, spot.x, spot.y, ray, rad, i, limit) ){
                       return tile;
                   }
               }
               i += 1;
           }
           return null;
       }
       
       findWalkToNear (pos, limit=10){
            return this.findSpot(pos, function(tile){
               if(tile.index === 1){
                   return true;
               }
               return false;
           }, limit);
       
       }
       
       findItemNearSpot (pos, limit=10) {
           return this.findSpot(pos, function(tile){
               const items = this.getItemsAtTile( tile );
               if(!findEmpty && items.length >= 1){
                   return true;
               }
               return false;
           }, limit);
       }
       
       findEmptyDropSpot (pos, limit=10, empty=[1, 13, 14, 24]) {
           return this.findSpot( pos, function(tile) {
               const items = this.getItemsAtTile( tile );
               if(items.length === 0 && empty.some((i)=>{ return i === tile.index}) ){
                   return tile;
               }     
            });
       }
       
       getRandomWalkTo () {
          const hmd = this.hardMapData, tp = hmd.tilePalette;
          const options = this.map.filterTiles( ( tile ) => {
              return tp.walkable.some( (i) => {
                  return tp.indices[i][1] === tile.index;
              });
          });
          return options[ Math.floor( options.length * Math.random()) ];
       }
       
       setupDonations(scene){
           const donations = this.donations = new ItemCollection();
           const containers = this.hardMapData.objects.containers || {};
           const items = this.hardMapData.objects.items;
           const keys = Object.keys( containers );    
           keys.forEach( (key) => {
               containers[key].forEach( (obj) => {
                   const container = new Container(scene, key, {}, obj.x * 16 + 8, obj.y * 16 + 8);
                   container.droped = true;
                   donations.add(container);
                   scene.children.add(container);     
               });            
           });
           if(items){
               Object.keys(items).forEach( (key) => {
                   items[key].forEach( (obj) => {
                       const item = new Item(scene, key, {}, obj.x * 16 + 8, obj.y * 16 + 8);
                       item.droped = true;
                       item.setPrice(obj.shelf, obj.color);
                       donations.add(item);
                       scene.children.add(item);
                   });
               });
           }     
       }
       
       findDoorFrom ( x, y, map_index = -1, returnDoor=false ) {
           const doors = this.hardMapData.doors;
           const options = doors.filter( (door) => {
               if(map_index === -1){
                   return true;
               }
               return door.to.mapNum === map_index;
           });
           let near = {
               d: Infinity,
               oi: -1, // options index
               ai: -1  // array index if more than one pos
           };
           options.map( (door, oi) => {
               const pos = door.position;
               let d = 0;
               if(pos instanceof Array){
                   d = pos.map((obj, ai)=>{
                       const n = Phaser.Math.Distance.Between(obj.x, obj.y, x, y);
                       if(n < near.d){
                           near.d = n;
                           near.oi = oi; 
                           near.ai = ai;
                       }
                       return n;
                   });
               }
               if(!(pos instanceof Array)){
                   d = Phaser.Math.Distance.Between(pos.x, pos.y, x, y);
                   if(d < near.d){
                       near.d = d;
                       near.oi = oi; 
                       near.ai = -1;
                   }
               }    
               return d;     
           });
           if(options.length === 0){
               return null;
           }    
           if(returnDoor){
               return options[ near.oi ];
           }
           if(near.ai >= 0){
               return options[ near.oi ].position[ near.ai ];
           }
           return options[ near.oi ].position;
       }
       
       getDoorAt (x, y) {
           let di = 0;
           const doors = this.hardMapData.doors;
           const len = doors.length;
           while(di < len){
               const door = doors[di];
               if(x === door.position.x && y === door.position.y){
                  return door;
               }
               if(door.position instanceof Array){
                  let pi = 0, len = door.position.length;
                  while(pi < len){
                      const dx = door.position[pi].x, dy = door.position[pi].y; 
                      if(x === dx && y === dy){
                          return door;
                      }
                      pi += 1;
                  }
               }
               di += 1;
           }
           return null;
       }
       
       get_di_tiles ( scene ) {
           return this.map.filterTiles( ( tile ) => {
               if(!tile){
                   return false;
               }
               return tile.index === 13 || tile.index === 14 || tile.index === 23 || tile.index === 24;
           });
       };
       
   }
   class MapDataCollection {

       constructor (scene, opt={} ) {
           //opt = opt || {};
           
           //opt.startMapIndex = opt.startMapIndex === undefined ? 0 :  opt.startMapIndex;
           
           opt = Object.assign( {}, { startMapIndex: 0, zeroPlayerMode: false }, opt );

           this.scene = scene;
           this.mapData = {};
           this.nameNum = 0;
           
           this.startMapIndex = opt.startMapIndex;
           this.zeroPlayerMode = opt.zeroPlayerMode;
           
           const mapKeys = scene.cache.tilemap.getKeys();
           const arr = mapKeys.map((key)=>{ return parseInt(key.replace(/map/, '')) });
           arr.sort((a,b)=>{ if(a < b){ return -1} if(b < a){ return 1 } return 0; });
           this.i_start = arr[0]; 
           let i_map = this.i_start;
           this.i_stop = arr.slice(arr.length - 1, arr.length)[0] + 1;
           while(i_map < this.i_stop){
               const md = new MapData(scene, i_map, { mdc: this });
               this.mapData[ 'map' + i_map ] = md;
               i_map += 1;
           }
           this.activeIndex = opt.startMapIndex;
           
           this.getMapDataByIndex(this.activeIndex);
           
           // insure that there is one person at least?
           
           //const worker = md.worker.spawnPerson(this, md, scene, true);
           //if(!opt.player){
           //    scene.registry.set('player', worker);
           //}
           
           
       }
      
       newName( prefix='worker' ) {
           const n = this.nameNum;
           this.nameNum += 1;
           return prefix + '#' + n;
       }
      
       doorCheck (scene, person, md) {
           const mdc = this;
           md = md === undefined ? mdc.getActive() : md;
           const pType = person.getData('type');
           const pos = person.getTilePos();
           const door = md.getDoorAt(pos.x, pos.y);
           if(door){ 
               const nmd = mdc.getMapDataByIndex(door.to.mapNum);      
               const pos = nmd.hardMapData.doors[door.to.doorIndex].position;
               person.x = pos.x * 16 + 8;
               person.y = pos.y * 16 + 8;     
               if(pos instanceof Array){
                   person.x = pos[0].x * 16 + 8;
                   person.y = pos[0].y * 16 + 8;     
               }
               md[pType].transToNewMap(person, nmd, md);
               if(person === scene.registry.get('player')){
                   mdc.setActiveMapByIndex(scene, nmd.index);
               }
               return door;           
           }
           return null
       }
      
       forAllMaps (scene, func) {
           let i = this.i_start;
           while(i < this.i_stop){       
               func(scene, this.getMapDataByIndex(i), i);
               i += 1;
           }
       }
      
       setActiveMapByIndex (scene, index) {
           this.activeIndex = index;
           this.forAllMaps(scene, (scene, md, i)=>{
               scene.registry.get('player');
               const bool = index === i;
               if(bool){
                   scene.physics.world.setBounds(0,0, md.map.width * 16, md.map.height * 16);
               }
           });
           return this.getMapDataByIndex(index);
       }
      
       addItemTo(item, md, collection='donations'){
           md === undefined ? this.getActive() : md;
           if(typeof md === 'number'){
               md = this.getMapDataByIndex( md );
           }
           md[collection].add(item);
           item.droped = true;
           if(collection === 'donations'){
               item.droped = true;
          }
       }
      
       removeItemFrom(item, md, collection='donations'){
           item.droped = false;
           md[collection].remove(item);
       }
      
       getMapDataByIndex(index){
           return this.mapData[ 'map' + index ];
       }
       
       getMapDataByPerson(person){
           let mi = 0, len = Object.keys(this.mapData).length;
           while(mi <= len){
               
               const md = this.getMapDataByIndex(mi);
               if(md){
               
                   if(md.worker.getChildren().some( (el)=>{ return el === person  } ) ){
                   
                       return md;
                   
                   }
               }
               
               mi += 1;
           }
           return null;
       }
      
       getActive(){
           return this.getMapDataByIndex( this.activeIndex );
       }
      
       update(time, delta){
           const mdc = this;
           mdc.forAllMaps(this.scene, (scene, md, map_index)=>{     
               md.customer.update(scene, md, delta);
               md.worker.update(scene, md, delta);
               const bool = map_index === mdc.activeIndex;
               md.layer0.active = bool;
               md.layer0.visible = bool;
               md.donations.setVisible(bool);
               md.customer.setActive(bool);
               md.customer.setVisible(bool);
               md.customer.onHand.setActive(bool);
               md.customer.onHand.setVisible(bool);
               md.worker.setActive(bool);
               md.worker.setVisible(bool);
               md.worker.onHand.setActive(bool);
               md.worker.onHand.setVisible(bool);
           });
       }

   }

   const MapLoader = function(opt) {
      opt = opt || {};
      opt.mapIndicesStart = opt.mapIndicesStart || 0;
      opt.mapIndicesStop = !opt.mapIndicesStop ? 1: opt.mapIndicesStop;
      opt.urlBase = opt.urlBase || './';
      opt.scene = opt.scene || this;  
      let i_map = opt.mapIndicesStart;
      while( i_map < opt.mapIndicesStop ){
          opt.scene.load.json('map' + i_map + '_data', opt.urlBase + 'map' + i_map + '_data.json');
          opt.scene.load.tilemapCSV('map' + i_map, opt.urlBase + 'map' + i_map + '.csv');
          i_map += 1;
      }
   };

   new ConsoleLogger({
       cat: 'state',
       id: 'load',
       appendId: true
   });

   const ITEM_FILES = ['containers_1', 'household_1'];

   class Load extends Phaser.Scene {

       constructor (config) {
           super(config);
           this.key = 'Load';
       }

       preload(){
           const scene =  this;
       
           this.load.setBaseURL('./');
           // SHEETS               
           this.load.image('map_16_16', 'json/sheets/map_16_16.png');
           this.load.atlas('menu_1', 'json/sheets/menu_1.png', 'json/sheets/menu_1.json');
           this.load.atlas('people_16_16', 'json/sheets/people_16_16.png', 'json/sheets/people_16_16.json');
           this.load.atlas('donations_16_16', 'json/sheets/donations_16_16.png', 'json/sheets/donations_16_16.json');
           this.load.atlas('timebar', 'json/sheets/timebar.png', 'json/sheets/timebar.json');
           // FONTS
           this.load.bitmapFont('min', 'fonts/min.png', 'fonts/min.xml');
           this.load.bitmapFont('min_3px_5px', 'fonts/min_3px_5px.png', 'fonts/min_3px_5px.xml');
           // MAP DATA
           MapLoader({
             scene: this,
             urlBase: 'json/maps/', //'drafts/mapdata/',
             mapIndicesStart: 1, mapIndicesStop: 5
           });
           // PEOPLE
           this.load.json('people_core', 'json/people/people_core.json');
           // ITEM DATA
           //this.load.json('items_index', 'json/items/items_index.json');
           
           ITEM_FILES.forEach( (fn) => {
               scene.load.json(fn, 'json/items/' + fn + '.json');
           });
           
           //this.load.json('household_1', 'json/items/household_1.json');
           //this.load.json('containers_1', 'json/items/containers_1.json');
           
           const gr = this.add.graphics();
           gr.fillStyle(0x000000);
           gr.fillRect(0,0,640,480);           
           this.load.on(Phaser.Loader.Events.PROGRESS, (progress) => {
               //log( (progress * 100).toFixed(2) + '%' ); 
               gr.lineStyle(20, 0xffffff, 1);
               gr.beginPath();
               gr.arc(320, 240, 100, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(270 + 360 * progress), false);
               gr.strokePath();
           });
       }
       
       create () {
       
       
           ItemTools.genIndex(this, ['containers_1', 'household_1']);
       
           this.scene.start('MainMenu');
       }

   }

   new ConsoleLogger ({
       cat: 'lib',
       id: 'schedule',
       appendId: true
   });

   const mod = function(x, m) {
    
       return (x % m + m) % m;
   };

   /********* **********
     1.0) - COLOR TAG SYSTEM
   ********** *********/
   const COLOR = {};

   COLOR.first_tuesday = new Date(2025, 0, 7);
   COLOR.first_index = 0;
   COLOR.data = [
       { i: 0, desc: 'lavender', web: '#ff00aa' },
       { i: 1, desc: 'green',    web: '#00ff00' },
       { i: 2, desc: 'red',      web: '#ff0000' },
       { i: 3, desc: 'orange',   web: '#ff8800' },
       { i: 4, desc: 'yellow',   web: '#ffff00' },
       { i: 5, desc: 'blue',     web: '#0000ff' },
   ];
   COLOR.keys = COLOR.data.map((obj, i)=>{ return i; });

   COLOR.get_current_colors = ( print_index=0 ) => {
       if( typeof print_index === 'string' ){
           const options = COLOR.data.filter((obj)=>{
               return obj.desc === print_index.toLowerCase().trim();
           });
           if(options.length >= 1){
              print_index = options[0].i;
           }
           if(options.length === 0){
               print_index = 0;
           }
       }
       const len = COLOR.keys.length;
       const pi = print_index % len;
       return {
           print: COLOR.data[ COLOR.keys[ pi ] ],
           d25: COLOR.data[ COLOR.keys[ ( pi + 2 ) % len ] ],
           d50: COLOR.data[ COLOR.keys[ ( pi + 3 ) % len ] ],
           d75: COLOR.data[ COLOR.keys[ ( pi + 4 ) % len ] ],
           cull: COLOR.data[ COLOR.keys[ ( pi + 5 ) % len ] ]
       };
   };

   /********* **********
     2.0) - TimedEvent Class
   ********** *********/

   class TimedEvent {

       constructor ( opt = {} ) {
           opt = Object.assign({}, { scene: null, time_start: 0, time_length: 1000 * 30, time_cd: 0 }, opt);
           Object.assign(this, opt);
           this.time = 0;
           this.rnd = new Phaser.Math.RandomDataGenerator();
           this.id = this.rnd.uuid();
           this.disp_top = this.id;
           this.disp_bottom = this.id;
           this.scene = opt.scene;
           this.active = false;
           this.purge = false;
           this.gameTime = opt.gt || null;    
           this.sprite = null;
           this.canvas = null;
           this.img = null;
           this.ctx = null; 
       }
       
       createGameObjects (tb, n=0) {
           const sprite = this.sprite = tb.group_te.get( 0, 0, 'timebar', 'event_bg');
           sprite.visible = true;
           sprite.depth = 10;
           sprite.setScrollFactor(0, 0);
           const key = 'te_' + this.id;
           this.canvas = this.scene.textures.createCanvas(key, 100, 25);
           Object.keys( this.scene.textures.list ).filter( (key) => {
               return key.match(/^te/);
           });
           const img = this.img = this.scene.add.image( 0, 0, key);
           img.visible = true;
           img.depth = 10;
           img.setScrollFactor(0, 0);
           this.ctx = img.texture.context;
           this.img.depth = 20;    
       }
       
       killGameObjects () {
       
           this.ctx = null;
           this.canvas.destroy();
           this.img.destroy();
       
       }
       
       draw () {
          
          const ctx = this.ctx;
          
          if(!ctx){
              return;
          }
          
          this.img.x = this.sprite.x;
          this.img.y = this.sprite.y;
          
          ctx.fillStyle = 'white';

          ctx.textBaseline = 'top';
          const fs1 = 7, fs2 = 10;
          ctx.font = fs1 + 'px arial';
          ctx.fillText(this.disp_top, 2, 2);
          ctx.font = fs2 + 'px arial';
          ctx.fillText(this.disp_bottom, 2, (2 + fs1) + 2);
          
          
          this.canvas.refresh();
       
       }

       on_tick = []
       on_start = []
       on_update = []
       on_end  = []

       
       addEvent ( type='start', cb=function(){} ) {
           this['on_' + type].push(cb);
       }
       
       update (time, msDelta) {
           this.time = time;
           this.time_cd = this.time_start - this.time; 
           const te = this;
           const time_end = this.time_start + this.time_length;
           if( time >= this.time_start && time < time_end && !this.active ){
               this.active = true;
               this.on_start.forEach( (cb) => {
                   cb.call(te, te, te.gameTime);
               });
           }
           if( time >= this.time_start && time < time_end && this.active ){
               this.on_update.forEach( (cb) => {
                   cb.call(te, te, te.gameTime, msDelta);
               });
           }
           if( time >= time_end && !this.purge){
               this.active = false;
               this.purge = true;
               this.on_end.forEach( (cb) => {
                   cb.call(te, te, te.gameTime);
               });
           }
           this.on_tick.forEach( (cb) => {
               cb.call(te, te, te.gameTime, msDelta);
           });
       }
       
   }
   /********* **********
     3.0) - GameTime Class
   ********** *********/

   class GameTime {

       constructor ( opt = {} ) {
           this.scene = opt.scene;
           this.multi = opt.multi || 1;
           this.start = [ 9 ];
           this.end = [ 18 ];
           this.real = opt.real || false;
           
           const d = this.jsDate = opt.jsDate || new Date();
           this.year = d.getFullYear();
           this.month = d.getMonth() + 1;
           this.day = d.getDate();
           this.hour = d.getHours();
           this.minute = d.getMinutes();
           this.second = d.getSeconds();
           this.ms = d.getMilliseconds();
           this.time = d.getTime();
           
           this.set( opt );
           this.timedEvents = [];
           /*
           const d = this.jsDate = opt.jsDate || new Date();
           this.year = d.getFullYear();
           this.month = d.getMonth() + 1;
           this.day = d.getDate();
           this.hour = d.getHours();
           this.minute = d.getMinutes();
           this.second = d.getSeconds();
           this.ms = d.getMilliseconds();
           this.time = d.getTime();   
           */
       }
       
       getByDelta (minutes=30) {
           const d = new Date( minutes * 60 * 1000 + this.jsDate.getTime()  );
           return {
               hour: d.getHours(),
               minute: d.getMinutes(),
               day: d.getDate()
           }
       }
       
       getDayPer () {
           const hour_start = this.start[0];
           const hour_end = this.end[0];
           return ( this.hour - hour_start + ( this.minute / 60 ) ) / (hour_end - hour_start);
       }
       
       addTimedEvent (opt) {
           const gt = this;
           const d = gt.jsDate;
           opt = Object.assign({}, {
               year: d.getFullYear(), month: d.getMonth(), day: d.getDate(),
               start: [ 10, 0 ],
               end : [14, 0]
           },  opt);
           const d_start = new Date( opt.year, opt.month, opt.day, opt.start[0], opt.start[1], 0, 0 );
           const d_end = new Date( opt.year, opt.month, opt.day, opt.end[0], opt.end[1], 0, 0 );
           const te = new TimedEvent({
               scene: this.scene, 
               gt : gt,
               time_start: d_start.getTime(),
               time_length: d_end.getTime() - d_start.getTime()
           });
           
           ['tick', 'start', 'update', 'end'].forEach( (type)=> {
               if(opt['on_' + type]){
                   te.addEvent(type, opt['on_' + type] );
               }
           });
           
           this.timedEvents.push( te );
           return te;
       }
       
       setFromDate ( d=Date.now() ) {
           this.year = d.getFullYear();
           this.month = d.getMonth() + 1;
           this.day = d.getDate();
           this.hour = d.getHours();
           this.minute = d.getMinutes();
           this.second = d.getSeconds();
           this.ms = d.getMilliseconds();
           this.time = d.getTime();
           this.jsDate = d;
       }
       
       setFromTimestamp ( time=0 ){
           this.setFromDate( new Date( time ) );
       }
       
       set ( opt = {} ) {    
           const d = COLOR.first_tuesday;
           opt = Object.assign({
               time: null, 
               year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(),
               hour: 0, minute: 0, second: 0, ms: 0
           }, opt);
           if(!this.real && opt.time != null && typeof opt.time === 'object' ){
               this.setFromDate(opt.time);
           }
           if(!this.real && opt.time != null && (typeof opt.time === 'number' || typeof opt.time === 'string')){
               this.setFromTimestamp(parseInt(opt.time));
           }
           if(!this.real && opt.time == null){
               const d = new Date(opt.year, opt.month - 1, opt.day, opt.hour, opt.minute, opt.second, opt.ms);
               this.setFromDate(d);
           }
           if(this.real){
               this.setFromDate( new Date() );
           }
           this.jsDate = new Date( this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.ms );
           this.time = this.jsDate.getTime();
           const ms = Math.round( this.time - COLOR.first_tuesday.getTime() );
           this.print_count = Math.floor( ms  / ( 1000  * 60 * 60 * 24 * 7) );
           this.print_index = mod(COLOR.first_index - this.print_count, COLOR.data.length);
           this.color = COLOR.get_current_colors( this.print_index );
       }
       
       step ( msDelta=0, opt={} ) {
           const gt = this;
           opt = Object.assign({}, { onPurge: null }, opt);
           if(!this.real){
               this.set( Object.assign( {}, this, { time: this.time + ( msDelta * this.multi ) } ) );
           }
           if(this.real){
               this.setFromDate( new Date() );
           }
           this.per = this.getDayPer();
           let i_te = this.timedEvents.length;
           while(i_te--){
               const te = this.timedEvents[i_te];
               te.update(gt.time, msDelta);
               te.draw();
               if(te.purge){
                   if(opt.onPurge){
                       opt.onPurge.call(gt, te, gt);
                   }
                   this.timedEvents.splice(i_te, 1);
               }
           }
           if(!this.real){
               if(this.per < 0){
                   this.set( Object.assign( {}, this, { time: null, hour: this.start[0] } ) );
               }
               if(this.per >= 1){
                   this.set( Object.assign( {}, this, { time: null, hour: this.start[0], day: this.day + 1 } ) );
               }
           }
       }

   }
   /********* **********
     4.0) - TimeBar Class
   ********** *********/

   const STR_WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

   class TimeBar  {

       constructor ( opt = {} ) {
           opt = Object.assign({}, { scene: null, w: 600, h: 50, x: 320, y: 25, max_te_sprites: 10 }, opt);
           this.w = opt.w;
           this.h = opt.h;
           this.x = opt.x - opt.w / 2;
           this.y = opt.y - opt.h / 2;
           this.gt = opt.gt || new GameTime({scene: opt.scene});
           this.img_bg = opt.scene.add.image( opt.x, opt.y, 'timebar', 'timebar_bg');
           this.img_bg.setScrollFactor(0, 0);
           this.img_bg.depth = 10;
           
           this.img_ct_print = opt.scene.add.image( opt.x, opt.y + 8, 'timebar', 'colortag_0_0');
           this.img_ct_print.depth = 10;
           this.img_ct_print.setScrollFactor(0, 0);
           this.img_ct_d25   = opt.scene.add.image( opt.x + 32, opt.y + 8, 'timebar', 'colortag_0_1');
           this.img_ct_d25.depth = 10;
           this.img_ct_d25.setScrollFactor(0, 0);
           this.img_ct_d50   = opt.scene.add.image( opt.x + 64, opt.y + 8, 'timebar', 'colortag_0_2');
           this.img_ct_d50.depth = 10;
           this.img_ct_d50.setScrollFactor(0, 0);
           this.img_ct_d75   = opt.scene.add.image( opt.x + 96, opt.y + 8, 'timebar', 'colortag_0_3');
           this.img_ct_d75.depth = 10;
           this.img_ct_d75.setScrollFactor(0, 0);
           this.img_ct_cull  = opt.scene.add.image( opt.x + 128, opt.y + 8, 'timebar', 'colortag_0_4');
           this.img_ct_cull.depth = 10;
           this.img_ct_cull.setScrollFactor(0, 0);
           this.text_time = opt.scene.add.bitmapText( opt.x - 16, opt.y - 16, 'min_3px_5px', '');
           this.text_time.setScrollFactor(0, 0);
           this.text_time.depth = 10;
           this.text_time.scale = 1.0;
           this.group_te = opt.scene.add.group([], {
               classType: Phaser.GameObjects.Sprite,
               maxSize: opt.max_te_sprites
           });        
           this.update();
       }
       
       
       update (delta=0) {
           const tb = this;
           const gt = tb.gt;
           gt.step(delta, {
               onPurge: function(te, gt){
                   if(te.sprite){
                       tb.group_te.killAndHide( te.sprite );
                       te.killGameObjects();
                   }
               }
           });
           const len = gt.timedEvents.length;
           let i_te = 0;
           while(i_te < len){
               const te = gt.timedEvents[i_te];
               const time_scale_min = 60;
               const time_cd_min = te.time_cd / 1000 / 60;
               if(!te.sprite && time_cd_min <= time_scale_min){
                   te.createGameObjects(tb);
                   te.sprite.setScale(1);
               }
               if(te.sprite && time_cd_min <= time_scale_min && time_cd_min >= 0){
                   const per = time_cd_min / time_scale_min;
                   te.sprite.x = 50 + (640 + 50) * per;
                   te.sprite.y = 50 + 10 * 1;
               }
               if(te.sprite && time_cd_min < 0){
                   te.sprite.x = 50;
                   te.sprite.y = 50 + 10 * 2;
               }
               i_te += 1;
           }
           const str_date = STR_WEEK_DAYS[gt.jsDate.getDay()] + ' ' +
               String(gt.month).padStart(2, '0') + '/' + 
               String(gt.day).padStart(2, '0') + '/' +
               gt.year;
           const str_time = String(gt.hour).padStart(2, '0') + ':' + 
               String(gt.minute).padStart(2, '0') + ':' + 
               String(gt.second).padStart(2, '0');
           Object.keys(gt.color).forEach((key, ci) => {
               gt.color[ key ];
               const frame = 'colortag_' + gt.print_index + '_' + ci;
               tb['img_ct_' + key].setFrame(frame);
           });
           this.text_time.text = str_date + '  ' + str_time;
           this.text_time.setCharacterTint(0, this.text_time.text.length, true, 0x000000);     
       }

   }

   new ConsoleLogger({
       cat: 'lib',
       id: 'ui',
       appendId: true
   });
   /********* **********
    BUTTON CLASS
   ********** *********/
   class Button extends Phaser.GameObjects.Sprite {
       constructor (scene, opt= {} ) {
           opt = Object.assign( {}, { x: 0, y: 0, texture: '', frame: 0}, opt );
           super( scene, opt.x, opt.y, opt.texture, opt.frame );
           const button = this;
           button.setInteractive();
           button.press = opt.press || this.press;
           button.draw = opt.draw || this.draw;   
           this.depth = 10;
           this.setScrollFactor(0, 0);
       }
       
       draw (ctx, canvas, i, menu) {
           const button = this, fw = menu.fw, fh = menu.fh, lw = menu.lineWidth, hlw = lw / 2;
           ctx.fillStyle = menu.colors[0] || '#ffffff';
           ctx.fillRect( 0, fh * i, fw, fh);
           if(i === menu.member_index){
               ctx.lineWidth = lw;
               ctx.strokeStyle = menu.colors[2] || '#000000';
               ctx.strokeRect( hlw, fh * i + hlw, fw - lw, fh - lw);
           }
           ctx.fillStyle = menu.colors[1] || '#000000';
           ctx.textBaseline = 'middle';
           ctx.textAlign = 'center';
           ctx.font = Math.floor( fh * 1.00 ) + 'px monospace';
           ctx.fillText( button.getData('desc'), fw / 2, fh * i + fh * 0.60);
           
       }
       
       press () {
           console.log('default button press!');
       }
   }
   /********* **********
    GlobalControl + helpers
   ********** *********/

   const key_check_menu = function (scene, event) {
       const menu_key = scene.registry.get('menu_key') || 'menu_default';
       const menu = scene.registry.get(menu_key);
       /*
       if(menu && event.key === 'ArrowUp'){
           menu.member_index -= 1;
           event.preventDefault();
       }
       if(menu && event.key === 'ArrowDown'){
           menu.member_index -= 1;
           event.preventDefault();
       }
       */
       if(menu && event.key === 'Tab'){
           if(event.shiftKey){
               menu.member_index -= 1;
           }
           if(!event.shiftKey){
               menu.member_index += 1;
           }
           event.preventDefault();
       }
       const len = menu.getChildren().length;
           if(menu.member_index >= len){
               menu.member_index %= len;
           }
           if(menu.member_index < 0){
               menu.member_index = len - 1;
           }
           if(menu && event.key === 'Enter'){
               const member = menu.getChildren()[ menu.member_index ];
              member.press();
       }
   };



   const key_check_digit = (function(){
       const IMDESC = ['tile info', 'item pickup', 'item drop', 'container pickup\/drop' ];
       return function (scene, event) {
           const mDigit = event.code.match(/Digit\d+/);
           const mdc = scene.registry.get('mdc');
           scene.registry.get('cam_state');
           if(mDigit && !mdc.zeroPlayerMode){
               const d = Number( mDigit[0].replace('Digit', '') );
               const player = scene.registry.get('player'); 
               if(d >= 0 && d < 4){
                   scene.mp.push('Switched to item mode ' + d + '\( ' + IMDESC[d] + ' \)','INFO');
                   player.setData('itemMode', d);
               }
           }
           if(mDigit && mdc.zeroPlayerMode){
               const d = Number( mDigit[0].replace('Digit', '') );
               if(d >= 1 && d <= 4){
               
                   GlobalControl.setMap(scene, d);
               
                   //const md = mdc.setActiveMapByIndex(scene, d);
                   //const mx = md.map.widthInPixels, my = md.map.heightInPixels;   
                   //cam_state.x = Math.round( md.map.widthInPixels / 2 );
                   //cam_state.y = Math.round( md.map.heightInPixels / 2 );
                   //GlobalControl.centerCamToMap(scene, md);
               }
           }
       }
   }());

   const key_check_char = function(scene, event){
       const mKey = event.code.match(/Key[a-zA-Z]+/);
       const mdc = scene.registry.get('mdc');
       const player = scene.registry.get('player');
       if(mKey){
           const k = mKey[0].replace('Key', '').toUpperCase();
           if(k === 'W' && !mdc.zeroPlayerMode && scene.nextWorker ){
               scene.nextWorker();
           }
           let dbs = scene.registry.get('dbs');
           if(k === 'D' && dbs){
               dbs.toggleActive();
           }
           if(k === 'Z' && dbs){
               
               if(!mdc.zeroPlayerMode && player){
                   const md = mdc.getMapDataByPerson(player);
                   md.worker.setTask(scene, mdc, md, player, 'default' );
                   scene.registry.remove('player');
                   //scene.registry.set('player', null);
               }
               
               if(mdc.zeroPlayerMode);
               
               
               
               mdc.zeroPlayerMode = !mdc.zeroPlayerMode;
           }
       }
   };

   const CAM_STATE_DEFAULT = { x:0, y:0, z:1, delta: 8 };

   const GlobalControl = {

       setUp (scene) {
           scene.cursors = scene.input.keyboard.createCursorKeys();
           this.setCamState(scene);
           scene.input.keyboard.on('keydown', (event) => {
               const menu_key = scene.registry.get('menu_key') || 'menu_default';
               scene.registry.get( menu_key );
               key_check_menu(scene, event);
               key_check_digit(scene, event);
               key_check_char(scene, event);
           });
       },
       
       setMap (scene, index) {
           const mdc = scene.registry.get('mdc');
           const md = mdc.setActiveMapByIndex(scene, index);
           GlobalControl.centerCamToMap(scene, md);
       },
       
       centerCamToMap (scene, md) {
           let cam_state = scene.registry.get('cam_state');
           cam_state.x = Math.round( md.map.widthInPixels / 2 );
           cam_state.y = Math.round( md.map.heightInPixels / 2 );
       },
       
       setCamState (scene, opt= {} ) {
           //const mdc = scene.registry.get('mdc');
           let cam_state = scene.registry.get('cam_state') || CAM_STATE_DEFAULT;
           cam_state = Object.assign({}, cam_state, opt);
           scene.registry.set('cam_state', cam_state );
       },
       
       moveCam (scene, dx=0, dy=0) {
           const mdc = scene.registry.get('mdc');
           const md = mdc.getActive(); 
           let cam_state = scene.registry.get('cam_state') || CAM_STATE_DEFAULT;
           cam_state.x += dx * cam_state.delta;
           cam_state.y += dy * cam_state.delta;
           const mx = md.map.widthInPixels, my = md.map.heightInPixels;
           cam_state.x = cam_state.x < 0 ? 0 : cam_state.x;
           cam_state.x = cam_state.x > mx ? mx : cam_state.x;
           cam_state.y = cam_state.y < 0 ? 0 : cam_state.y;
           cam_state.y = cam_state.y > my ? my : cam_state.y;
           scene.registry.set('cam_state', cam_state );
       },
       
       cursorCheck (scene, dir='left') {
           const mdc = scene.registry.get('mdc');
           const cam_state = scene.registry.get('cam_state');
           let dx = 0, dy = 0;
           if(dir === 'left'){  dx = -1; }
           if(dir === 'right'){  dx = 1; }
           if(dir === 'up'){  dy = -1; }
           if(dir === 'down'){  dy = 1; }       
           if(mdc.zeroPlayerMode){
               if ( scene.cursors[dir].isDown ) {
                   /*const md = mdc.getActive();            
                   cam_state.x += dx * cam_state.delta;
                   cam_state.y += dy * cam_state.delta;
                   const mx = md.map.widthInPixels, my = md.map.heightInPixels;
                   cam_state.x = cam_state.x < 0 ? 0 : cam_state.x;
                   cam_state.x = cam_state.x > mx ? mx : cam_state.x;
                   cam_state.y = cam_state.y < 0 ? 0 : cam_state.y;
                   cam_state.y = cam_state.y > my ? my : cam_state.y;
                   */
                   
                   this.moveCam(scene, dx, dy);
                   
               }
           }  
           const player = scene.registry.get('player');
           if(!mdc.zeroPlayerMode && player){
               mdc.getActive();
               const path = player.getData('path');
               if(path.length > 1 ){
                   return;
               }
               const cPos = player.getTilePos();
               if ( scene.cursors[dir].isDown ) {
                   const md = mdc.getActive();
                   cam_state.x = player.x;
                   cam_state.y = player.y;
                   const tile = md.map.getTileAt(cPos.x + dx, cPos.y + dy, false, 0);
                   if(tile){
                       if(md.canWalk(tile)){
                           player.setPath(this, md, cPos.x + dx, cPos.y + dy);
                       }
                   }   
               }
           }
       },
       
       update (scene, time, delta ) {
       
           GlobalControl.cursorCheck(scene, 'left');
           GlobalControl.cursorCheck(scene, 'right');
           GlobalControl.cursorCheck(scene, 'up');
           GlobalControl.cursorCheck(scene, 'down');
       
       }

   };

   /********* **********
    Menu Class
   ********** *********/

   class Menu extends Phaser.GameObjects.Group {

       constructor (scene, confMenu= {} ) {
           confMenu = Object.assign( {}, { members: [] }, confMenu );
           super( scene, [],  {
               // https://docs.phaser.io/api-documentation/typedef/types-gameobjects-group#groupconfig
               classType: Button,
               name : confMenu.name,
               active : true,
               maxSize: confMenu.members.length
           });
           
           this.lineWidth = confMenu.lineWidth === undefined ? 6 : confMenu.lineWidth;
           this.member_index = 0;
           this.colors = confMenu.colors;
           
           const menu = this;
           
           const fw = this.fw = confMenu.frameWidth;
           const fh = this.fh = confMenu.frameHeight;
           const w = fw, h = fh * confMenu.members.length;
           const tb = this.texture_buttons = scene.textures.createCanvas(confMenu.textureKey, w, h);
           scene.textures.addSpriteSheet('sheet_buttons', tb, confMenu);
           
           confMenu.members.forEach( (data_button, bi) => {
           
               let x = confMenu.x;
               let y = confMenu.y;
               
               if(typeof data_button.x === 'number'){
                  x = confMenu.x + data_button.x;
               }
               if(typeof data_button.y === 'number'){
                   y = confMenu.y + data_button.y;
               }
               if(typeof data_button.y != 'number'){
                   y = confMenu.y + confMenu.frameHeight * bi + confMenu.menu_spacing * bi;
               }
           
               const button = menu.get( {
                   x: x,  y: y,
                   texture: confMenu.textureKey, 
                   frame: bi,
                   press : data_button.press,
                   draw : data_button.draw || confMenu.draw
               } );
               
               button.setData('desc', data_button.desc || '');
               
               button.on('pointerdown', (e) => {
                   button.press();
               });
               
               button.on('pointermove', (e) => {
                   menu.member_index = bi;
               });
               
           });
           
           scene.registry.set( confMenu.menu_key, menu );
           scene.registry.set('menu_key', confMenu.menu_key);
           
       }
       
       draw () {
           const tb = this.texture_buttons; 
           const ctx = tb.context;
           this.fw;
           this.fh;
           const menu = this;
           menu.getChildren().forEach( ( button, i ) => {
               button.draw(ctx, tb.canvas, i, menu);          
           });
           tb.refresh();
       }
               
       static createConf (opt = {} ) {
           return Object.assign({}, {
               x: 320, y: 200,
               colors: ['green', 'white', 'rgba(255,255,255,0.25)'],
               textureKey: 'texture_buttons',
               menu_key: 'menu_default',
               frameWidth: 256, frameHeight: 32,
               menu_spacing: 5,
               members: [
                   { desc: 'foo', bgColor: '#ff0000', press : function () { console.log('this is the foo button'); } },
                   { desc: 'bar', bgColor: '#00ff00', press : function () { console.log('this is the bar button'); } },
                   { desc: 'baz', bgColor: '#0000ff', press : function () { console.log('this is the baz button'); } }
               ]
            }, opt);
       }
       
   }

   const log$2 = new ConsoleLogger({
       cat: 'state',
       id: 'mapview',
       appendId: true
   });

   //const IMDESC = ['tile info', 'item pickup', 'item drop', 'container pickup\/drop' ];

   class Mapview extends Phaser.Scene {

       create () {
       
           const scene = this;
       
           this.mp = new MessPusher({
               key: 'min_3px_5px',
               sx: 165, sy: 350,
               lineHeight: 6,
               capsOnly: true,
               scene: this,
               maxLines : 12,
               maxT: 10000
           });
           
           const start_map_index = 4;
           const mdc = new MapDataCollection(this, { startMapIndex: start_map_index, zeroPlayerMode: true });
           this.registry.set('mdc', mdc);
           
           //this.setPlayerPerson( this.registry.get('player'), start_map_index);
           
           const tb = new TimeBar({
               x:320, y: 25,
               scene: this,
               gt: new GameTime({
                   scene: this,
                   real: false,                           // set to true if you want real time mode
                   year: 2025, month: 7, day: 29,         // date values     ( if not using real mode )
                   hour: 9, minute: 0, second: 0, ms:0,   // time values     ( if not using real mode )
                   multi: 700                             // time multiplier ( if not using real mode )
               })
           });
           this.registry.set('tb', tb);
           
           const dbs =  new DebugScreen({
               scene: this,
               active: false,
               alpha: 0.60, fontSize: 12,
               desc: 'debug screen for Mapview state',
               lines: ['foo', 'bar', 'baz']
           });
           this.registry.set('dbs', dbs);
           
           
           const confMenu = Menu.createConf({
               //x: 580, y: 420,
               x:0, y: 0,
               frameWidth: 32, frameHeight: 32,
               textureKey: 'texture_menu_mapview',
               menu_key : 'menu_mapview',
               draw (ctx, canvas, i, menu) {
                   const button = this, fw = menu.fw, fh = menu.fh, lw = menu.lineWidth, hlw = lw / 2;
                   ctx.fillStyle = menu.colors[0] || '#ffffff';
                   ctx.fillRect( 0, fh * i, fw, fh);
                   if(i === menu.member_index){
                       ctx.lineWidth = lw;
                       ctx.strokeStyle = menu.colors[2] || '#000000';
                       ctx.strokeRect( hlw, fh * i + hlw, fw - lw, fh - lw);
                   }
                   ctx.fillStyle = menu.colors[1] || '#000000';
                   ctx.textBaseline = 'middle';
                   ctx.textAlign = 'center';
                   ctx.font = '11px monospace';
                   ctx.fillText( button.getData('desc'), fw / 2, fh * i + fh * 0.60);
               },
               members: [
                   { desc: 'left', x: 580 + -32, y: 420 + 0, press: function(){ GlobalControl.moveCam(scene, -8, 0); } },
                   { desc: 'right', x: 580 + 32, y: 420 + 0, press: function(){ GlobalControl.moveCam(scene, 8, 0); } },
                   { desc: 'up', x: 580 + 0, y: 420 + -32, press: function(){ GlobalControl.moveCam(scene, 0, -8); } },
                   { desc: 'down', x: 580 + 0, y: 420 + 32, press: function(){ GlobalControl.moveCam(scene, 0, 8); } },
                   
                   { desc: 'map1', x: 200 + 0, y: 420 + 0, press: function(){ GlobalControl.setMap(scene, 1); } },
                   { desc: 'map2', x: 200 + 50, y: 420 + 0, press: function(){ GlobalControl.setMap(scene, 2); } },
                   { desc: 'map3', x: 200 + 100, y: 420 + 0, press: function(){ GlobalControl.setMap(scene, 3); } },
                   { desc: 'map4', x: 200 + 150, y: 420 + 0, press: function(){ GlobalControl.setMap(scene, 4); } }
                   
               ]
           });
           new Menu(this, confMenu);
           //this.registry.set('menu_key', 'menu_mapview');
           //this.registry.set('menu_mapview', menu);
           
           
           mdc.setActiveMapByIndex(this, mdc.activeIndex);
           
           GlobalControl.setUp( this );
           GlobalControl.centerCamToMap(this, mdc.getActive() );
           
           
           mdc.forAllMaps(this, function(scene, md, map_index){         
              let wi = 0;
              const len = md.worker.maxSize;
              while(wi < len){
                  const worker = md.worker.spawnPerson(mdc, md, scene );  
                  if(!worker){
                      break;
                  }
                  if(mdc.activeIndex === map_index && wi === 0 );
                  wi += 1;
              }
          });
          

          
          
          const gr = this.add.graphics();
          gr.setScrollFactor(0,0);
          gr.depth = 12;
          gr.fillStyle(0xff0000, 0.0);
          gr.fillRect(0,0, 640, 40);
          gr.fill();
          const disp1 = this.add.text(10, 10, '', { color: '#ffffff', align: 'left', fontSize: '10px' });
          disp1.setScrollFactor(0,0);
          disp1.depth = 12;
          this.registry.set('disp1', disp1);
          const disp2 = this.add.text(10, 30, '', { color: '#ffffff', align: 'left', fontSize: '8px' });
          disp2.setScrollFactor(0,0);
          disp2.depth = 12;
          this.registry.set('disp2', disp2);
       }
       
       nextWorker () {    
           const mdc = this.registry.get('mdc');
           let player = this.registry.get('player');
           const scene = this;
           mdc.activeIndex;
           const worker_control_state = {};
           let wc_indices = [-1, -1];
           let total_workers = 0;
           
           // no player!? then set one
           if(!player){
              let mi = mdc.startMapIndex, len = Object.keys(mdc.mapData).length;
              while(mi <= len){
                  const md = mdc.getMapDataByIndex(mi);
                  const options = md.worker.getChildren();
                  if(options.length > 0){
                      player = options[0];
                      this.registry.set('player', player);
                      mdc.setActiveMapByIndex(scene, mi);
                      break;
                  }
                  mi += 1;
              }
              if(!player){
                  log$2('no worker at any map!');
                  return;
              }
           }
           
           mdc.forAllMaps(scene, (scene, md, mi) => {
               const find_player = md.worker.getChildren().map(( person, pi ) => {
                   total_workers += 1;
                   const is_player = person === player;
                   if(is_player){
                      wc_indices = [ mi, pi ];
                   }
                   return {
                       is_player: is_player,
                       person : person,
                       pi: pi, mi: mi
                   };
               });
               worker_control_state[mi] = find_player;
           });
           // cycle to next
           let mi = wc_indices[0];
           let pi = wc_indices[1];
           let ct = 0;
           while( ct < total_workers ){
               const nextWorker = worker_control_state[ mi ][ pi ];
               if( !nextWorker ){
                   pi = 0;
                   mi += 1;
                   mi = mi === 5 ? mi = 1 : mi;
               }
               if( nextWorker ){
                   const md = mdc.getMapDataByIndex(nextWorker.mi);
                   if( nextWorker.person === player ){
                       md.worker.setTask(this, mdc, md, nextWorker.person, 'default');
                       pi += 1;  
                   }
                   if( nextWorker.person != player ){
                       this.setPlayerPerson( nextWorker.person, nextWorker.mi);      
                   }
                   ct += 1;
               }
           }     
       }
       
       setPlayerPerson ( worker, mi ) {
           const mdc = this.registry.get('mdc');
           const md = mdc.getMapDataByIndex(mi);
           
           if(mdc.zeroPlayerMode){
               log$2('can not set a player object as MDC is set to zero player mode ');
           }
           
           if(!worker){
               log$2('no worker object given to set to player');
               return;
           }
           
           this.registry.set('player', worker);
           worker.setData('path', []);
           const p = worker.getTilePos();
           worker.setToTilePos(p);
           this.registry.get('mdc').setActiveMapByIndex(this, mi );
           this.mp.push('Switched to worker ' + worker.name, 'INFO');
           md.worker.setTask(this, this.registry.get('mdc'), md, worker, 'player_control');
       }
       
       addTimedEvents () {
           const mdc = this.registry.get('mdc'); 
           const tb = this.registry.get('tb');
           const gt = tb.gt;
           const te_count = tb.gt.timedEvents.length;
           if(te_count === 0){
               let time = gt.getByDelta( 60 + Math.floor( Math.random() * 30 ) );
               
               const count = 5;
               
               tb.gt.addTimedEvent({
                   start: [time.hour, time.minute], end: [time.hour, time.minute + 1],
                   
                   on_tick : (te, gt, delta) => {
                       te.disp_top = 'foo';
                       te.disp_bottom = count;
                   },
                   
                   on_start: (te, gt, delta) => {
                       const md_donations = mdc.getMapDataByIndex(4);
                       const md_t = mdc.getMapDataByIndex(1);
                       const cust_t_count = md_t.customer.children.entries.length;
                       if(cust_t_count == 0){
                           const people = md_t.customer;
                           people.pushSpawnStack({
                               subTypes: [ ['shopper', 1.00] ],
                               ms_min: 1000,
                               ms_max: 5000,
                               count: count
                           });                    
                       }
                       {
                           const people = md_donations.customer;
                           people.pushSpawnStack({
                               subTypes: [ ['donator', 1.00] ],
                               ms_min: 1000,
                               ms_max: 5000,
                               count: count
                           });
                       }
                   }
                   
               });
               
               
           }
       }
       
       update (time, delta) {
           const player = this.registry.get('player');
           const disp1 = this.registry.get('disp1');
           this.registry.get('disp2');
           const gs = this.registry.get('gameSave');
           const mdc = this.registry.get('mdc');
           const scene = this;
           const tb = this.registry.get('tb');
           
           const menu = this.registry.get('menu_mapview');
           menu.draw();
           
           if(!mdc.zeroPlayerMode && !player){
              this.nextWorker();
           }
           
           this.addTimedEvents();
           tb.update( delta );
           mdc.update(time, delta);
           
           GlobalControl.update( this, time, delta );
           
           const cam_state = scene.registry.get('cam_state') || { x:0, y: 0, z: 1} ; 
           if(!mdc.zeroPlayerMode && player){
               player.pathProcessorCurve(this, (scene, person) => {
                   mdc.doorCheck(scene, player);     
                   person.setData('path', []);
                   person.nCurve = 0;
               });
               player.update();
               this.cameras.main.setZoom( cam_state.z ).centerOn( player.x, player.y );
           }
           
           if(mdc.zeroPlayerMode){
               this.cameras.main.setZoom( cam_state.z ).centerOn( cam_state.x, cam_state.y );
           }
           
           disp1.text = 'Money: ' + gs.money;
           //disp2.text = 'customers: ' + md.customer.getChildren().length;
           this.mp.update(delta);
           
           
           const dbs = this.registry.get('dbs');
           
           //const md = mdc.getMapDataByIndex(index_map);
           dbs.lines = [];
           
           mdc.forAllMaps(scene, (scene, md, index_map ) => {
           
               md.worker.getChildren().forEach((worker)=>{
                   const action = worker.getData('act');
                   dbs.lines.push(
                       index_map + ') ' + worker.name + ' : ' + action.key
                   );
               });
               
               md.customer.getChildren().forEach((customer)=>{
                   const action = customer.getData('act');
                   dbs.lines.push(
                       index_map + ') ' + customer.name + ' : ' + action.key
                   );
               });
           
           });
           
           dbs.lines2 = [
               'md1 spawn_stack_count: ' + mdc.getMapDataByIndex(1).customer.getData('spawnStack').length,
               'md4 spawn_stack_count: ' + mdc.getMapDataByIndex(4).customer.getData('spawnStack').length
           ];
           dbs.draw();
           
       }
       
   }

   const log$1 = new ConsoleLogger({
       cat: 'state',
       id: 'menu',
       appendId: true
   });
   class MainMenu extends Phaser.Scene {

       constructor (config) {
           super(config);
           this.key = 'Menu';
       }
       
       startMapView () {
           log$1('starting mapview...');
           this.scene.start('Mapview');
       }
       
       create () {
           const scene = this;
           this.add.sprite(320, 130, 'menu_1');
           
           GlobalControl.setUp(this);
           
           const confMenu = Menu.createConf({
               x: 320, y: 280,
               textureKey: 'texture_menu_main',
               menu_key: 'menu_main',
               members: [
                   {
                       desc: 'Start', 
                       press: function(){
                           scene.startMapView();
                       }
                   }
               ]
           });
           new Menu(this, confMenu);
           
           const disp1 = this.add.text(320, 400, '', { color: '#ffffff', fontSize: '30px' });
           disp1.setScrollFactor(0,0);
           disp1.depth = 6;
           disp1.text = 'R' + this.registry.get('R');
           disp1.x = 320 - disp1.width / 2;
           
       }
       
       update () {
           const menu = this.registry.get('menu_main');
           menu.draw();
       }

   }

   const TASKS_WORKER = {};

   TASKS_WORKER.default = {
       init: function (mdc, md, people, scene, person) {
       
           console.log(person.name + 'I have no brain! (yet) ');
       
       },
       update: (mdc, md, people, scene, person) => {
       
       }
   };

   const log = new ConsoleLogger({
       cat: 'state',
       id: 'boot',
       appendId: true
   });

   class Boot extends Phaser.Scene {

       constructor (config) {
           super(config);
           this.key = 'Boot';
       }

       create () {
           const game = this.game;
           const reg = game.registry;
           reg.set('R', 8);
           reg.set('MAX_MAP_DONATIONS', 20);
           reg.set('PEOPLE_SPAWN_RATE', { min: 500, delta: 1000 });   
           reg.set('CUSTOMER_MAX_SPAWN_PER_MAP', 10);
           reg.set('CUSTOMER_SPAWN_RATE', { min: 500, delta: 1000 });  // just used as a default, people.spawnStack objects set rate otherwise
           
           
           reg.set('TASKS_WORKER', TASKS_WORKER);
           reg.set('ACTIONS_WORKER', {});
           
           
           //reg.set('TASKS', {
               //player_control : {},
               //default : {
                   //init: function (mdc, md, people, scene, person) {},
                   //update: function(mdc, md, people, scene, person) {}
               //}
           //});
           //reg.set('ACTIONS', {
               //default : {}
           //});
           
           reg.set('gameSave', {
               money: 0
           });
           log( 'Boooting Finger Lakes Reuse R' + reg.get('R') );
           game.events.on('step', () => {
               const scenes = game.scene.getScenes(true, false) || [] ;
               scenes[0];
           }, game);
           this.scene.add('MainMenu', MainMenu, false);
           this.scene.add('Mapview', Mapview, false);
           this.scene.add('Load', Load, false);
           this.scene.start('Load');
           
       }
           
   }

   const canvas = document.querySelector('#canvas_flr');
   canvas.width = 640;
   canvas.height = 480;

   const config = {
       parent: 'container_flr',
       canvas: canvas,
       type: Phaser.WEBGL,
       width: 640,
       height: 480,
       backgroundColor: '#000000',
       scene: Boot,
       zoom: 1,
       render: { pixelArt: true  },
       physics: {
           default: 'arcade',
           arcade: {
               gravity: { y: 0, x:0 }
           }
       }
   };
   new Phaser.Game(config);

})();
