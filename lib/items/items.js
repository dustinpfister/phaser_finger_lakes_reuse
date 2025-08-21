import { ConsoleLogger } from '../message/message.js';
const log = new ConsoleLogger({
    cat: 'lib',
    id: 'items',
    appendId: true
});
/********* **********
ITEMS ( BaseItem, Item, and Container Classes )
********** *********/

const getItemData = (scene, key='hh_mug_1', indexKey='items_index', opt={}) => {
    const itemsIndex = scene.cache.json.get(indexKey);
    const fi = itemsIndex.items[key];
    const fn = itemsIndex.files[fi];
    return Object.assign({}, scene.cache.json.get(fn)[key], opt);
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
        const item = this;
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
        const data = getItemData(scene, key, 'items_index', opt );
        super(scene, key, x, y, data.tile.sheet, data.tile.frame)
        const item = this;
        this.iType = 'Item';
        this.desc = data.desc;
        this.value = data.value;
        this.drop_count = data.drop_count || 0;
    }
            
}
    
class Container extends BaseItem {
    
    constructor (scene, key="blue_bin", opt={}, x=-1, y=-1) {
        const data = getItemData(scene, key, 'items_index', opt );
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
            log( 'This Container can not be a Child of another' );
            return false;
        }
        if(item.iType === 'Container' && item.canChildOnEmpty && (item.drop_count > 0 || item.contents.length > 0) ){
            log( 'can only child this Container when it is empty' );
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
            //const data_hard = getItemData(scene, itemRec.key );
                 
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

export { BaseItem, Item, Container, ItemCollection  }

