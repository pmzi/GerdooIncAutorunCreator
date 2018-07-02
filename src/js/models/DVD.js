const Model = require('./Model');

// The DVD model

class DVD extends Model {

    /**
     * @constructor loads the DB
     */

    constructor() {

        super();

        this.dbName = `${window._name}/DVDs`;

        // Let's load the DB

        this.loadDatabase(false);

        // Let's index some properties

        this.index();

    }

    /**
     * Indexes some properties
     */

    index() {

        this.db.ensureIndex({
            fieldName: 'number',
            unique: true
        });

    }

    /**
     * Gets all teh DVDs from the DB
     * @returns {Promise}
     */

    fetchAll() {
        return new Promise((resolve, reject) => {

            this.db.find({}).sort({
                number: 1
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
     * Adds a new DVDNumber
     * @param {Number} DVDNumber - The DVDNumber to add
     * @returns {Promise}
     */

    add(DVDNumber) {

        DVDNumber = parseInt(DVDNumber);

        return new Promise((resolve, reject) => {

            this.db.insert({
                number: DVDNumber
            }, (err) => {
                if (!err) {
                    resolve();
                } else {
                    reject(err);
                }
            });

        });

    }

    /**
     * Gets only DVDNumbers
     * @returns {Promise}
     */

    getDVDNumbers() {
        return new Promise((resolve, reject) => {
            this.db.find({}, {
                number: 1,
                _id: 0
            }).sort({
                number: 1
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
     * Deletes a DVDNumber by it's number
     * @param {Number} number - The DVDNumber we are going to delete the DVD with
     * @returns {Promise}
     */

    deleteByNumber(number) {
        number = parseInt(number);
        return new Promise((resolve, reject) => {

            this.db.remove({
                number
            }, (err) => {
                if (err === null) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        })
    }

}

module.exports = DVD;