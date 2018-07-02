const Model = require('./Model');

// The Cat model

class Cat extends Model {

    /**
     * @constructor loads the DB
     * @param {String} dbName - The name of the DB
     */

    constructor(dbName) {

        super();

        this.dbName = `${dbName || window._name}/Cats`;

        // Let's load the DB

        this.loadDatabase(false);

    }

    /**
     * Gets all titles of the cats
     * @returns {Promise}
     */

    getAllTitles() {

        return new Promise((resolve, reject) => {
            this.db.find({}, {
                title: 1
            }, (err, result) => {
                if (err === null) {
                    resolve(result);
                } else {
                    reject(err);
                }
            })
        });

    }

    /**
     * Gets titles of the cats which are in the given DVDNumber
     * @param {Number} DVDnumber - The DVDNumber wich we are going to look through
     * @returns {Promise}
     */

    getTitlesByDVDNumber(DVDNumber) {
        DVDNumber = parseInt(DVDNumber);
        return new Promise((resolve, reject) => {
            this.db.find({
                DVDNumber
            }).sort({
                title: 1
            }).exec((err, result) => {
                if (err === null) {
                    resolve(result);
                } else {
                    reject();
                }
            });
        });
    }

    /**
     * Gets a cat by id
     * @param {Number} id - The id of the cat
     * @returns {Promise}
     */

    getById(id){
        return new Promise((resolve, reject) => {
            this.db.findOne({
                _id:id
            },(err, result) => {
                if (err === null) {
                    resolve(result);
                } else {
                    reject();
                }
            });
        });
    }

    /**
     * Searches cats and returns cats which match the condition
     * @param {string} string - The string which we are going to search with
     * @param {Number} DVDNumber - The DVDNumber that cats should be in
     * @returns {Promise}
     */

    findClosest(string, DVDNumber){
        DVDNumber = parseInt(DVDNumber);
        return new Promise((resolve, reject) => {

            this.db.find({
                $or:[
                    {
                        title: new RegExp(string,'i'),
                        DVDNumber
                    },
                    {
                        tags:{
                            $regex: new RegExp(string,'i')
                        },
                        DVDNumber
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
     * Checks whether the condition matches the given cat or not
     * @param {String} string - The string which we are going to match with
     * @param {Number} DVDnumber - The DVDNumber that the cat should be in
     * @param {String} catId - The id of the cat which we are going to check
     * @returns {Promise}
     */

    matchItSelf(string, DVDNumber, catId){
        DVDNumber = parseInt(DVDNumber);
        return new Promise((resolve, reject) => {

            this.db.find({
                $or:[
                    {
                        title: new RegExp(string,'i'),
                        DVDNumber,
                        _id:catId
                    },
                    {
                        tags:{
                            $regex: new RegExp(string,'i')
                        },
                        DVDNumber,
                        _id: catId
                    }
                ]
            }, (err, result) => {
                if (err === null) {
                    if(result.length !== 0){
                        resolve(true)
                    }
                    resolve(false)
                } else {
                    reject(err)
                }
            });

        });
    }

    /**
     * Adds a cat to the DB
     * @param {String} title - The title of the cat
     * @param {Number} DVDNumber - The DVDNumber of the cat
     * @param {Array} tags - The tags of the cat
     * @returns {Promise}
     */

    add(title, DVDNumber, tags) {

        DVDNumber = parseInt(DVDNumber);

        return new Promise((resolve, reject) => {

            this.db.insert({
                title,
                DVDNumber,
                tags
            }, (err, cat) => {
                if (err === null) {
                    resolve(cat);
                } else {
                    reject(err);
                }
            });

        });

    }

    /**
     * Edits an existing cat
     * @param {String} id - The id of the cat we are going to edit
     * @param {String} title - The new title of the cat
     * @param {Number} DVDNumber - The new DVDNumber of the cat
     * @param {Array} tags - The new tags of the cat
     * @returns {Promise}
     */

    edit(id, title, DVDNumber, tags) {
        DVDNumber = parseInt(DVDNumber);

        return new Promise((resolve, reject) => {

            this.db.update({
                _id: id
            }, {
                title,
                DVDNumber,
                tags
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
     * Deletes a cat by it's id
     * @param {String} id - The id of the cat
     * @returns {Promise}
     */

    deleteById(id) {
        return new Promise((resolve, reject) => {
            this.db.remove({
                _id: id
            }, (err) => {
                if (err === null) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    /**
     * Deletes cats inside the given DVDNumber
     * @param {Number} DVDNumber - The DVDNumber we are going to delete cats with
     * @returns {Promise}
     */

    deleteByDVD(DVDNumber) {
        DVDNumber = parseInt(DVDNumber);
        return new Promise((resolve, reject) => {
            this.db.remove({
                DVDNumber
            }, { multi: true }, (err) => {
                if (err === null) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

}

module.exports = Cat;