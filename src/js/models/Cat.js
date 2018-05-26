

const Model = require('./Model');

class Cat extends Model{

    constructor(){

        super();

        this.dbName = `${window._name}/Cats`;
        
        // let's load the DB

        this.loadDatabase(false);

    }

}

module.exports = new Cat;