

const Model = require('./Model');

class Software extends Model{

    constructor(){

        super();

        this.dbName = `${window._name}/Softwares`;
        
        // let's load the DB

        this.loadDatabase(false);

    }

    getSoftwaresByCat(id){
        return new Promise((resolve, reject)=>{

            this.db.find({cat:id}).sort({title:1}).exec((err, result)=>{
                if(err === null){
                    resolve(result);
                }else{
                    reject(err);
                }
            });

        })
    }

    getById(id){
        return new Promise((resolve, reject)=>{

            this.db.findOne({_id:id},(err, result)=>{
                if(err === null){
                    resolve(result)
                }else{
                    reject(err)
                }
            });

        });
    }

    add(title, version, DVDnumber, cat, tags, oses = [], image = null, setup = null, programAddress = null, webAddress = null, isRecommended = false, faDesc = null, enDesc = null, faGuide = null, enGuide = null, crack = null, patch = null, serial = null){

        return new Promise((resolve, reject)=>{
            this.db.insert({
                title,
                version,
                DVDnumber,
                cat,
                tags,
                oses,
                image,
                setup,
                programAddress,
                webAddress,
                isRecommended,
                faDesc,
                enDesc,
                faGuide,
                enGuide,
                crack,
                patch,
                serial
            },(err)=>{
                if(err === null){
                    resolve();
                }else{
                    reject(err);
                }
            });
        });

    }

}

module.exports = new Software;