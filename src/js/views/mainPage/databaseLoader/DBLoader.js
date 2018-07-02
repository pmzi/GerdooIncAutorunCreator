// Models

const Pack = require('../../../models/Pack');

const OS = require('../../../models/OS');

class DBLoader{

    /**
     * Loads all of the required DBs
     */

    static loadAll(){

        window.dbs = {
            pack: new Pack(),
            os: new OS()
        };

    }

}

// Let's load the DBs

DBLoader.loadAll();