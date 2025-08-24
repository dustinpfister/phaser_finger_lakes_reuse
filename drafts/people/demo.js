import { ACTIONS_DEFAULT } from "../../lib/people/action.js";
import { Person, People } from '../../lib/people/people.js';
import { MapData, MapDataCollection, MapLoader } from '../../lib/mapdata/mapdata.js';

const TASKS_PEOPLE_DRAFT = {
    player_control : {},
    default : {
        init: function (mdc, md, people, scene, person) {
            people.setAction(scene, mdc, md, person, 'wonder' );
        },
        update: function(mdc, md, people, scene, person) {
        
            console.log('task update');
        
        }
    }
};

const ACTIONS_PEOPLE_DRAFT = {};

ACTIONS_PEOPLE_DRAFT.wonder = {
    opt: {
        next_spot: false, pause : 1200, t: 0,
        getOut : function(mdc, md, people, scene, person, opt){
            return false
        }
    },
    init: function (mdc, md, people, scene, person, opt, delta) {
    
    },
    update: function (mdc, md, people, scene, person, opt, delta) {
        const action = person.getData('act');
        opt.t -= delta;
        opt.t = opt.t < 0 ? 0 : opt.t;
        
        console.log('tick');
        
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
            opt.next_spot = false
        }
    }
};

class Example extends Phaser.Scene {

    preload () {
    
        this.load.setBaseURL('../../');
        
        this.load.image('map_16_16', 'sheets/map_16_16.png');
        this.load.atlas('people_16_16', 'sheets/people_16_16.png', 'sheets/people_16_16.json');
        this.load.atlas('donations_16_16', 'sheets/donations_16_16.png', 'sheets/donations_16_16.json');
        
        // ITEM DATA
        this.load.json('items_index', 'items/items_index.json');
        this.load.json('household_1', 'items/household_1.json');
        this.load.json('containers_1', 'items/containers_1.json');     
        
        MapLoader({
          scene: this,
          urlBase: 'drafts/people/',
          mapIndicesStart: 0, mapIndicesStop: 1
        });
        
    
    }
    create () {
        const scene = this;
        //this.registry.set('ACTIONS', ACTIONS_PEOPLE_DRAFT);
        
        this.registry.set('TASKS', TASKS_PEOPLE_DRAFT);
        this.registry.set('ACTIONS', ACTIONS_PEOPLE_DRAFT );
        
        const mdc = new MapDataCollection( scene, { startMapIndex: 0 } );
        scene.registry.set('mdc', mdc);
    }
    update (time, delta) {
        const mdc = this.registry.get('mdc');
        mdc.update(time, delta);
        
        //!! so update here is being called, but not for current task or action
        //console.log('yes??');
        
    }
    
}

const config = {
    width: 640,
    height: 480,
    type: Phaser.WEBGL,
    parent: 'container_flr',
    canvas: document.querySelector('#canvas_flr'),
    scene: Example,
    render: { pixelArt: true  },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x:0 }
        }
    }
};

const game = new Phaser.Game(config);
