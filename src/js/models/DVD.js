

const Model = require('./Model');

class DVD extends Model{

    constructor(){

        super();

        this.dbName = `${window._name}/DVDs`;
        
        // let's load the DB

        this.loadDatabase(false);

    }

}

module.exports = new DVD;