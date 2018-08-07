// NodeJs built int modules

const fs = require('fs');

const path = require('path');

// ncp package for copying a folder and it's content to a destination folder

const ncp = require('ncp');

// PackOutput class which handles events and data related to making an output

class PackOutput {

    /**
     * Initiates the static events which are realted to the output system
     */

    static initStaticEvents() {

        // Let's get the output buttons(For Windows, Max & Linux)

        let outputButtons = $('.stepWrapper:nth-of-type(4) button');

        // Let's set the event for the Windows output button

        outputButtons[0].onclick = () => {

            // Let's make the ouput

            this.handleCopy(0);

        }

        // Let's set the event for the Mac button

        outputButtons[1].onclick = () => {

            // Let's make the output

            this.handleCopy(1);

        }

        // Let's set the event for the Linux button

        outputButtons[2].onclick = () => {

            // Let's make the output

            this.handleCopy(2);

        }

    }

    /**
     * Makes the output for the oporation system based on the type
     * @param {Number} type - The oporation system(0 -> Windows, 1 -> Mac, 2 -> Linux)
     */

    static handleCopy(type) {

        // Let's show the loading

        Loading.showLoading();

        // Let's check whether destination exists or not

        if (!this.checkDestinationExistance()) {

            PropellerMessage.showMessage("آدرس اتوران موجود نمی‌باشد.", "error");

            Loading.hideLoading();

            return;

        }

        // Let's copy autorun to desired location

        this.copyAutorun(type).then(() => {

            // Let's copy database

            this.copyDatabase().then(() => {

                // Let's search the DB for images or video addresses and change them

                this.serializeImages().then(() => {                    

                    // We are done

                    // Let's hide the loading and inform the user

                    Loading.hideLoading();

                    PropellerMessage.showMessage("خروجی با موفقیت در محل مورد نظر قرار گرفت.", "success");
                })

            }).catch((e) => {

                // Some error occured

                PropellerMessage.showMessage("مشکلی رخ داد.", "error");

                Loading.hideLoading();

            })

        })

    }

    /**
     * Get destination
     * @returns {String} - The destination of the output
     */

    static get destination() {

        // Let's get the output address from the first tab and return it

        return $('[data-this="autorunLocation"]').val();

    }

    /**
     * Checks whether destination folder exists or not
     * @returns {Boolean}
     */

    static checkDestinationExistance() {

        // Let's check the existance

        if (fs.existsSync(this.destination)) {

            // Exists

            return true;

        } else {

            // Nah! Doesn't exist

            return false;

        }

    }

    /**
     * Searches DB for the images and video addresses and changes them to new relative address
     * @returns {Promise}
     */

    static serializeImages() {


        return new Promise((resolve, reject) => {

            // Let's set the RegEx

            const imageRegex = new RegExp(`"\.\.\/dbs\/${window._name}\/assets\/(.+?)(\"|")`, 'ig');

            // Let's read GeneralInfo DB

            fs.readFile(path.join(this.destination, window._name, 'resources/app/src/db/', 'GeneralInfo.db'), "utf8", (err, generalInfo) => {

                // Let's search and replace the imge addresses of the GeneralInfo DB

                console.log(generalInfo, err)

                generalInfo = generalInfo.replace(imageRegex, "\"../db/assets/$1\"");

                // Let's write to GeneralInfo DB file

                fs.writeFile(path.join(this.destination, window._name, 'resources/app/src/db/', 'GeneralInfo.db'), generalInfo, () => {

                    // Let's read Softwares DB

                    fs.readFile(path.join(this.destination, window._name, 'resources/app/src/db/', 'Softwares.db'), "utf8", (err, softwares) => {

                        // Let's search and replace the imge addresses of the Sotwares DB

                        softwares = softwares.replace(imageRegex, "\"../db/assets/$1\"");

                        // Let's write to Softwares DB file

                        fs.writeFile(path.join(this.destination, window._name, 'resources/app/src/db/', 'Softwares.db'), softwares, () => {

                            // We are done :-)

                            resolve();

                        });

                    });

                });

            })
        })

    }

    /**
     * Copies the DB to destination folder
     * @returns {Promise}
     */

    static copyDatabase() {

        return new Promise((resolve, reject) => {

            // Setting the limit of number of files being copied at the same timt to 10

            ncp.limit = 6;

            // Let's copy the DBs to the destination

            let source = path.join(__dirname, '../../../../', `dbs/${window._name}`);

            let destiny = path.join(this.destination, window._name, 'resources/app/src/db/');
            
            ncp(source, destiny, (err)=>{
                if (err) {
                    console.log(err)
                    reject(err)
                }

                // We are done :-)
                resolve();

            });

        })


    }

    /**
     * Copies autorun files to the destination folder
     * @param {Number} type - The type of the OS that you want the autorun to be executed on(0 -> Windows, 1 -> Mac, 2 -> Linux)
     * @returns {Promise}
     */

    static copyAutorun(type) {

        return new Promise((resolve, reject) => {
            
            // Checks whether Destination/{Pack Name} directory exists or now, if not -> creates it

            if (!fs.existsSync(path.join(this.destination, window._name))) {

                // Let's create the directory

                fs.mkdirSync(path.join(this.destination, window._name));

            }

            let destiny = path.join(this.destination, window._name);

            switch(type){
                case 0:
                    ncp.limit = 10;
                
                    let source = path.join(__dirname, '../../../../../','autoruns/gerdooincautorunuser-win32-ia32');
                    

                    ncp(source, destiny, (err)=> {
                        if (err) {
                            return console.error(err);
                        }

                        if(fs.existsSync(destiny + `/resources/electron.txt`)){
                            fs.renameSync(destiny + `/resources/electron.txt`, destiny + '/resources/electron.asar');
                        }

                        resolve();

                    });
                break;
            }

            

        })

    }

}

// Let's listen for output related events

PackOutput.initStaticEvents();