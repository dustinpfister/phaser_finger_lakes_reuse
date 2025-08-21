
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
        
        const menu = this;
        confMenu.members.forEach( (data_button, bi) => {
            menu.get( {
                x: confMenu.x, 
                y: confMenu.y + confMenu.frameHeight * bi + confMenu.menu_spacing * bi,
                texture: confMenu.textureKey, 
                frame: bi,
                press : data_button.press
            } );  
        });
    }
    
    static createConf (opt = {} ) {
        return Object.assign({}, {
            x: 320, y: 200,
            bgColor: 'lime',
            fgColor: 'white',
            textureKey: 'texture_buttons',
            frameWidth: 256, frameHeight: 32,
            menu_spacing: 5,
            draw: ( ctx, texture_buttons, confMenu, scene ) => {
                const fw = confMenu.frameWidth, fh = confMenu.frameHeight;
                confMenu.members.forEach( ( data_button, i ) => {
                    ctx.fillStyle = data_button.bgColor || confMenu.bgColor || '#2a2a2a';
                    ctx.fillRect( 0, fh * i, fw, fh);
                    ctx.fillStyle = data_button.fgColor || confMenu.fgColor || '#efefef';
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'center';
                    ctx.font = Math.floor( fh * 0.75 ) + 'px arial';
                    ctx.fillText(data_button.desc, fw / 2, fh * i + fh / 2);
                });
            },
            members: [
                { desc: 'foo', bgColor: '#ff0000', press : function () { console.log('this is the foo button'); } },
                { desc: 'bar', bgColor: '#00ff00', press : function () { console.log('this is the bar button'); } },
                { desc: 'baz', bgColor: '#0000ff', press : function () { console.log('this is the baz button'); } }
            ]
         }, opt);
    }
    
    static createCanvas (scene, confMenu) {
        const fw = confMenu.frameWidth, fh = confMenu.frameHeight;
        const w = fw, h = fh * confMenu.members.length;
        const texture_buttons = scene.textures.createCanvas(confMenu.textureKey, w, h);
        confMenu.draw(texture_buttons.context, texture_buttons, confMenu, scene);
        texture_buttons.refresh();
        scene.textures.addSpriteSheet('sheet_buttons', texture_buttons, confMenu);
        return texture_buttons;
    
    }
};

export { Button, GlobalControl, Menu };
