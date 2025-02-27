

const MAX_PEOPLE = 20;

class World extends Phaser.Scene {

    createPlayer () {
        this.player = this.physics.add.sprite(0, 0, 'people_16_16');
        this.player.setCollideWorldBounds(true);
        this.player.depth = 2;
        this.player.setData({ path: [], hits: 0, idleTime: 0 })
        this.text_player = this.add.text(0, 0, 'X').setFontFamily('Monospace').setFontSize(12);
        this.text_player.depth = 1;
        this.player.setFrame('pl_down');
    }
    
    createPeople () {
        this.people = this.physics.add.group({
           defaultKey: 'people_16_16',
           frame: 'pl_down',
           maxSize: MAX_PEOPLE,
           createCallback : (person) => {
               person.depth = 2;
               person.body.setDrag(500, 500);
               person.setData({ path:[], hits: 0, idleTime: 0 })                 
           }
        });
    }
    
    setRandomSpritePath (sprite) {
        const pos = this.getRandomMapPos();
        this.setSpritePath(sprite, this.map, pos.x, pos.y);
    }
    
    setSpritePath (sprite, map, tx=2, ty=2) {
        const pathFinder = this.plugins.get('PathFinderPlugin');
        const game = this;
        pathFinder.setGrid(map.layers[0].data, [1]);
        pathFinder.setCallbackFunction(function(path) { 
            path = path || [];
            sprite.setData({ path: path }) 
        });
        const stx = Math.floor( sprite.x / 16 );
        const sty = Math.floor( sprite.y / 16 );
        pathFinder.preparePathCalculation([stx, sty], [tx, ty]);
        pathFinder.calculatePath();
    }

    setMapData (mapNum=1) {
       return this.mapData = this.cache.json.get('map' + mapNum + '_data');
    }
    
    getRandomMapPos () {
        this.map.setLayer(0);
        const walkable = this.map.filterTiles((tile)=>{ return tile.index === 1 });
        const tile = walkable[ Math.floor( walkable.length * Math.random() ) ];
        return { x: tile.x, y: tile.y };
    }
    
    spawnPerson () {       
        const people = this.people.getChildren();
        const now = new Date();
        if(people.length < MAX_PEOPLE && (!this.lastPersonSpawn || now - this.lastPersonSpawn >= 1000) ){
            this.lastPersonSpawn = now;
            const sa = this.mapData.peopleSpawnAt;
            const doorIndex = sa[ Math.floor( sa.length * Math.random() ) ];
            const d = this.mapData.doors[doorIndex];
            let p = d.position;
            if(p instanceof Array){
                p = p[ Math.floor( p.length * Math.random() ) ];
            }
            
            // is a person there all ready?
            let i = people.length;
            while(i--){
                const person = people[i];
                if( Math.floor( person.x / 16 ) === p.x && Math.floor( person.y / 16 ) === p.y ){
                    return;
                }
            }
            
            this.people.get(p.x * 16 + 8, p.y * 16 + 8);
        }
    }
    
    reSpawn (sprite) {
        const pos = this.mapData.spawnAt;
        sprite.x = pos.x * 16 + 8;
        sprite.y = pos.y * 16 + 8;
        sprite.setData({path:[]})
    }

