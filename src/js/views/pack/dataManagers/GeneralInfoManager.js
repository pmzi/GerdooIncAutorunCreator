// Models refrence

const generalInfo = window.dbs.generalInfo;

// GeneralInfoManager class which handles events and data related to GeneralInfo

class GeneralInfoManager{

    /**
     * Loads the GeneralInfo -> address, tabTitle and so on
     * @returns {Promise}
     */

    static load() {
        return new Promise((resolve, reject) => {

            generalInfo.fetch().then((item)=>{

                console.log(item)
                
                if(item !== null){

                    // let's show the info

                    let quillEditors = $('.stepWrapper:nth-of-type(1) .quillEditor>div:first-of-type');
        
                    let inputs = $('.stepWrapper:nth-of-type(1) input[type=text]');

                    // Let's fill in data

                    inputs[0].value = item.address;
                    inputs[3].value = item.tabTitle;

                    quillEditors[0].innerHTML = item.aboutUs;
                    quillEditors[1].innerHTML = item.essentials;
                    quillEditors[2].innerHTML = item.tabContent;

                }

            });

            // We are done
            
            resolve();
        })
    }

    /**
     * Initializes the static events related to GeneralInfo
     */

    static initStaticEvents() {

        // Save button for saving GeneralInfo

        $('.stepWrapper:nth-of-type(1) .saveBtn').click(()=>{
            
            this.update();

        })

    }

    /**
     * updates the GeneralInfo and saves them to DB
     */

    static update(){

        // Let's showing the loading

        Loading.showLoading();

        // Let's gather the data
        
        let quillEditors = $('.stepWrapper:nth-of-type(1) .quillEditor>div:first-of-type');
        
        let inputs = $('.stepWrapper:nth-of-type(1) input[type=text]');

        // Let's save the data to DB
        
        generalInfo.update(inputs[0].value,quillEditors[0].innerHTML,quillEditors[1].innerHTML,inputs[3].value,quillEditors[2].innerHTML).then(()=>{
            
            // We are done

            Loading.hideLoading();

            PropellerMessage.showMessage('تغییرات با موفقیت ذخیره شدند.','success');

        });

    }

}

// Let's load info and init static events

GeneralInfoManager.load().then(() => {

    GeneralInfoManager.initStaticEvents();

})