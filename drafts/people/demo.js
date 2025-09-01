import { ACTIONS_DEFAULT } from "../../lib/people/action.js";
import { Person, People } from '../../lib/people/people.js';
import { MapData, MapDataCollection, MapLoader } from '../../lib/mapdata/mapdata.js';
import { ItemTools } from '../../lib/items/items.js';

const TASKS_PEOPLE_DRAFT = {
    //player_control : {},
    default : {
        init: function (mdc, md, people, scene, person) {
        

            people.setAction(scene, mdc, md, person, 'wonder' );
        },
        update: function(mdc, md, people, scene, person) {
        
        
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
        console.log('yes this fires once at least');
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
            opt.next_spot = false
        }
    }
};

class Example extends Phaser.Scene {

    preload () {
    
        this.load.setBaseURL('../../');
        
        this.load.image('map_16_16', 'json/sheets/map_16_16.png');
        this.load.atlas('people_16_16', 'json/sheets/people_16_16.png', 'json/sheets/people_16_16.json');
        this.load.atlas('donations_16_16', 'json/sheets/donations_16_16.png', 'json/sheets/donations_16_16.json');
        
        // ITEM DATA
        this.load.json('household_1', 'json/items/household_1.json');
        this.load.json('containers_1', 'json/items/containers_1.json');     
        
        MapLoader({
          scene: this,
          urlBase: 'drafts/people/',
          mapIndicesStart: 0, mapIndicesStop: 1
        });
        
    
    }
    create () {
        const scene = this;
        
        ItemTools.genIndex(scene, ['containers_1', 'household_1']);
        
        this.registry.set('TASKS', TASKS_PEOPLE_DRAFT);
        this.registry.set('ACTIONS', ACTIONS_PEOPLE_DRAFT );
        
        const mdc = new MapDataCollection( scene, {
            startMapIndex: 0
        } );
        scene.registry.set('mdc', mdc);
    }
    update (time, delta) {
        const mdc = this.registry.get('mdc');
        mdc.update(time, delta);
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
