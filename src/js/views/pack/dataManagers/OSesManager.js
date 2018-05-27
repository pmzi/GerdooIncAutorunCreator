const PackOSes = require('../../../models/PackOS');

class OSesManager{

    constructor(){

        this.load().then(()=>{
            this.initEvents();
        })

    }

    load(){

    }

    initEvents(){

    }

}

new OSesManager();