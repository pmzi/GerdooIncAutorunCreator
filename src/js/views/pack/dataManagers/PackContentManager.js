const DVD = require('../../../models/DVD');
const software = require('../../../models/Software');
const cat = require('../../../models/Cat');

class PackContentManager{
    constructor() {

        // loads all the dvds, cats and softwares into the menu

        this.load().then(() => {

            this.initEvents();

        })

    }

    load() {
        return new Promise((resolve, reject) => {

            resolve();
            
        })
    }

    initEvents() {

        // events for add dvd

        

        // events for delete dvd

    }
}

new PackContentManager();