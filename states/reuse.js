const MAX_PEOPLE = 5;

class Reuse extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'Reuse';
    }

    createPlayer () {
        this.player = new this.PeoplePlugin.Person(this, 32, 0, 'people_16_16', 'pl_down');
        this.text_player = this.add.text(0, 0, 'X').setFontFamily('Monospace').setFontSize(12);
        this.text_player.depth = 1;
        this.player.setData('type', 'worker');
        this.player.setData('subType', 'employee');        
    }
    
    setMapData (mapNum=1) {
       return this.mapData = this.cache.json.get('map' + mapNum + '_data');
    }
    
    setupMap ( startMap=1, x=undefined, y=undefined ) {
        const scene = this;
        const People = this.PeoplePlugin.People;
        const player = this.player;
        const md = this.setMapData( startMap );
        x = x === undefined ? md.spawnAt.x : x;
        y = y === undefined ? md.spawnAt.y : y;
        this.player.x = x * 16 + 8;
        this.player.y = y * 16 + 8;
        if(this.map){
           this.map.destroy();
        } 
        if(this.customers){
            this.customers.destroy(true, true);
        }
        this.customers = new People({
            scene: this,
            defaultKey: 'people_16_16',
            maxSize: MAX_PEOPLE,
            createCallback : (person) => {
                person.body.setDrag(500, 500);           
            }
        },{
            subTypes: md.customer.subTypes,
            subTypeProbs: md.customer.subTypeProbs
        
        });
        const map = this.map = this.make.tilemap({ key: 'map' + startMap, layers:[], tileWidth: 16, tileHeight: 16 });
        //map.setCollision( [ 0, 2, 10, 13, 14, 20, 21, 22, 23, 24] );
        map.setCollisionByExclusion( [2], true, true, 0 );
        const tiles = map.addTilesetImage('map_16_16');
        // layer 0 will be used for collider cells
        const layer0 =  map.createLayer(0, tiles);
        layer0.depth = 0;
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.children.sortByDepth(this.player, this.map);
        // colliders
        this.physics.world.colliders.removeAll();
        this.physics.add.collider( this.player, layer0 );
        this.physics.add.collider( this.customers, layer0 );
        
        this.physics.add.collider( this.player, this.customers, People.prototype.getCollider.call(this.player, this.customers, scene ) );
        
        /*
        this.physics.add.collider( this.player, this.customers, ( a, b ) => {
            b.setRandomPath(scene);
            const path = [];
            const px = scene.playerX;
            const py = scene.playerY;
            const tile = map.getTileAt(px, py - 1);
            if(tile){
                if(tile.index === 1){
                    path[0] = { x: px, y: py - 1 };   
                }
            }
        });
        this.physics.add.collider( this.customers, this.customers, ( a, b ) => {
            let hits = b.getData('hits');
            hits += 1;
            if(hits >= 50){
               hits = 0;
               a.setRandomPath(scene);
               b.setRandomPath(scene);
            }
            b.setData({hits: hits});
        });
        */
        // layer1 will be used for tiles that should be renderd above a sprite
        const layer1 = map.createBlankLayer('layer1', tiles);
        layer1.depth = 2;
        //layer1.putTileAt(20, 10, 32)
        layer0.setInteractive();
        player.setData({path: [] });
        layer0.on('pointerdown', (pointer)=>{
            const tx = Math.floor( pointer.worldX / 16 );
            const ty = Math.floor( pointer.worldY / 16 );
            const tile = map.getTileAt(tx, ty, false, 0);
            if(tile){
                if(tile.index != 1){
                    console.log(tile.index);
                }
                if(tile.index === 1){    
                    player.setPath(this, tx, ty);
                }
            }
            scene.data.mouseDown = true; 
        });
        layer0.on('pointerup', (pointer)=>{
            player.setVelocity(0);  
            scene.data.mouseDown = false;
        });
    }
    
    doorDisabledCheck () {
        if(this.doorDisable){
           const doors = this.mapData.doors;
           let i = doors.length;
           this.doorDisable = false;
           while(i--){
               const d = doors[i];
               let p = d.position instanceof Array ? d.position : [ d.position ];
               let i2 = p.length;
               while(i2--){
                   if( this.playerX === p[i2].x && this.playerY === p[i2].y ){
                       this.doorDisable = true;
                       break;
                   }
               }
           }
           return;
       }  
    }
    
    doorEnterCheck (d, p) {
        let tiles = [];
        if(p instanceof Array){
           tiles = p;
        }
        if( !(p instanceof Array) ){
           tiles[0] = p;
        }
        let i2 = tiles.length;
        while(i2--){
            const p2 = tiles[i2]
            if( this.playerX === p2.x && this.playerY === p2.y ){
                this.doorDisable = true;
                this.setMapData(d.to.mapNum);
                const d_new = this.mapData.doors[d.to.doorIndex];
                let p3 = d_new.position;
                if(d_new.position instanceof Array){
                    p3 = d_new.position[i2];
                }
                this.setupMap(d.to.mapNum, p3.x, p3.y);
                return true;
            }
        }
        return false;
    }
    
    doorCheck () {
       const doors = this.mapData.doors; 
       this.doorDisabledCheck();
       let i = doors.length;
       while(i-- && !this.doorDisable){
           const d = doors[i];
           const p = d.position;
           if( this.doorEnterCheck(d,p) ){
               return;
           }
       }
    }

    create () {    
        this.PeoplePlugin = this.plugins.get('PeoplePlugin');
        this.DonationsPlugin = this.plugins.get('DonationsPlugin');
        const camera = this.camera = this.cameras.main;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createPlayer();
        this.doorDisable = false;
        this.setupMap(4);
        this.events.on('postupdate', ()=>{
            const customers = this.customers.getChildren();
            let i_customers = customers.length;
            const xMax = this.physics.world.bounds.width;
            const yMax = this.physics.world.bounds.height;
            while(i_customers--){
                const sprite = customers[i_customers];
                if(sprite.x < 0 || sprite.y < 0){
                    sprite.destroy(true, true);
                }
                if(sprite.x >= xMax || sprite.y >= yMax){
                    sprite.destroy(true, true);
               }
            }
        });      
    }

    update () {  
        const v = 100; 
        if(!this.data.mouseDown){
            this.player.setVelocity(0);
        }
        this.player.pathProcessor(this, v, 8);
        this.customers.update(this);
        // keyboard movement
        if (this.cursors.left.isDown) {
            this.player.setData('idleTime', 0);
            this.player.setVelocityX( v * -1 );
        }
        if (this.cursors.right.isDown) {
            this.player.setData('idleTime', 0);
            this.player.setVelocityX( v );
        }
        if (this.cursors.up.isDown) {
            this.player.setData('idleTime', 0);
            this.player.setVelocityY( v * -1);
        }
        if (this.cursors.down.isDown) {
            this.player.setData('idleTime', 0);
            this.player.setVelocityY( v );
        }
        this.player.offTileCheck(this.map);       
        this.playerX = Math.floor( this.player.x / 16); 
        this.playerY = Math.floor( this.player.y / 16);
        this.camera.setZoom(2.0).centerOn(this.player.x, this.player.y);
        this.text_player.x = this.player.body.position.x - 0;
        this.text_player.y = this.player.body.position.y - 16;
        this.text_player.text = this.playerX + ', ' + this.playerY;
        this.doorCheck();       
    }
    
}

export {
    Reuse
}
