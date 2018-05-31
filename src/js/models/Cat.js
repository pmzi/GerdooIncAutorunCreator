const Model = require('./Model');

class Cat extends Model {

    constructor(dbName) {

        super();

        this.dbName = `${dbName || window._name}/Cats`;

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