    setupMap ( startMap=1, x=undefined, y=undefined ) {
        const game = this;
        const player = this.player;
        if(this.map){
           this.map.destroy();
        }
        
        
        if(this.people){
        
            this.people.destroy(true, true);
        
        }
        
        this.createPeople();
        
        const md = this.setMapData( startMap );
        x = x === undefined ? md.spawnAt.x : x;
        y = y === undefined ? md.spawnAt.y : y;
        this.player.x = x * 16 + 8;
        this.player.y = y * 16 + 8;
        const map = this.map = this.make.tilemap({ key: 'map' + startMap, layers:[], tileWidth: 16, tileHeight: 16 });
        map.setCollision( [ 0, 2, 10, 20, 21, 22] );
        const tiles = map.addTilesetImage('map_16_16');
        // layer 0 will be used for collider cells
        const layer0 =  map.createLayer(0, tiles);
        layer0.depth = 0;
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.children.sortByDepth(this.player, this.map);
        // colliders
        this.physics.world.colliders.removeAll();
        this.physics.add.collider( this.player, layer0 );
        this.physics.add.collider( this.people, layer0 );
        this.physics.add.collider( this.player, this.people, (a, b)=>{
            const pos = this.getRandomMapPos();
            game.setSpritePath(b, map, pos.x, pos.y);
            const path = [];
            const px = game.playerX;
            const py = game.playerY;
            const tile = map.getTileAt(px, py - 1);
            if(tile){
                if(tile.index === 1){
                    path[0] = { x: px, y: py - 1 };   
                }
            }
        });
        this.physics.add.collider( this.people, this.people, (a, b)=>{
            let hits = b.getData('hits');
            hits += 1;
            if(hits >= 50){
               hits = 0;
               game.setRandomSpritePath(b);
               game.setRandomSpritePath(a);
            }
            b.setData({hits: hits});
        });
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
                    const sprite = this.people.getFirst(true, false);
                    if(sprite){
                        sprite.destroy();
                    }
                }
                if(tile.index === 1){
                    this.setSpritePath(player, map, tx, ty);
                }
            }
            game.data.mouseDown = true; 
        });
        layer0.on('pointerup', (pointer)=>{
            player.setVelocity(0);  
            game.data.mouseDown = false;
        });
        const people = this.people.getChildren();
        let i_people = people.length;
        while(i_people--){
            const sprite = people[i_people];
            this.reSpawn(sprite);
        }
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
        
    slideSet (axis, dir, rad, a, v1, v2) {
        if(dir === 'left'){
            if(a > 0){
              a = (a + Math.PI * 0.32) * -1
            }
        }
        let a2 = rad + 1.0;
        let a3 = rad - 1.0;   
        if (this.cursors[dir].isDown && a < a2 && a > a3) {
            if(a < rad){
                this.player['setVelocity' + axis]( v1 );
            }
            if(a > rad){
                this.player['setVelocity' + axis]( v2 );
            }
        }
    }
    
    doorSlide (i, d, p) {
        const x1 = this.player.x;
        const y1 = this.player.y;
        const x2 = p.x * 16 + 8;
        const y2 = p.y * 16 + 8;
        const dist = Phaser.Math.Distance.Between(x1, y1, x2, y2);
        const a = Phaser.Math.Angle.Between(x1, y1, x2, y2); 
        if(dist < 16 * 2){
            this.slideSet('X', 'down', Math.PI * 0.5, a, 100, -100);
            this.slideSet('X', 'up', Math.PI * 0.5 * -1, a, -100, 100);    
            this.slideSet('Y', 'right', Math.PI * 0, a, -100, 100);
            this.slideSet('Y', 'left', Math.PI * 1.0 * -1, a, 100, -100);
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
           this.doorSlide(i,d,p);
       }
    }
        
    spritePathProcessor (sprite, v=200, min_d=8) {
        if(!sprite.data){
            return;
        }
        const path = sprite.getData('path')
        if(!path){
            return;
        }
        if(path.length > 0){
            const pos = path[0];
            const tx = pos.x * 16 + 8;
            const ty = pos.y * 16 + 8;
            const at_pos = sprite.x === tx && sprite.y === ty;
            if(at_pos){
                sprite.setData({path: path.slice(1, pos.length) })
            }
            if(!at_pos){
               let vx = 0, vy = 0;
               if(tx > sprite.x){ vx = v;     }
               if(tx < sprite.x){ vx = v * -1;}
               if(ty > sprite.y){ vy = v;     }
               if(ty < sprite.y){ vy = v * -1;}
               sprite.setVelocityX( vx );
               sprite.setVelocityY( vy );
               const d = Phaser.Math.Distance.Between(tx, ty, sprite.x, sprite.y);
               if(d <= min_d){
                   sprite.x = tx;
                   sprite.y = ty;
                   sprite.setVelocity(0);
               }  
            }
        }
    }
    
    offTileCheck (sprite) {
        const tx = ( sprite.x - 8 ) / 16;
        const ty = ( sprite.y - 8 ) / 16;
        const TX = Math.floor(tx);
        const TY = Math.floor(ty);
        let t = sprite.getData('idleTime');
        t += 1;
        if( t >= 50){
            t = 0;
            const t4 = this.map.getTileAt(TX, TY, 0);
            const t5 = this.map.getTileAt(TX + 1, TY, 0);
            const t7 = this.map.getTileAt(TX, TY + 1, 0);
            const fx = tx - Math.floor(tx);
            const fy = ty - Math.floor(ty);
            if(  fx < 0.50 && t4.index === 1 ){ sprite.x = t4.x * 16 + 8; }
            if( fx >= 0.50 && t5.index === 1 ){ sprite.x = t5.x * 16 + 8; }
            if( fy < 0.50 && t4.index === 1 ){ sprite.y = t4.y * 16 + 8; }
            if( fy >= 0.50 && t7.index === 1 ){ sprite.y = t7.y * 16 + 8; }
        }
        sprite.setData('idleTime', t);
    }

    offGridCheck (sprite) {
    
        if(sprite.x < 0 || sprite.y < 0){
            return true;
            
        }
        
        return false
    
    }

    create () {
        const camera = this.camera = this.cameras.main;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createPlayer();
        //this.createPeople();
        this.doorDisable = false;
        const startMap = 1;
        this.setupMap(startMap);  
        
        
        //const lifeCycle = this.plugins.get('lifecyclePlugin');
        
        //console.log(lifeCycle);
        
        this.events.on('postupdate', ()=>{
        
        const people = this.people.getChildren();
            let i_people = people.length;
            const xMax = this.physics.world.bounds.width;
            const yMax = this.physics.world.bounds.height;
            while(i_people--){
                const sprite = people[i_people];
                if(sprite.x < 0 || sprite.y < 0){
                    sprite.destroy(true, true);
                }
                if(sprite.x >= xMax || sprite.y >= yMax){
                    sprite.destroy(true, true);
                }
            }
        });
        
        console.log()
        
    }

    update () {
        if(!this.data.mouseDown){
            this.player.setVelocity(0);
        }
        this.spritePathProcessor(this.player);
        const people = this.people.getChildren();
        let i_people = people.length;
        
        //if(i_people < MAX_PEOPLE){
        //    this.spawn();
        //}
        
        this.spawnPerson();
        
        while(i_people--){
            const sprite = people[i_people];
            
            if( this.offGridCheck(sprite) ){
            
                console.log('person went off grid!');
            
            }
            
            if(!sprite){
                console.log('well that is not good is it');
            }
            const tx = Math.floor(sprite.x / 16);
            const ty = Math.floor(sprite.y / 16);
            const tile = this.map.getTileAt(tx, ty, false, 0);
            if(!tile){
                console.log('no tile!?');
                this.reSpawn(sprite);
            }
            if(tile){
                if(tile.index != 1){
                    console.log('sprite is not over index 1 tile!');
                    this.reSpawn(sprite);
                }
            }
            this.spritePathProcessor( sprite, 50, 1);
            if(sprite.getData('path').length === 0 ){
                const pos = this.getRandomMapPos();
                this.setSpritePath(sprite, this.map, pos.x, pos.y);
            }
            
        }
        // keyboard movement
        const v = 100; 
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
        
        this.offTileCheck(this.player);
        
        this.playerX = Math.floor( this.player.x / 16); 
        this.playerY = Math.floor( this.player.y / 16);
        this.camera.setZoom(2.0).centerOn(this.player.x, this.player.y);
        this.text_player.x = this.player.body.position.x - 0;
        this.text_player.y = this.player.body.position.y - 16;
        this.text_player.text = this.playerX + ', ' + this.playerY;
        this.doorCheck();       
    }
    
    postUpdate () {
    
        console.log('post update');
    
    }
}

export {
    World
}
