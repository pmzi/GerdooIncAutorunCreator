

const Model = require('./Model');

// The OS model

class OS extends Model{

    /**
     * @constructor loads the DB
     */

    constructor(){

        super();

        this.dbName = 'OSes';
        
        // let's load the DB

        this.loadDatabase(true);

    }

    /**
     * Fetches all the OSes
     * @returns {Promise}
     */

    fetchAll(){

        return new Promise((resolve, reject)=>{
            this.db.find({}).sort({updatedAt: -1}).exec((err, result)=>{
                if(err === null){
                    resolve(result);
                }else{
                    reject(err)
                }
            });
        })

    }

    /**
     * Adds new OS
     * @param {String} OSName - The name of the OS
     * @returns {Promise}
     */
    
    add(OSName){

        return new Promise((resolve,)=>{

            this.db.insert({name: OSName}, (err)=>{
                if(err === null){
                    resolve();
                }else{
                    reject(err); 
                }
            });

        });

    }

    /**
     * Deletes an OS by it's id
     * @param {Number} id - The id of the OS
     * @returns {Promise}
     */

    delete(id){
        return new Promise((resolve, reject)=>{
            this.db.remove({_id:id},(err)=>{
                if(err === null){
                    resolve()
                }else{
                    reject(err)
                }
            });
        });
    }

}

module.exports = OS;