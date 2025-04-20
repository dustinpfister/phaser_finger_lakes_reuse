/********* **********
ITEMS ( BaseItem, Item, and Container Classes )
********** *********/
    
class BaseItem extends Phaser.GameObjects.Sprite {
    
    constructor (scene, key, x, y, sheet, frame) {
        super(scene, x, y, sheet, frame);
        this.iType = 'BaseItem';
        this.key = key;
        this.depth = 1;
        this.priced = false;
        this.droped = false;
        this.canChildOnEmpty = true;
        this.desc = '';
        const item = this;
        item.setInteractive();
        item.on('pointerdown', (pointer, x, y) => {
            const player = scene.player;
            player.onHandAction(scene, item, scene.playerX, scene.playerY);                
        });
    }
        
    getTilePos () {    
        return {
            x : Math.floor( this.x / 16 ),
            y : Math.floor( this.y / 16 )
        }
    }
        
}
    
class Item extends BaseItem {
    
    constructor (scene, key, x=0, y=0) {
    
        const data = {};
        
        console.log( scene.cache.json.get('household_1') );
    
        super(scene, key, x, y, data.tile.sheet, data.tile.frame)
        const item = this;
        this.iType = 'Item';
        this.desc = data.desc;
        this.value = data.value;
        this.drop_count = data.drop_count || 0;
    }
            
}
    
class Container extends BaseItem {
    
    constructor (scene, key, data, x=-1, y=-1) {
        super(scene, key, x, y, data.tile.sheet, data.tile.frame);
        this.iType = 'Container';
        this.desc = data.desc;
        this.canChildOnEmpty = data.canChildOnEmpty;
        this.drop_count = data.drop_count || 0;
        this.capacity = data.capacity;
        this.autoCull = data.autoCull || false;
        //this.contents = scene.add.group();
        this.contents = [];
        const container = this;
        const items = scene.registry.get('items');
    }
        
    addItem (item) {
        if(item.iType === 'Container' && !item.canChildOnEmpty){
            console.log( 'This Container can not be a Child of another' );
            return false;
        }
        if(item.iType === 'Container' && item.canChildOnEmpty && (item.drop_count > 0 || item.contents.length > 0) ){
            console.log( 'can only child this Container when it is empty' );
            return false;
        }
        if(this.autoCull && this.contents.length >= this.capacity){
            const len = this.contents.length + 1 - this.capacity;
            this.contents.splice(this.capacity - 1, len);
        }
        if(this.contents.length < this.capacity){
            item.x = this.x;
            item.y = this.y;
            const itemRec = {
                key: item.key, iType : this.iType 
            };
            this.contents.push(itemRec);
            item.destroy(true, true);
            return true;
        }
        return false;
    }
        
    spawnItem (scene) {
        const items = scene.registry.get('items');
        const containers = scene.registry.get('containers');
        let item_new = null;
        const conLen = this.contents.length;
        let drop_count = this.drop_count;
        if( drop_count === 0 && conLen > 0){
            console.log('yes this container has some contents!');
            const itemRec = this.contents.pop();
            const data = itemRec.iType === 'Item' ? items[itemRec.key]: containers[itemRec.key];              
            if(itemRec.iType === 'Item'){
                item_new = new Item(scene, itemRec.key, data, 0, 0 );
            }
            if(itemRec.iType === 'Container'){
                item_new = new Container(scene, itemRec.key, data, 0, 0 );
            }
            scene.add.existing( item_new );
        }
        if( drop_count > 0 ){
            this.setFrame('bx_full');
            const data = items['hh_mug_1'];
            item_new = new Item(scene, 'hh_mug_1', data, 0, 0 );
            scene.add.existing( item_new );
            drop_count -= 1;
            this.drop_count = drop_count;
            if(this.drop_count <= 0){
               this.setFrame('bx_empty');
            } 
        }
        if( drop_count === 0 && conLen === 0){
            console.log('Container is empty!');
        }
        return item_new;
    }
        
}
    
export { Item, Container, BaseItem }

