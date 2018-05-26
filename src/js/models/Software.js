

const Model = require('./Model');

class Software extends Model{

    constructor(){

        super();

        this.dbName = `${window._name}/Softwares`;
        
        // let's load the DB

        this.loadDatabase(false);

    }

}

module.exports = new Software;