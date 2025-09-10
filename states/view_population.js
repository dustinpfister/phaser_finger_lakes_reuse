import { Load } from './load.js';
import { Mapview } from './mapview.js';
import { ConsoleLogger } from '../lib/message/message.js';

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

    create () {
        
    }
        
}

export { ViewPopulation }

