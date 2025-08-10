
class Button extends Phaser.GameObjects.Sprite {
    constructor (scene, opt= {} ) {
        opt = Object.assign( {}, { x: 0, y: 0, texture: '', frame: 0}, opt );
        super( scene, opt.x, opt.y, opt.texture, opt.frame );
        const button = this;
        button.setInteractive();
        button.press = opt.press || this.press;
        //button.selected = false; 
        button.on('pointerdown', (e) => {
            button.press();
        });
    }
    press () {
        console.log('default button press!');
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
    static createCanvas (scene, confMenu) {
        const fw = confMenu.frameWidth, fh = confMenu.frameHeight;
        const w = fw, h = fh * confMenu.members.length;
        const texture_buttons = scene.textures.createCanvas(confMenu.textureKey, w, h);
        const canvas = texture_buttons.canvas;
        const ctx = texture_buttons.context;
        confMenu.members.forEach( ( data_button, i ) => {
            ctx.fillStyle = data_button.bgColor || confMenu.bgColor || '#2a2a2a';
            ctx.fillRect( 0, fh * i, fw, fh);
        });
        texture_buttons.refresh();
        scene.textures.addSpriteSheet('sheet_buttons', texture_buttons, confMenu);
        return texture_buttons;
    
    }
};

export { Button, Menu };
