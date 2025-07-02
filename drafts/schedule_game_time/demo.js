import { COLOR, GameTime, TimeBar } from '../../lib/schedule.js';

class Example extends Phaser.Scene {

    preload () {
        this.load.bitmapFont('min_3px_5px', '../../fonts/min_3px_5px.png', '../../fonts/min_3px_5px.xml');
    }

    create () {
        const tb = new TimeBar({
            scene: this,
            gt: new GameTime({
                year: 2025, month: 6, day: 3,
                hour: 9, minute: 0, second: 0, ms:0,
                multi: 768, real: false
            })
        });
        
        const te = tb.gt.addTimedEvent({
            start: [9, 30], end: [10, 0],
            on_start: (te, gt, delta) => {
                console.log('we be good mun: ' + te.time_start);
            },
            on_update: (te, gt, delta) => {
                console.log('update: ' + delta);
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
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);

