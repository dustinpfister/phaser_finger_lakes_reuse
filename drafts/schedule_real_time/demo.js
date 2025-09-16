import { COLOR, GameTime, TimeBar } from '../../lib/schedule/schedule.js';

class Example extends Phaser.Scene {

    preload () {
        this.load.atlas('timebar', '../../json/sheets/timebar.png', '../../json/sheets/timebar.json');
        this.load.bitmapFont('min_3px_5px', '../../fonts/min_3px_5px.png', '../../fonts/min_3px_5px.xml');
    }

    create () {
        const tb = new TimeBar({
            scene: this,
            gt: new GameTime({real: true, scene: this })
        });
        const te = tb.gt.addTimedEvent({
            start: [9, 30], end: [18, 0],
            on_start: (te, gt, delta) => {
                console.log('the store is open now!');
            },
            on_update: (te, gt, delta) => {
                //console.log(gt.per);
            },
            on_end: (te, gt, delta) => {
                console.log('end : ' + gt.time);
            }
        });
        this.registry.set('tb', tb);
    }
    
    update (time, delta) {
        const tb = this.registry.get('tb');
        tb.update( delta );
    }
    
}

const config = {
    type: Phaser.WEBGL,
    parent: 'container_flr',
    canvas: document.querySelector('#canvas_flr'),
    width: 640,
    height: 480,
    scene: Example
};

const game = new Phaser.Game(config);

