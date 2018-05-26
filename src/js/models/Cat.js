

const Model = require('./Model');

class Cat extends Model{

    constructor(){

        super();

        this.dbName = `${window._name}/Cats`;
        
        // let's load the DB

        this.loadDatabase(false);

    }

    add(title, DVDNumber, tags){

        DVDNumber = parseInt(DVDNumber);

        return new Promise((resolve, reject)=>{

            this.db.insert({title, DVDNumber, tags},(err)=>{
                if(err === null){
                    resolve();
                }else{
                    reject(err);
                }
            });

        });

    }

}

module.exports = new Cat;