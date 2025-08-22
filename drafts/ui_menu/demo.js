import { GlobalControl, Menu } from '../../lib/ui/ui.js';


const draw_base = function(ctx, canvas, i, menu) {
    const button = this, fw = menu.fw, fh = menu.fh, lw = menu.lineWidth, hlw = lw / 2;
    ctx.fillStyle = menu.colors[0] || '#ffffff';
    ctx.fillRect( 0, fh * i, fw, fh);
};

const draw_button = function(ctx, canvas, i, menu) {
    const button = this, fw = menu.fw, fh = menu.fh, lw = menu.lineWidth, hlw = lw / 2;
    draw_base.call(button, ctx, canvas, i, menu);
    if(i === menu.member_index){
        ctx.lineWidth = lw;
        ctx.strokeStyle = menu.colors[2] || '#000000';
        ctx.strokeRect( hlw, fh * i + hlw, fw - lw, fh - lw);
    }
    ctx.fillStyle = menu.colors[1] || '#000000';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = Math.floor( fh * 0.75 ) + 'px monospace';
    ctx.fillText( button.getData('desc'), fw / 2, fh * i + fh * 0.60);
};

class Example extends Phaser.Scene {

    create () {
    
        GlobalControl.setUp(this);
    
        const confMenu = Menu.createConf({
            lineWidth: 3, colors: ['#00af22', '#f0f0f0', '#bfbfbf'],
            draw : draw_base,
            members: [
                {
                    desc: 'Foo', 
                    draw: draw_button,
                    press: function(){
                        console.log('foo!');
                    }
                },
                {
                    desc: 'Bar',
                    draw: draw_button,
                    press: function(){
                        console.log('bar!');
                    }
                },
                {
                    desc: 'Baz',
                    draw: draw_button,
                    press: function(){
                        console.log('baz!');
                    }
                }
            ]
        });
        //Menu.createCanvas(this, confMenu);
        const menu = new Menu(this, confMenu);
        

        
        this.registry.set('menu', menu);
    }
    
    update () {
        const menu = this.registry.get('menu');
        menu.draw();
    }
    
}

const config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    parent: 'container_flr',
    canvas: document.querySelector('#canvas_flr'),
    scene: Example
};

const game = new Phaser.Game(config);
