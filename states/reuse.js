const MAX_PEOPLE = 10;


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
    
    setMapData (map_index=1) {
       this.map_index = map_index;
       return this.mapData = this.cache.json.get('map' + map_index + '_data');
    }
    
    setupMap ( map_index=1, x=undefined, y=undefined ) {
        const scene = this;
        const People = this.PeoplePlugin.People;
        const player = this.player;
        //player.setData('path', []);
        const md = this.setMapData( map_index );
        x = x === undefined ? md.spawnAt.x : x;
        y = y === undefined ? md.spawnAt.y : y;
        this.player.x = x * 16 + 8;
        this.player.y = y * 16 + 8;
        
        
        let i_map = 1;
        while(i_map <= 4){
        
            const donations = scene['map_donations' + map_index];
            donations.active = false;
            console.log(donations)
        
            i_map += 1;
        }
        
        if(this.map){
           this.map.destroy();
        } 
        if(this.customers){
            console.log('destroy!');
            
            const members = this.customers.getChildren();
            let i = members.length;
            while(i--){
                const member = members[i];
                const onHand = member.getData('onHand');
                let i_item = onHand.length;
                while(i_item--){
                    const item = onHand[i_item];
                    item.destroy();
                
                } 
                console.log()
            }
            
            console.log();
        
        
            this.customers.destroy(true, true);
        }
        this.customers = new People({
            scene: this,
            defaultKey: 'people_16_16',
            maxSize: MAX_PEOPLE,
            createCallback : (person) => {
               // person.body.setDrag(500, 500);
                
                
                //console.log(person.getData('type'));
                
                //person.setData('onHand', createDonation(scene, person) );
                
                
                       
            }
        },{
            subTypes: md.customer.subTypes,
            subTypeProbs: md.customer.subTypeProbs
        });
        
        
        
        const map = this.map = this.make.tilemap({ key: 'map' + map_index, layers:[], tileWidth: 16, tileHeight: 16 });
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
        
        
        //this.physics.add.collider( this.player, this.customers, (a, b)=>{
           
        //});
        
        //this.physics.add.collider( this.player, this.customers, People.prototype.getCollider.call(this.player, this.customers, scene ) );
        
        /*
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
        
        
        console.log( this.map.getTileAt(0,0, true, 0) );
        
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
        
        
        let i_map = 1;
        while(i_map <= 4){
        
            //reg.set('map_items' + i_map, []);
        
            //console.log(i_map)
            
            
            this['map_donations' + i_map] = this.add.group({
                scene: this,
                defaultKey: 'donations_16_16',
                maxSize: this.game.registry.get('MAX_DONATIONS')
            });
            
            
        
        
            i_map += 1;
        }
        
        /*
        this.donations = this.add.group({
            scene: this,
            defaultKey: 'donations_16_16',
            maxSize: this.game.registry.get('MAX_DONATIONS')
        });
        */
        
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
    
    cursorCheck (dir='left') {
        const path = this.player.getData('path');
        if(path.length > 1 ){
            return;
        }
        const cPos = this.player.getTilePos();
        let dx = 0, dy = 0;
        if(dir === 'left'){  dx = -1; }
        if(dir === 'right'){  dx = 1; }
        if(dir === 'up'){  dy = -1; }
        if(dir === 'down'){  dy = 1; }
        if (this.cursors[dir].isDown) {
            this.player.setData('idleTime', 0);
            const tile = this.map.getTileAt(cPos.x + dx, cPos.y + dy, false, 0);
            if(tile){
                if(tile.index === 1){
                    path.push( {x: cPos.x + dx, y: cPos.y + dy  } );
                    this.player.setData('path', path);
                }
            }   
        }
    }

    update () {
        this.player.setVelocity(0);
        this.player.pathProcessor(this, 150, 6);
        this.customers.update(this);
        this.playerX = Math.floor( this.player.x / 16); 
        this.playerY = Math.floor( this.player.y / 16);
        this.cursorCheck('left');
        this.cursorCheck('right');
        this.cursorCheck('up');
        this.cursorCheck('down');
        this.player.offTileCheck(this.map);
        //this.camera.setZoom(2.0).centerOn(this.player.x, this.player.y);
        this.camera.setZoom(2.0).pan(this.player.x, this.player.y, 100);
        this.text_player.x = this.player.body.position.x - 0;
        this.text_player.y = this.player.body.position.y - 16;
        this.text_player.text = this.playerX + ', ' + this.playerY;
        this.doorCheck();       
    }
    
}

export {
    Reuse
}
