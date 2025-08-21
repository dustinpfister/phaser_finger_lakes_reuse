import { ConsoleLogger } from '../message/message.js';
const log = new ConsoleLogger({
    cat: 'lib',
    id: 'ui',
    appendId: true
});

class Button extends Phaser.GameObjects.Sprite {
    constructor (scene, opt= {} ) {
        opt = Object.assign( {}, { x: 0, y: 0, texture: '', frame: 0}, opt );
        super( scene, opt.x, opt.y, opt.texture, opt.frame );
        const button = this;
        button.setInteractive();
        button.press = opt.press || this.press;
        button.on('pointerdown', (e) => {
            button.press();
        });
    }
    press () {
        console.log('default button press!');
    }
};


const GlobalControl = {

    setUp (scene) { 
        scene.cursors = scene.input.keyboard.createCursorKeys();
        const IMDESC = ['tile info', 'item pickup', 'item drop', 'container pickup\/drop' ];
        scene.input.keyboard.on('keydown', (event) => {
            const mDigit = event.code.match(/Digit\d+/);
            
            const menu = scene.registry.get('menu');
            
            log('keydown: ' + event.key);
            
            if(menu && event.key === 'Tab'){
                if(event.shiftKey){
                    menu.member_index -= 1;
                }
                if(!event.shiftKey){
                    menu.member_index += 1;
                }
                const len = menu.getChildren().length;
                if(menu.member_index >= len){
                    menu.member_index %= len;
                }
                if(menu.member_index < 0){
                    menu.member_index = len - 1;
                }
                event.preventDefault();
            }
            
            if(menu && event.key === 'Enter'){
                const member = menu.getChildren()[ menu.member_index ];
                member.press();
            }   
            if(mDigit){
                const d = Number( mDigit[0].replace('Digit', '') );
                const player = scene.registry.get('player'); 
                if(d >= 0 && d < 4){
                    scene.mp.push('Switched to item mode ' + d + '\( ' + IMDESC[d] + ' \)','INFO');
                    player.setData('itemMode', d);
                }
            }
            const mKey = event.code.match(/Key[a-zA-Z]+/);
            if(mKey){
                const k = mKey[0].replace('Key', '');
                if(k === 'W' && scene.nextWorker ){
                    scene.nextWorker();
                }
                let dbs = scene.registry.get('dbs');
                if(k === 'D' && dbs){
                    dbs.toggleActive();
                }
            }
        });
        
    },
    
    cursorCheck (scene, dir='left') {
        const mdc = scene.registry.get('mdc');
        const md = mdc.getActive();
        const player = scene.registry.get('player');
        const path = player.getData('path');
        if(path.length > 1 ){
            return;
        }
        const cPos = player.getTilePos();
        let dx = 0, dy = 0;
        if(dir === 'left'){  dx = -1; }
        if(dir === 'right'){  dx = 1; }
        if(dir === 'up'){  dy = -1; }
        if(dir === 'down'){  dy = 1; }
        if ( scene.cursors[dir].isDown ) {
            const md = mdc.getActive();
            const tile = md.map.getTileAt(cPos.x + dx, cPos.y + dy, false, 0);
            if(tile){
                if(md.canWalk(tile)){
                    player.setPath(this, md, cPos.x + dx, cPos.y + dy);
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
        
        this.member_index = 0;
        this.colors = confMenu.colors;
        
        
        this.draw = confMenu.draw || this.draw;
        
        const menu = this;
        
        const fw = this.fw = confMenu.frameWidth
        const fh = this.fh = confMenu.frameHeight;
        const w = fw, h = fh * confMenu.members.length;
        const tb = this.texture_buttons = scene.textures.createCanvas(confMenu.textureKey, w, h);
        scene.textures.addSpriteSheet('sheet_buttons', tb, confMenu);
        
        confMenu.members.forEach( (data_button, bi) => {
            const button = menu.get( {
                x: confMenu.x, 
                y: confMenu.y + confMenu.frameHeight * bi + confMenu.menu_spacing * bi,
                texture: confMenu.textureKey, 
                frame: bi,
                press : data_button.press
            } );
            
            button.setData('desc', data_button.desc || '');
        });
    }
    
    draw () {
        const tb = this.texture_buttons; 
        const ctx = tb.context;
        const fw = this.fw;
        const fh = this.fh;
        const menu = this;
        menu.getChildren().forEach( ( data_button, i ) => {
        
            ctx.fillStyle = menu.colors[0] || '#ffffff';
            ctx.fillRect( 0, fh * i, fw, fh);

            if(i === menu.member_index){
                ctx.lineWidth = 5;
                ctx.strokeStyle = menu.colors[2] || '#000000';
                ctx.strokeRect( 0, fh * i, fw, fh);
            }

            ctx.fillStyle = menu.colors[1] || '#000000';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.font = Math.floor( fh * 0.75 ) + 'px arial';
            ctx.fillText( data_button.getData('desc'), fw / 2, fh * i + fh / 2);
            
        });
        tb.refresh();
    }
            
    static createConf (opt = {} ) {
        return Object.assign({}, {
            x: 320, y: 200,
            colors: ['white', 'black', 'red'],
            textureKey: 'texture_buttons',
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

export { Button, GlobalControl, Menu };
