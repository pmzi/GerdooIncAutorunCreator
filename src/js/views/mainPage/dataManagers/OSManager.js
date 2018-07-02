// Models

const OS = require('../../../models/OS');

// Instantiate the models

const os = new OS();

// OSManager class which handles events and data, related to OSes

class OSManager {

    /**
     * Loads the oses into the taget table
     * @returns {Promise}
     */

    static loadOSes() {

        return new Promise((resolve, reject) => {

            // Let's get the OSes from the DB

            os.fetchAll().then((OSes) => {

                // Let's select the target table

                let target = $("#OSesTable tbody");

                // Let's empty it

                target.empty();

                // Now its time to append the OSes

                let i = 1;

                OSes.forEach((item) => {

                    target.append(`<tr data-id='${item._id}'>
                    <td>
                        ${i}
                    </td>
                    <td>
                        ${item.name}
                    </td>
                    <td>
                        <a class="pmd-tooltip delete" data-toggle="tooltip" data-placement="top" title="حذف" href="#" onclick="javascript:void(0)">
                            <i class="material-icons">
                                delete
                            </i>
                        </a>
                    </td>
                </tr>`);

                    i++;

                });

                // Let's init the events on the appended OSes elements

                this.initEvents();

                // We are done

                resolve();

            });

        })
    }

    /**
     * Let's init events of the OSes elements
     */

    static initEvents() {

        // Delete event

        $('#OSesTable .delete').click(function () {

            // Let's get the if of the selected OS

            let id = $(this).parent().parent().attr('data-id');

            $('#delete-os-modal .modalActionButton').attr('data-id', id);

            // Showing the "Are You Sure" modal

            $('#delete-os-modal').modal('show');

        });

    }

    /**
     * Inits static events of the OSes seection
     */

    static initStaticEvents(){

        // Add OS event

        $('#add-os-modal .modalActionButton').off('click').click(() => {

            // Let's show the loading

            Loading.showLoading();

            // Let's add the OS to the DB

            os.add($("#add-os-modal input[type=text]").val()).then((newPack) => {

                // Let's hide the modal

                $("#add-os-modal").modal('hide');

                // Let's reload OSes so that new OS will be appeaed there

                this.loadOSes().then(() => {

                    // Let's hide the loading and inform the user

                    Loading.hideLoading();

                    PropellerMessage.showMessage('آیتم با موفقیت افزوده شد.', 'success');

                })

            })

        });

        // Delete OS event

        let that = this;

        $('#delete-os-modal .modalActionButton').click(function () {

            // Let's show the loading

            Loading.showLoading();

            // Let's delete the OS from the DB

            os.delete($(this).attr('data-id')).then(() => {

                // Let's reload OSes so that deleted OS will be disappeaed

                that.loadOSes().then(()=>{

                    // Let's hide the loading and inform the user

                    PropellerMessage.showMessage('آیتم با موفقیت حذف شد.', 'success');

                    Loading.hideLoading();

                })

            });
        });

    }

}

// Loads oses and then inits static events so that OSes section will work as expected

OSManager.loadOSes().then(()=>{
    OSManager.initStaticEvents();
})