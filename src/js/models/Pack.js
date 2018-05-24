

const Model = require('./Model');

class Pack extends Model{

    constructor(){

        super();

        this.dbName = 'Packs';
        
        // let's load the DB

        this.loadDatabase(true);

    }

    fetchAll(cb){

        this.db.find({}).sort({updatedAt: -1}).exec(cb);

    }
    
    add(packName, cb){
        
        this.db.insert({name: packName}, cb);

    }

}

module.exports = new Pack;