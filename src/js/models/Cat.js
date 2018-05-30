const Model = require('./Model');

class Cat extends Model {

    constructor() {

        super();

        this.dbName = `${window._name}/Cats`;

        // let's load the DB

        this.loadDatabase(false);

    }

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

    deleteByDVD(DVDNumber) {
        DVDNumber = parseInt(DVDNumber);
        return new Promise((resolve, reject) => {
            this.db.remove({
                DVDNumber
            }, (err) => {
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