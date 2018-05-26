

const Model = require('./Model');

class DVD extends Model{

    constructor(){

        super();

        this.dbName = `${window._name}/DVDs`;
        
        // let's load the DB

        this.loadDatabase(false);

        this.index();

    }

    index(){

        this.db.ensureIndex({fieldName:'number',unique:true});

    }

    fetchAll(){
        return new Promise((resolve, reject)=>{

            this.db.find({}).sort({number:1}).exec((err, result)=>{
                if(err === null){
                    resolve(result);
                }else{
                    reject(err);
                }
            });
        })

    }

    add(DVDNumber){

        DVDNumber = parseInt(DVDNumber);

        return new Promise((resolve, reject)=>{

            this.db.insert({number:DVDNumber},(err)=>{
                if(!err){
                    resolve();
                }else{
                    reject(err);
                }
            });

        });

    }

    getDVDNumbers(){
        return new Promise((resolve, reject)=>{
            this.db.find({},{number:1, _id: 0}).sort({number:1}).exec((err, result)=>{
                if(err === null){
                    resolve(result);
                }else{
                    reject(err);
                }
            });
        });
    }

}

module.exports = new DVD;