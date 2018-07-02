// Models

const DVD = require('../../../models/DVD');

const Software = require('../../../models/Software');

const Cat = require('../../../models/Cat');

const Pack = require('../../../models/Pack');

const PackOS = require('../../../models/PackOS');

const GeneralInfo = require('../../../models/GeneralInfo');

const Theme = require('../../../models/Theme');

// Loads the DBs

class DBLoader{

    /**
     * Loads all of the required DBs
     */

    static loadAll(){

        window.dbs = {
            dvd: new DVD(),
            software: new Software(),
            cat: new Cat(),
            packOS: new PackOS(),
            generalInfo: new GeneralInfo(),
            theme: new Theme(),
            pack: new Pack()
        };

    }

}

// Let's load the DBs

DBLoader.loadAll();