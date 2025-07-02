import { COLOR, GameTime, TimeBar } from '../../lib/schedule.js';

class Example extends Phaser.Scene {

    create () {
    
        let gt = null;
        gt = new GameTime({
            year: 2025, month: 6, day: 3,
            hour: 9, minute: 0, second: 0, ms:0,
            multi: 768, real: false
        });
        
        //gt = new GameTime({
        //    time: 1751457722253,
        //    multi: 1, real: false
        //});
        
        //gt = new GameTime({ real: true });
        
        const te = gt.addTimedEvent();

        te.addEvent('start', function(){
            console.log('event started');
        });
        
        te.addEvent('update', function(){
            console.log('event update');
        });

        te.addEvent('end', function(){
            console.log('event ended');
        });
        
        const tb = new TimeBar({
            scene: this,
            gt: gt
        });
        
        this.registry.set('tb', tb);
        this.registry.set('gt', gt);
        
        
        
        
    }
    
    update (time, delta) {
        //const gt = this.registry.get('gt');
        //gt.step(delta);
        
        const tb = this.registry.get('tb');
        tb.update( delta );
        
        
        /*
        console.log(
            gt.day + '  ' + gt.jsDate.getDay() + ' ) ' +  
            String(gt.hour).padStart(2, '0') + ':' + 
            String(gt.minute).padStart(2, '0') + ':' + 
            String(gt.second).padStart(2, '0')
        );
        */
    
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

