

const Model = require('./Model');

class Software extends Model{

    constructor(){

        super();

        this.dbName = `${window._name}/Softwares`;
        
        // let's load the DB

        this.loadDatabase(false);

    }

    add(title, DVDnumber, cat, tags, oses = [], image = null, setup = null, programAddress = null, webAddress = null, isRecommended = false, faDesc = null, enDesc = null, faGuide = null, enGuide = null, crack = null, patch = null, serial = null){

        return new Promise((resolve, reject)=>{
            this.db.insert({
                title,
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