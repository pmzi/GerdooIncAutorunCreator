
const path = require('path');
const fs = require('fs');

class FileManager{

    static copyToLocale(address){

        let ext = path.extname(address);

        let fileName = Date.now();

        let newPath = path.join(__dirname,'../../../dbs',window._name,'assets');
        
        let newAddress = newPath+'/'+fileName+ext;

        if(!fs.existsSync(newPath)){
            fs.mkdirSync(newPath);
        }
        
        fs.copyFileSync(address,newAddress);

        return `../dbs/${window._name}/assets/${fileName+ext}`;

    }

}

module.exports = FileManager;