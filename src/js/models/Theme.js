const Model = require('./Model');

// The Theme model

class Theme extends Model {

    /**
     * @constructor loads the DB
     */

    constructor() {
        super();

        this.dbName = `${window._name}/Themes`;

        // let's load the DB

        this.loadDatabase(false);
    }

    /**
     * Fetches all of the themes
     * @returns {Promise}
     */

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

    /**
     * Deletes a theme by it's ID
     * @param {String} id - The ID of the theme
     * @returns {Promise}
     */

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

    /**
     * Gets a theme by it's id
     * @param {String} id - The ID of the theme
     * @returns {Promise}
     */

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

    /**
     * Adds a new theme
     * @param {String} name - The name of the theme
     * @param {String} backImage - The backImage of the theme
     * @param {String} color1 - The main color of the theme
     * @param {String} color2 - The secondary color of the theme
     * @param {String} backColor - The background color of the theme
     * @returns {Promise}
     */

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

    /**
     * Edits an existing theme
     * @param {String} id - The ID of the existing theme which is going to be updated
     * @param {String} name - The name of the theme
     * @param {String} backImage - The backImage of the theme
     * @param {String} color1 - The main color of the theme
     * @param {String} color2 - The secondary color of the theme
     * @param {String} backColor - The background color of the theme
     * @returns {Promise}
     */

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