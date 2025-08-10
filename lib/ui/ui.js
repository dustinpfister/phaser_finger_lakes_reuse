
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
};

export { Button, Menu };
