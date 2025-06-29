import { COLOR, GameTime } from '../../lib/schedule.js';

class Example extends Phaser.Scene {

    create () {
    
        //const gt = new GameTime({
        //    year: 2024,
        //    month: 4, day: 6, hour: 10, minute: 5, second: 30, ms: 500
        //});
        
        const gt = new GameTime({
            //time: 1680789930501,
            year: 2025, month: 6, day: 3,
            hour: 9, minute: 30, second: 0, ms:0,
            multi: 768 //384 //192 //96 //48
        });
        
        //gt.setFromDate( new Date() )s
        
        this.registry.set('gt', gt);
        
        console.log( gt)
    
        
    }
    
    update (time, delta) {
        const gt = this.registry.get('gt');
        gt.step(delta);
        
        console.log(
            gt.day + '  ' + gt.jsDate.getDay() + ' ) ' +  
            String(gt.hour).padStart(2, '0') + ':' + 
            String(gt.minute).padStart(2, '0') + ':' + 
            String(gt.second).padStart(2, '0')
        );
    
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

