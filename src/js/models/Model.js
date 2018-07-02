const Datastore = require('nedb');

class Model{

    /**
     * Loads the DB
     * @param {Boolean} timestampData - Whether set created_at and updated_at or not
     */

    loadDatabase(timestampData){

        // Let's load the DB

        this.db = new Datastore({
            filename: `${__dirname}/../../dbs/${this.dbName}.db`,
            timestampData: timestampData || false
        });

        this.db.loadDatabase();

    }

}

module.exports = Model;