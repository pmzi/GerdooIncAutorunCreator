

const Model = require('./Model');

class OS extends Model{

    constructor(){

        super();

        this.dbName = 'OSes';
        
        // let's load the DB

        this.loadDatabase(true);

    }

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