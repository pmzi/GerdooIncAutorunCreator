const Model = require('./Model');

// The PackOS model

class PackOS extends Model {

    /**
     * @constructor loads the DB
     * @param {String} dbName - The name of the DB
     */

    constructor(dbName) {

        super();

        this.dbName = `${dbName || window._name}/OSes`;

        // let's load the DB

        this.loadDatabase(false);

    }

    /**
     * Fetches all of the OSes
     * @returns {Promise}
     */

    fetchAll() {
        return new Promise((resolve, reject) => {
            this.db.find({}).sort({
                updatedAt: -1
            }).exec((err, result) => {
                if (err === null) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });

    }

    /**
     * Gets an OS by it's ID
     * @param {Number} id - The id of the OS
     * @returns {Promise}
     */

    getById(id) {
        return new Promise((resolve, reject) => {
            this.db.findOne({
                _id: id
            }, (err, result) => {
                if (err === null) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * Gets an OS by it's name
     * @param {String} name - The name of the OS
     */

    getByName(name) {
        return new Promise((resolve, reject) => {
            this.db.findOne({
                name
            }, (err, result) => {
                if (err === null) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * Adds an OS
     * @param {String} OSName - The name of the OS
     * @returns {Promise}
     */

    add(OSName) {
        return new Promise((resolve, reject) => {
            this.db.insert({
                name: OSName
            }, (err) => {
                if (err === null) {
                    resolve();
                } else {
                    reject(err)
                }
            });
        })

    }

    /**
     * Deletes an OS by it's ID
     * @param {Number} id - The ID of the OS
     * @returns {Promise}
     */

    delete(id) {
        return new Promise((resolve, reject) => {
            this.db.remove({
                _id: id
            }, (err) => {
                if (err === null) {
                    resolve();
                } else {
                    reject(err)
                }
            });
        });
    }

}

module.exports = PackOS;