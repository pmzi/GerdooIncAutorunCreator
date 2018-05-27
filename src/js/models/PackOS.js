

const Model = require('./Model');

class PackOSes extends Model{

    constructor(){

        super();

        this.dbName = `${window._name}/OSes`;
        
        // let's load the DB

        this.loadDatabase(true);

    }

    fetchAll(cb){

        this.db.find({}).sort({updatedAt: -1}).exec(cb);

    }
    
    add(OSName, cb){
        
        this.db.insert({name: OSName}, cb);

    }

    delete(id, cb){
        this.db.remove({_id:id},cb);
    }

}

module.exports = new PackOSes;