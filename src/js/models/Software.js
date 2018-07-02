const Model = require('./Model');

// The Software model

class Software extends Model {

    /**
     * @constructor loads the DB
     * @param {String} dbName - The name of the DB
     */

    constructor(dbName) {

        super();

        this.dbName = `${dbName || window._name}/Softwares`;

        // let's load the DB

        this.loadDatabase(false);

    }

    /**
     * Fetches all of the softwares
     * @returns {Promise}
     */

    fetchAll(){
        return new Promise((resolve, reject)=>{
            this.db.find({}).sort({title: 1}).exec((err, result)=>{
                if(err === null){
                    resolve(result)
                }else{
                    reject(err)
                }
            });
        })
    }

    /**
     * Gets softwares which are containing a certain category
     * @param {String} id - The id of the category
     * @returns {Promise}
     */

    getSoftwaresByCat(id) {
        return new Promise((resolve, reject) => {

            this.db.find({
                cat: id
            }).sort({
                title: 1
            }).exec((err, result) => {
                if (err === null) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });

        })
    }

    /**
     * Gets a software by it's id
     * @param {String} id - The id of the software
     * @returns {Promise}
     */

    getById(id) {
        return new Promise((resolve, reject) => {

            this.db.findOne({
                _id: id
            }, (err, result) => {
                if (err === null) {
                    resolve(result)
                } else {
                    reject(err)
                }
            });

        });
    }

    /**
     * Adds a software
     * @param {String} title - The title of the software
     * @param {Double} version - The version of the software
     * @param {Number} DVDNumber - The DVDNumber of the software
     * @param {String} cat - The cat ID of the software
     * @param {Array} tags - The tags of the software
     * @param {Array} oses - The OSes of the software
     * @param {String} image - The image address of the software
     * @param {String} setup - The setup address of the software
     * @param {String} programAddress - The programAddress of the software
     * @param {String} video - The video address of the software
     * @param {Boolean} isRecommended - The is recommended by gerdoo or not
     * @param {String} faDesc - The farsi description of the software
     * @param {String} enDesc - The english description of the software
     * @param {String} faGuide - The farsi guide of the software
     * @param {String} enGuide - The english guide of the software
     * @param {String} crack - The crack address of the software
     * @returns {Promise}
     */

    add(title, version, DVDNumber, cat, tags, oses = [], image = null, setup = null, programAddress = null, video = null, isRecommended = false, faDesc = null, enDesc = null, faGuide = null, enGuide = null, crack = null) {
        DVDNumber = parseInt(DVDNumber);
        return new Promise((resolve, reject) => {
            this.db.insert({
                title,
                version,
                DVDNumber,
                cat,
                tags,
                oses,
                image,
                setup,
                programAddress,
                video,
                isRecommended,
                faDesc,
                enDesc,
                faGuide,
                enGuide,
                crack
            }, (err) => {
                if (err === null) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        });

    }

    /**
     * Gets a software by it's title
     * @param {String} title - The title we are going to search with
     * @returns {Promise}
     */

    getByTitle(title) {
        return new Promise((resolve, reject) => {

            this.db.findOne({
                title
            }, (err, result) => {
                if (err === null) {
                    resolve(result)
                } else {
                    reject(err)
                }
            });

        });
    }

    /**
     * Searches the softwares for the best matches under the condition given
     * @param {String} string - The text we are going to search
     * @param {String} catId - The ID of the cat which the softwares should be under
     * @param {Number} DVDNumber - The DVDNumber that softwares should be under
     * @returns {Promise}
     */

    findClosest(string, catId, DVDNumber){
        DVDNumber = parseInt(DVDNumber);
        return new Promise((resolve, reject) => {

            this.db.find({
                $or:[
                    {
                        title: new RegExp(string,'i'),
                        DVDNumber,
                        cat: catId
                    },
                    {
                        tags:{
                            $regex: new RegExp(string,'i')
                        },
                        DVDNumber,
                        cat: catId
                    },
                    {
                        DVDNumber,
                        cat: catId,
                        faDesc: new RegExp(string,'i')
                    },
                    {
                        DVDNumber,
                        cat: catId,
                        enDesc: new RegExp(string,'i')
                    }
                ]
            }, (err, result) => {
                if (err === null) {
                    resolve(result)
                } else {
                    reject(err)
                }
            });

        });
    };

    /**
     * Saves(updates) a software
     * @param {String} id - The ID of the existing software which is going to be updated
     * @param {String} title - The title of the software
     * @param {Double} version - The version of the software
     * @param {Number} DVDNumber - The DVDNumber of the software
     * @param {String} cat - The cat ID of the software
     * @param {Array} tags - The tags of the software
     * @param {Array} oses - The OSes of the software
     * @param {String} image - The image address of the software
     * @param {String} setup - The setup address of the software
     * @param {String} programAddress - The programAddress of the software
     * @param {String} video - The video address of the software
     * @param {Boolean} isRecommended - The is recommended by gerdoo or not
     * @param {String} faDesc - The farsi description of the software
     * @param {String} enDesc - The english description of the software
     * @param {String} faGuide - The farsi guide of the software
     * @param {String} enGuide - The english guide of the software
     * @param {String} crack - The crack address of the software
     * @returns {Promise}
     */

    save(id, title, version, DVDNumber, cat, tags, oses = [], image = null, setup = null, programAddress = null, video = null, isRecommended = false, faDesc = null, enDesc = null, faGuide = null, enGuide = null, crack = null) {
        DVDNumber = parseInt(DVDNumber);
        return new Promise((resolve, reject) => {
            this.db.update({
                _id: id
            }, {
                title,
                version,
                DVDNumber,
                cat,
                tags,
                oses,
                image,
                setup,
                programAddress,
                video,
                isRecommended,
                faDesc,
                enDesc,
                faGuide,
                enGuide,
                crack
            }, (err) => {
                if (err === null) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * Deletes a software by it's ID
     * @param {String} id - The ID of the software
     * @returns {Promise}
     */

    deleteById(id) {
        return new Promise((resolve, reject) => {

            this.db.remove({
                _id: id
            }, (err) => {
                if (err === null) {
                    resolve()
                } else {
                    reject(err)
                }
            });

        });
    }

    /**
     * Deletes softwares which are under a certain category
     * @param {String} cat - The ID of the cat
     * @returns {Promise}
     */

    deleteByCat(cat) {
        return new Promise((resolve, reject) => {

            this.db.remove({
                cat
            }, { multi: true }, (err) => {
                if (err === null) {
                    resolve()
                } else {
                    reject(err)
                }
            });

        });
    }

    /**
     * Deletes softwares which are under a certain DVDNumber
     * @param {String} DVDNumber - The number of the DVD
     * @returns {Promise}
     */

    deleteByDVD(DVDNumber) {
        DVDNumber = parseInt(DVDNumber);
        return new Promise((resolve, reject) => {

            this.db.remove({
                DVDNumber
            }, (err) => {
                if (err === null) {
                    resolve()
                } else {
                    reject(err)
                }
            });

        });
    }

}

module.exports = Software;