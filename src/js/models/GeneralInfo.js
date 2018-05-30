const Model = require('./Model');

class GeneralInfo extends Model {

    constructor() {

        super();

        this.dbName = `${window._name}/GeneralInfo`;

        // let's load the DB

        this.loadDatabase(true);

    }

    fetch(cb) {

        this.db.findOne({}, cb);

    }

    create(address, aboutUs, essentials, tabTitle, tabContent, cb) {

        this.db.insert({
            address,
            aboutUs,
            essentials,
            tabTitle,
            tabContent
        }, cb);

    }

    update(address, aboutUs, essentials, tabTitle, tabContent, cb) {
        this.fetch((err, item) => {
            console.log(item)
            if (item !== null) {
                this.db.update({}, {
                    address,
                    aboutUs,
                    essentials,
                    tabTitle,
                    tabContent
                }, cb);
            } else {
                this.create(address,
                    aboutUs,
                    essentials,
                    tabTitle,
                    tabContent,
                    cb);
            }
        })


    }

}

module.exports = GeneralInfo;