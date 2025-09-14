import { ConsoleLogger } from '../lib/message/message.js';
import { Menu } from '../lib/ui/ui.js';

const log = new ConsoleLogger({
    cat: 'state',
    id: 'viewpopulation',
    appendId: true
});

class ViewPopulation extends Phaser.Scene {

    constructor (config) {
        super(config);
        this.key = 'ViewPopulation';
    }
    
    setup_menu () {
        const scene = this;
        let menu = this.registry.get('menu_view_population');
        
        const confMenu = Menu.createConf({
            x:0, y: 0,
            frameWidth: 64, frameHeight: 32,
            textureKey: 'texture_menu_view_population',
            menu_key : 'menu_view_population',
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
                ctx.font = '11px monospace';
                ctx.fillText( button.getData('desc'), fw / 2, fh * i + fh * 0.60);
            },
            members: [
                {
                    desc: 'Map View', x: 50, y: 420,
                    press: function(){
                        scene.scene.start('ViewMap');
                    }
                }
            ]
        });
        menu = new Menu(this, confMenu);

    }

    setup_texture () {
    
        const texture_key = 'view_population_disp';
        this.texture = this.game.textures.get(texture_key);
        if( this.texture.key === '_missing' ){
             this.texture = scene.textures.createCanvas( texture_key , 640, 480);
        }
    
    }

    create () {

        this.setup_menu();
        
        this.setup_texture();
                
    }
    
    update () {
        const menu = this.registry.get('menu_view_population');    
        const gs = this.registry.get('gameSave');
        
        menu.draw();
    }
        
}

export { ViewPopulation }

