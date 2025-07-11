import { COLOR, GameTime, TimeBar } from '../../lib/schedule.js';

class Example extends Phaser.Scene {

    preload () {
        this.load.atlas('timebar', '../../sheets/timebar.png', '../../sheets/timebar.json');
        this.load.bitmapFont('min_3px_5px', '../../fonts/min_3px_5px.png', '../../fonts/min_3px_5px.xml');
    }

    create () {
        const tb = new TimeBar({
            scene: this,
            gt: new GameTime({
                scene: this,
                year: 2025, month: 6, day: 3,
                hour: 9, minute: 0, second: 0, ms:0,
                multi: 700, real: false
            })
        });
        
        tb.gt.addTimedEvent({
            start: [9, 30], end: [14, 0],
            //on_start: (te, gt, delta) => {},
            //on_update: (te, gt, delta) => {},
            //on_end: (te, gt, delta) => {}
        });
        
        tb.gt.addTimedEvent({ start: [ 9, 45], end: [10, 0] });
        tb.gt.addTimedEvent({ start: [10,  0], end: [10, 15] });
        tb.gt.addTimedEvent({ start: [12,  0], end: [12, 15] });
        
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

