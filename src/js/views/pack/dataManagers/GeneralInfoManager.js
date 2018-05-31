const GeneralInfo = require('../../../models/GeneralInfo');

//

const generalInfo = new GeneralInfo();

//

class GeneralInfoManager{

    constructor() {

        this.loadInfo().then(() => {

            this.initEvents();

        })

    }

    loadInfo() {
        return new Promise((resolve, reject) => {

            generalInfo.fetch((err, item)=>{
                
                if(item !== null){
                    // let's show the info

                    let quillEditors = $('.stepWrapper:nth-of-type(1) .quillEditor>div:first-of-type');
        
                    let inputs = $('.stepWrapper:nth-of-type(1) input[type=text]');

                    inputs[0].value = item.address;
                    inputs[1].value = item.tabTitle;

                    quillEditors[0].innerHTML = item.aboutUs;
                    quillEditors[1].innerHTML = item.essentials;
                    quillEditors[2].innerHTML = item.tabContent;

                }

            });
            
            resolve();
        })
    }

    initEvents() {

        // save event

        $('.stepWrapper:nth-of-type(1) .saveBtn').click(()=>{
            
            this.update();

        })

    }

    update(){

        // showing the loading

        Loading.showLoading();
        
        let quillEditors = $('.stepWrapper:nth-of-type(1) .quillEditor>div:first-of-type');
        
        let inputs = $('.stepWrapper:nth-of-type(1) input[type=text]');
        
        generalInfo.update(inputs[0].value,quillEditors[0].innerHTML,quillEditors[1].innerHTML,inputs[1].value,quillEditors[2].innerHTML,()=>{
            Loading.hideLoading();
            PropellerMessage.showMessage('تغییرات با موفقیت ذخیره شدند.','success');
        });

    }

}

new GeneralInfoManager();