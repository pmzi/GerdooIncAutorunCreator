const PackOS = require('../../../models/PackOS');

//

const packOS = new PackOS();

//

class OSesManager {

    static load() {
        return new Promise((resolve, reject) => {
            $('#osList').empty();

            packOS.fetchAll().then((result) => {

                for (let item of result) {
                    $('#osList').append(`<div class="checkbox pmd-default-theme">
                    <label class="pmd-checkbox pmd-checkbox-ripple-effect">
                        <input type="checkbox" value="${item._id}">
                        <span>${item.name}</span>
                    </label>
                </div>`);
                }

                resolve();

            })
        })


    }

    static initEvents() {

        // Event for delete OS

        

    }

    static initStaticEvents(){

        // Event for add os modal

        $('#add-os-modal .modalActionButton').click(()=>{
            let osTitle = $('#add-os-modal input').val();
            Loading.showLoading();
            packOS.add(osTitle).then(()=>{
                this.load().then(()=>{
                    this.initEvents();
                    Loading.hideLoading();
                    PropellerMessage.showMessage('تغییرات با موفقیت ذخیره شدند.','success');
                })
                $('#add-os-modal').modal('hide');
            })
        });

    }

}

OSesManager.load().then(() => {

    OSesManager.initEvents();

    OSesManager.initStaticEvents();

})