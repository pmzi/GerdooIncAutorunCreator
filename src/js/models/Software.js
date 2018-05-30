const Model = require('./Model');

class Software extends Model {

    constructor() {

        super();

        this.dbName = `${window._name}/Softwares`;

        // let's load the DB

        this.loadDatabase(false);

    }

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

    add(title, version, DVDnumber, cat, tags, oses = [], image = null, setup = null, programAddress = null, webAddress = null, isRecommended = false, faDesc = null, enDesc = null, faGuide = null, enGuide = null, crack = null, patch = null, serial = null) {
        DVDnumber = parseInt(DVDnumber);
        return new Promise((resolve, reject) => {
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
            }, (err) => {
                if (err === null) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        });

    }

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
                            $in: [new RegExp(string,'i')]
                        },
                        DVDNumber,
                        cat: catId
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

    save(id, title, version, DVDnumber, cat, tags, oses = [], image = null, setup = null, programAddress = null, webAddress = null, isRecommended = false, faDesc = null, enDesc = null, faGuide = null, enGuide = null, crack = null, patch = null, serial = null) {
        DVDnumber = parseInt(DVDnumber);
        return new Promise((resolve, reject) => {
            this.db.update({
                _id: id
            }, {
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
                    resolve()
                } else {
                    reject(err)
                }
            });

        });
    }

    deleteByCat(cat) {
        return new Promise((resolve, reject) => {

            this.db.remove({
                cat
            }, (err) => {
                if (err === null) {
                    resolve()
                } else {
                    reject(err)
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
                    resolve()
                } else {
                    reject(err)
                }
            });

        });
    }

}

module.exports = Software;