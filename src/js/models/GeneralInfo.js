const Model = require('./Model');

// The GeneralInfo model

class GeneralInfo extends Model {

    /**
     * @constructor loads the DB
     */

    constructor() {

        super();

        this.dbName = `${window._name}/GeneralInfo`;

        // let's load the DB

        this.loadDatabase(true);

    }

    /**
     * Fetches GeneralInfo of the pack
     * @returns {Promise}
     */

    fetch() {

        return new Promise((resolve, reject)=>{

            this.db.findOne({}, (err, item)=>{
                if(err === null){
                    resolve(item);
                }
                
                reject(err)

            });

        })

    }

    /**
     * Creates GeneralInfo record
     * @param {String} address - The address of the output
     * @param {String} aboutUs - The about us of the pack
     * @param {String} essentials - The essentials of the pack
     * @param {String} tabTitle - The tabTitle of the pack
     * @param {String} tabContent - The content of the optional tab
     * @returns {Promise} 
     */

    create(address, aboutUs, essentials, tabTitle, tabContent) {

        return new Promise((resolve, reject)=>{

            this.db.insert({
                address,
                aboutUs,
                essentials,
                tabTitle,
                tabContent
            }, (err)=>{
                console.log(err)

                if(err === null){
                    resolve();
                }

                reject();

            });

        })

    }

    /**
     * Updates GeneralInfo of the pack
     * @param {String} address - The address of the output
     * @param {String} aboutUs - The about us of the pack
     * @param {String} essentials - The essentials of the pack
     * @param {String} tabTitle - The tabTitle of the pack
     * @param {String} tabContent - The content of the optional tab
     * @returns {Promise} 
     */

    update(address, aboutUs, essentials, tabTitle, tabContent) {

        return new Promise((resolve, reject)=>{

            this.fetch().then((item) => {
                console.log(item)
                if (item !== null) {
                    this.db.update({}, {
                        address,
                        aboutUs,
                        essentials,
                        tabTitle,
                        tabContent
                    }, (err)=>{

                        console.log(err)

                        if(err === null){
                            resolve();
                        }

                        reject();
                        
                    });
                } else {
                    this.create(address,
                        aboutUs,
                        essentials,
                        tabTitle,
                        tabContent).then(()=>{
                            resolve();
                        })
                }
            })

        })

    }

}

module.exports = GeneralInfo;