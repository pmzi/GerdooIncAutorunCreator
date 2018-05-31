const Model = require('./Model');

class Theme extends Model {

    constructor() {
        super();

        this.dbName = `${window._name}/Themes`;

        // let's load the DB

        this.loadDatabase(false);
    }

    fetchAll() {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err, result) => {
                if (err === null) {
                    resolve(result);
                } else {
                    reject(err)
                }
            })
        })
    }

    deleteById(id) {
        return new Promise((resolve, reject) => {
            this.db.remove({
                _id: id
            }, (err, result) => {
                if (err === null) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            this.db.find({
                _id: id
            }, (err, result) => {
                if (err === null) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    }

    add(name, backImage, color1, color2, backColor) {
        return new Promise((resolve, reject) => {
            this.db.insert({
                name,
                backImage,
                color1,
                color2,
                backColor
            }, (err) => {
                if (err === null) {
                    resolve()
                } else {
                    reject(err)
                }
            })
        })
    }

    edit(id, name, backImage, color1, color2, backColor) {
        return new Promise((resolve, reject) => {
            this.db.update({
                _id: id
            }, {
                name,
                backImage,
                color1,
                color2,
                backColor
            }, (err) => {
                if (err === null) {
                    resolve()
                } else {
                    reject(err)
                }
            })
        })
    }

}

module.exports = Theme;