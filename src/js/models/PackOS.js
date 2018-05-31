

const Model = require('./Model');

class PackOS extends Model{

    constructor(dbName){

        super();

        this.dbName = `${dbName || window._name}/OSes`;
        
        // let's load the DB

        this.loadDatabase(false);

    }

    fetchAll(){
        return new Promise((resolve, reject)=>{
            this.db.find({}).sort({updatedAt: -1}).exec((err, result)=>{
                if(err === null){
                    resolve(result);
                }else{
                    reject(err);
                }
            });
        });

    }

    getById(id){
        return new Promise((resolve, reject)=>{
            this.db.findOne({_id:id},(err, result)=>{
                if(err === null){
                    resolve(result);
                }else{
                    reject(err);
                }
            });
        });
    }
    
    add(OSName){
        return new Promise((resolve, reject)=>{
            this.db.insert({name: OSName}, (err)=>{
                if(err === null){
                    resolve();
                }else{
                    reject(err)
                }
            });            
        })

    }

    delete(id){
        return new Promise((resolve, reject)=>{
            this.db.remove({_id:id},(err)=>{
                if(err === null){
                    resolve();
                }else{
                    reject(err)
                }
            });
        });
    }

}

module.exports = PackOS;