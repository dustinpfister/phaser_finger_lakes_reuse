(function(){

    const root = this;
    
    class Item extends Phaser.GameObjects.Sprite {
    
        constructor (scene, data, x=-1, y=-1) {
            
            super(scene, x, y, 'donations_16_16', 'bx_close')
            
            this.desc = data.desc;
            this.value = data.value;
            this.depth = 3;
            
        
        
        } 
        
    
    }
    
    
    class Person extends Phaser.Physics.Arcade.Sprite {
    
        constructor (scene, x, y, texture, frame) {
            super(scene, x, y, texture, frame);
            scene.add.existing(this);
            scene.physics.add.existing(this);
            this.setCollideWorldBounds(true);
            this.depth = 2;
            this.setData({ 
                path: [], hits: 0, idleTime: 0,
                onHand: [], trigger_pos: {x: -1, y: -1},
                type: '', subType: ''
            });
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
                person.setData(key, pConfig[key])
            });
        }
        
        pathProcessor (scene, v=200, min_d=8) {
            const path = this.getData('path')
            if(path.length > 0){
                const pos = path[0];
                const tx = pos.x * 16 + 8;
                const ty = pos.y * 16 + 8;
                const at_pos = this.x === tx && this.y === ty;
                if(at_pos){
                    this.setData('path', path.slice(1, pos.length));
                }
                if(!at_pos){
                    let vx = 0, vy = 0;
                    if(tx > this.x){ vx = v;     }
                    if(tx < this.x){ vx = v * -1;}
                    if(ty > this.y){ vy = v;     }
                    if(ty < this.y){ vy = v * -1;}
                    this.setVelocityX( vx );
                    this.setVelocityY( vy );
                    const d = Phaser.Math.Distance.Between(tx, ty, this.x, this.y);
                    
                    if(d <= min_d){
                        this.x = tx;
                        this.y = ty;
                        this.setVelocity(0);
                    } 
                    
                }
            }
        
        }
        
        offTileCheck (map, layer = 0) {
            const sprite = this;
            const tx = ( sprite.x - 8 ) / 16;
            const ty = ( sprite.y - 8 ) / 16;
            const TX = Math.floor(tx);
            const TY = Math.floor(ty);
            let t = sprite.getData('idleTime');
            t += 1;
            if( t >= 50){
                t = 0;
                const t4 = map.getTileAt(TX, TY, true, layer);
                const t5 = map.getTileAt(TX + 1, TY, true, layer);
                const t7 = map.getTileAt(TX, TY + 1, true, layer);
                const fx = tx - Math.floor(tx);
                const fy = ty - Math.floor(ty);
                if( fx < 0.50 && t4.index === 1 ){ sprite.x = t4.x * 16 + 8; }
                if( fx >= 0.50 && t5.index === 1 ){ sprite.x = t5.x * 16 + 8; }
                if( fy < 0.50 && t4.index === 1 ){ sprite.y = t4.y * 16 + 8; }
                if( fy >= 0.50 && t7.index === 1 ){ sprite.y = t7.y * 16 + 8; }
            }
            sprite.setData('idleTime', t);
        }
        
        setRandomPath (scene) {
        
            scene.map.setLayer(0);
            const walkable = scene.map.filterTiles((tile)=>{
                return tile.index === 1
            });
            const tile = walkable[ Math.floor( walkable.length * Math.random() ) ];
            this.setPath(scene, tile.x, tile.y);
        }
        
        setPath (scene, tx=2, ty=2) {
            const pathFinder = scene.plugins.get('PathFinderPlugin');
            const map = scene.map;
            const sprite = this;
            pathFinder.setGrid(map.layers[0].data, [1]);
            pathFinder.setCallbackFunction( (path) => { 
                path = path || [];
                sprite.setData({ path: path }) 
            });
            const stx = Math.floor( sprite.x / 16 );
            const sty = Math.floor( sprite.y / 16 );
            pathFinder.preparePathCalculation([stx, sty], [tx, ty]);
            pathFinder.calculatePath();
        }
        
        
    }
    
      
      
    const get_di_tiles = (scene) => {
        return scene.map.filterTiles( (tile) => {
            return tile.index === 13 || tile.index === 14 || tile.index === 23 || tile.index === 24;
        });
    };
        
    const PEOPLE_TYPES = {}
    
    PEOPLE_TYPES.worker = {};
    
    PEOPLE_TYPES.worker.employee = {
        update: (people, scene, person) => {},
        create: (people, scene, person) => {},
        collider: (people, gameObject, scene ) => {
             //gameObject.setRandomPath(scene);
        },
        noPath: (people, scene, person) => {}
    };
    
    PEOPLE_TYPES.customer = {};
    
    PEOPLE_TYPES.customer.shopper = {
    
        update: (people, scene, person) => {},
        create: (people, scene, person) => {
            person.body.setDrag(500, 500);
        },
        collider: (people, gameObject, scene ) => {},
        
        noPath: (people, scene, person) => {
        
            
            
            console.log('new path please');
            
            const pos_exit = scene.mapData.customer.exitAt;
            const tx = Math.floor( person.x / 16 );
            const ty = Math.floor( person.y / 16 );
            
            console.log(tx, ty);
            
            if( tx === pos_exit.x && ty === pos_exit.y){
                person.destroy();
            }else{
            
                person.setPath(scene, pos_exit.x, pos_exit.y );
            
            }
            
            //person.setRandomPath(scene);
            
            
            
        }
        
    };
    
    PEOPLE_TYPES.customer.donator = {
    
        update: (people, scene, person) => {        
        },

        create: (people, scene, person) => {
            const items = scene.registry.get('items');
            const max_donations = scene.game.registry.get('MAX_DONATIONS');
            person.body.setDrag(500, 500);
            if(scene.donations.children.size < max_donations){
                const donation = new Item(scene, items['hh_mug_1'], person.x, person.y);
                scene.add.existing(donation);
                scene.donations.add(donation);
                person.setData('onHand', [ donation ] );
            }
            if(scene.donations.children.size > max_donations){
                //person.destroy();
            }
        },

        collider: (people, gameObject, scene ) => {
            
        },
        
        noPath: (people, scene, person) => {
            scene.map.setLayer(0);
            const onHand = person.getData('onHand');
            const tPos = person.getData('trigger_pos');
            const cPos = person.getTilePos();
            if(onHand.length > 0 && tPos.x === -1 && tPos.y === -1){
                const tiles_di = get_di_tiles(scene);
                const dt = tiles_di[ Math.floor( tiles_di.length * Math.random() ) ];
                const tiles_near_di = scene.map.getTilesWithin(dt.x - 1, dt.y -1, 3, 3).filter( (tile) => { return tile.index === 1; });
                const t = tiles_near_di[ Math.floor( tiles_near_di.length * Math.random() ) ];
                person.setPath(scene, t.x, t.y);
                person.setData('trigger_pos', {x: t.x, y: t.y});
            }
            if(onHand.length > 0 && cPos.x === tPos.x && cPos.y === tPos.y){
                person.setData('onHand', []);
                const pos_exit = scene.mapData.customer.exitAt;   
                person.setData('trigger_pos', pos_exit);
                person.setPath(scene, pos_exit.x, pos_exit.y);
            }
            if(onHand.length === 0  && cPos.x === tPos.x && cPos.y === tPos.y ){
                person.destroy(true, true);
            }         
        }
    
    };

    const PEOPLE_DEFAULTS = {
        type: 'customer', subTypes: ['shoper', 'donator'], subTypeProbs: [ 1.00, 0.00 ],
        cash: 100
    };

    class People extends Phaser.Physics.Arcade.Group {
    
        constructor (config, pConfig) {
            config = config || {};
            pConfig = Object.assign({}, PEOPLE_DEFAULTS, pConfig || {} );
            config.classType = Person;
            const scene = config.scene
            const world = scene.physics.world;
            super(world, scene, config);
            this.data = new Phaser.Data.DataManager(this,  new Phaser.Events.EventEmitter() );
            this.setData('lastSpawn', new Date());
            this.setData('type', pConfig.type);
            this.setData('subTypes', pConfig.subTypes);
            this.setData('subTypeProbs', pConfig.subTypeProbs);
            this.setData('pConfig', pConfig);
        }
        
        setData (key, value){ return this.data.set(key, value); }
        getData (key, value){ return this.data.get(key); }
        
        spawnPerson (scene) {
            const people = this.getChildren();
            const pConfig = this.getData('pConfig');
            const subTypes = this.getData('subTypes');
            const subTypeProbs = this.getData('subTypeProbs');
            const now = new Date();
            const lastSpawn = this.getData('lastSpawn');
            
            if(people.length < this.maxSize && now - lastSpawn >= 1000 ){
            
                this.setData('lastSpawn', now);
                let p = scene.mapData.customer.spawnAt;
                if(p instanceof Array){
                    p = p[ Math.floor( p.length * Math.random() ) ];
                }
                let i = people.length;
                while(i--){
                    const person = people[i];
                    if( Math.floor( person.x / 16 ) === p.x && Math.floor( person.y / 16 ) === p.y ){
                        return;
                    }
                }
                
                const person = this.get(p.x * 16 + 8, p.y * 16 + 8);
                person.setData('type', this.getData('type') ); 
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
                person.setFrame( person.getData('subType') + '_down');
                person.setConf({
                    cash: pConfig.cash
                });
                
                const pt = PEOPLE_TYPES[ person.getData('type') ][ person.getData('subType') ];
                
                pt.create(this, scene, person);
                
            }
        }


        getCollider(gameObject, scene){
            const map = this.scene.map;
            const people = this;
            return function( a, b ) {
                const type = a.getData('type');
                const subType = a.getData('subType');
                
                
                const pt = PEOPLE_TYPES[ a.getData('type') ][ a.getData('subType') ];
                
                //pt.collider(a, b, scene);
                
            }   
        }

        update (scene) {
            const type = this.getData('type');
            const subTypes = this.getData('subTypes');
            const people = this.getChildren();
            let i_people = people.length;
            this.spawnPerson(scene);
            while(i_people--){
                const person = people[i_people];
                const pt = PEOPLE_TYPES[ person.getData('type') ][ person.getData('subType') ];
                if(pt){
                    pt.update(this, scene, person);
                }
                const tx = Math.floor(person.x / 16);
                const ty = Math.floor(person.y / 16);
                const tile = scene.map.getTileAt(tx, ty, false, 0);
                if(!tile){
                }
                if(tile){
                    if(tile.index != 1){
                    }
                }
                person.pathProcessor( scene, 50, 1);
                if(person.getData('path').length === 0 ){
                    //person.setRandomPath(scene);
                    pt.noPath(this, scene, person);   
                }
                
                const onHand = person.getData('onHand');
                if(onHand){
                    if(onHand.length > 0){
                        onHand[0].x = person.x + 8;
                        onHand[0].y = person.y - 8;
                    }
                }
                
            }
        }
        
        

    }

    class PeoplePlugin extends Phaser.Plugins.BasePlugin {
        constructor (pluginManager) {
            super(pluginManager);
            
            
            this.People = People;
            this.Person = Person;
        } 
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PeoplePlugin;
        }
        exports.PeoplePlugin = PeoplePlugin;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('PeoplePlugin', (function() { return root.PeoplePlugin = PeoplePlugin; })() );
    } else {
        root.PeoplePlugin = PeoplePlugin;
    }

    return PeoplePlugin;
}).call(this);

