// NodeJS built-in utilies

const path = require('path');

const fs = require('fs');

// FileManager class handles file realted functionalities

class FileManager{

    /**
     * Copies the given address to the assets folder of the current pack
     * @param {String} address - The address of the file which should be copied to locale
     * @returns {String} - The new address
     */

    static copyToLocale(address){

        // Let's get the extention of the file

        let ext = path.extname(address);

        // Let's generate a new fileName

        let fileName = Date.now();

        // Let's compute the address of the assets folder of current pack

        let newPath = path.join(__dirname,'../../../dbs',window._name,'assets');
        
        let newAddress = newPath+'/'+fileName+ext;

        // Let's copy
        
        fs.copyFileSync(address,newAddress);

        // Let's return the new address

        return `../dbs/${window._name}/assets/${fileName+ext}`;

    }

}

module.exports = FileManager;