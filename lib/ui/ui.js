import { ConsoleLogger } from '../message/message.js';
const log = new ConsoleLogger({
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
};

/********* **********
 GlobalControl + helpers
********** *********/

const key_check_menu = function (scene, event) {
    const menu_key = scene.registry.get('menu_key') || 'menu_default';
    const menu = scene.registry.get(menu_key);
    if(menu && event.key === 'ArrowUp'){
        menu.member_index -= 1;
        event.preventDefault();
        }
    if(menu && event.key === 'ArrowDown'){
        menu.member_index -= 1;
        event.preventDefault();
    }
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
        const cam_state = scene.registry.get('cam_state');
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
                const md = mdc.setActiveMapByIndex(scene, d);
                const mx = md.map.widthInPixels, my = md.map.heightInPixels;   
                //cam_state.x = Math.round( md.map.widthInPixels / 2 );
                //cam_state.y = Math.round( md.map.heightInPixels / 2 );
                GlobalControl.centerCamToMap(scene, md);
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
            
            if(mdc.zeroPlayerMode){
                //scene.registry.set('player', null);
            }
            
            
            
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
            const menu = scene.registry.get( menu_key );
        
            console.log( menu_key );
            console.log( menu );
        
            key_check_menu(scene, event);
            key_check_digit(scene, event);
            key_check_char(scene, event);
        });
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
            const md = mdc.getActive();
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
        const fw = this.fw;
        const fh = this.fh;
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
    
};

//export { Button, GlobalControl, Menu };
export { GlobalControl, Menu };
