const Datastore = require('nedb');

class Model{

    loadDatabase(timestampData){

        // let's load the db
        this.db = new Datastore({
            filename: `${__dirname}/../../dbs/${this.dbName}.db`,
            timestampData: timestampData || false
        });

        this.db.loadDatabase();

    }

}

module.exports = Model;