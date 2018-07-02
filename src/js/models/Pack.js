const Model = require('./Model');

// The Pack model

class Pack extends Model {

    /**
     * @constructor loads the DB
     */

    constructor() {

        super();

        this.dbName = 'Packs';

        // let's load the DB

        this.loadDatabase(true);

    }

    /**
     * Fetches all of the Packs
     * @returns {Promise}
     */

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

    /**
     * Adds a new pack
     * @param {String} packName - The name of the pack
     * @returns {Promise}
     */

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

    /**
     * Deletes a pack by it's ID
     * @param {Number} id - The ID of the pack
     * @returns {Promise}
     */

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

    /**
     * Gets a pack by it's ID
     * @param {Number} id - The ID of the pack
     * @returns {Promise}
     */

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