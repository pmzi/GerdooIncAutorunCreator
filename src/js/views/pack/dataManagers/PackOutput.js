const fs = require('fs');
const path = require('path');

const ncp = require('ncp');

class PackOutput {

    static initStaticEvents() {

        // Event for output Buttons

        let outputButtons = $('.stepWrapper:nth-of-type(4) button');

        // For windows output button

        outputButtons[0].onclick = () => {

            this.handleCopy(0);

        }

        outputButtons[1].onclick = () => {

            this.handleCopy(1);

        }

        outputButtons[2].onclick = () => {

            this.handleCopy(2);

        }

    }

    static handleCopy(type) {

        Loading.showLoading();

        // let's check whther destination exists or not

        if (!this.checkDestinationExistance()) {
            PropellerMessage.showMessage("آدرس اتوران موجود نمی‌باشد.", "error");
            Loading.hideLoading();
            return;
        }

        // Copy autorun to desired location

        this.copyAutorun(type).then(() => {

            // copy database

            this.copyDatabase().then(() => {

                // we are done

                this.serializeImages().then(() => {

                    Loading.hideLoading();

                    PropellerMessage.showMessage("خروجی با موفقیت در محل مورد نظر قرار گرفت.", "success");

                    resolve();

                })

            }).catch((e) => {
                
                PropellerMessage.showMessage("مشکلی رخ داد.", "error");

                Loading.hideLoading();

            })

        })

    }

    static get destination() {

        return $('[data-this="autorunLocation"]').val();

    }

    static checkDestinationExistance() {

        if (fs.existsSync(this.destination)) {
            return true;
        } else {
            return false;
        }

    }

    static serializeImages() {


        return new Promise((resolve, reject) => {
            const imageRegex = new RegExp(`"\.\.\/dbs\/${window._name}\/assets\/(.+?)(\"|")`, 'ig');


            fs.readFile(path.join(this.destination, `${window._name}/db`, 'GeneralInfo.db'), "utf8", (err, generalInfo) => {

                // Let's serialize the image

                generalInfo = generalInfo.replace(imageRegex, "\"$1\"");

                fs.writeFile(path.join(this.destination, `${window._name}/db`, 'GeneralInfo.db'), generalInfo, () => {

                    fs.readFile(path.join(this.destination, `${window._name}/db`, 'Softwares.db'), "utf8", (err, softwares) => {

                        // Let's serialize the image

                        softwares = softwares.replace(imageRegex, "\"$1\"");

                        fs.writeFile(path.join(this.destination, `${window._name}/db`, 'Softwares.db'), softwares, () => {

                            resolve();

                        });

                    });

                });

            })
        })

    }

    static copyDatabase() {

        return new Promise((resolve, reject) => {

            if (!fs.existsSync(path.join(this.destination, window._name))) {
                fs.mkdirSync(path.join(this.destination, window._name));
            }

            ncp.limit = 10;
            resolve()
            ncp(path.join(__dirname, '../../../../', `dbs/${window._name}`), path.join(this.destination, window._name, 'db'), function (err) {
                if (err) {
                    reject(err)
                }
                // Giving it time to close the file
                setTimeout(() => {
                    resolve();
                }, 100)

            });

        })


    }

    static copyAutorun(type) {

        return new Promise((resolve, reject) => {

            resolve();

        })

    }

}

PackOutput.initStaticEvents();