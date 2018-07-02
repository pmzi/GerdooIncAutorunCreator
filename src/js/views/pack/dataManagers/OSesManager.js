// Models

const PackOS = require('../../../models/PackOS');

// Models instantiate

const packOS = new PackOS();

// OSesManager class which handles events and data related to OSes

class OSesManager {

    /**
     * Loads the OSes -> title and ID
     * @returns {Promise}
     */

    static load() {
        
        return new Promise((resolve, reject) => {

            // Let's empty the osList

            $('#osList').empty();

            // Let's fetchAll oses from the database

            packOS.fetchAll().then((result) => {

                // Let's append them to osList

                for (let item of result) {
                    $('#osList').append(`<div class="checkbox pmd-default-theme">
                    <label class="pmd-checkbox pmd-checkbox-ripple-effect">
                        <input type="checkbox" value="${item._id}">
                        <span>${item.name}</span>
                    </label>
                </div>`);
                }

                // We are done

                resolve();

            })
        })


    }

    /**
     * Initializes the static events related to OSes
     */

    static initStaticEvents(){

        // Event for add os modal

        $('#add-os-modal .modalActionButton').click(()=>{

            // Let's retreive the osTitle

            let osTitle = $('#add-os-modal input').val();

            // Let's show the loading

            Loading.showLoading();

            // Let's add it to the DB

            packOS.add(osTitle).then(()=>{

                // Let's reload all the osLists

                this.load().then(()=>{

                    // Let's readd events for the OSes so that new OS will have it

                    this.initEvents();

                    // Let's hide the loading

                    Loading.hideLoading();

                    PropellerMessage.showMessage('تغییرات با موفقیت ذخیره شدند.','success');

                })

                // Let's hide the modal

                $('#add-os-modal').modal('hide');

            })
        });

    }

    /**
     * Inits dynamic events
     */

    static initEvents(){

    }

}

// Let's load info and init static events

OSesManager.load().then(() => {

    OSesManager.initStaticEvents();

})