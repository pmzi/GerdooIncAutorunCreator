const Model = require('./Model');

class Pack extends Model {

    constructor() {

        super();

        this.dbName = 'Packs';

        // let's load the DB

        this.loadDatabase(true);

    }

    fetchAll() {
        return new Promise((resolve, reject)=>{
            this.db.find({}).sort({
                updatedAt: -1
            }).exec((err, result)=>{
                if(err === null){
                    resolve(result);
                }else{
                    reject(err);
                }
            });
        });

    }

    add(packName) {
        
        return new Promise((resolve, reject)=>{
            this.db.insert({
                name: packName
            }, (err, result)=>{
                if(err === null){
                    resolve(result);
                }else{
                    reject(err);
                }
            });
        });

    }

    delete(id) {

        return new Promise((resolve, reject) => {
            this.db.remove({
                _id: id
            }, (err,result)=>{
                if(err === null){
                    resolve(result);
                }else{
                    reject(err);
                }
            });

        })


    }

    getById(id) {

        return new Promise((resolve, reject)=>{
            this.db.findOne({
                _id: id
            }, (err, result)=>{
                if(err === null){
                    resolve(result);
                }else{
                    reject(err);
                }
            })
        });

    }

}

module.exports = Pack;