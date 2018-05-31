const OS = require('../../../models/OS');

//

const os = new OS();

//

class OSManager {

    constructor() {

        this.loadOSes().then(()=>{
            this.initStaticEvents();
        })

    }

    loadOSes() {
        return new Promise((resolve, reject) => {

            os.fetchAll().then((OSes) => {

                let target = $("#OSesTable tbody")

                target.empty();

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

                this.initEvents();

                resolve();

            });

        })
    }

    initEvents() {

        // delete events

        $('#OSesTable .delete').click(function () {
            let id = $(this).parent().parent().attr('data-id');
            $('#delete-os-modal .modalActionButton').attr('data-id', id);
            $('#delete-os-modal').modal('show');
        });

    }

    initStaticEvents(){

        // add events

        $('#add-os-modal .modalActionButton').off('click').click(() => {

            Loading.showLoading();

            os.add($("#add-os-modal input[type=text]").val()).then((newPack) => {

                $("#add-os-modal").modal('hide');

                this.loadOSes().then(() => {

                    PropellerMessage.showMessage('آیتم با موفقیت افزوده شد.', 'success');
                    Loading.hideLoading();

                })

            })

        });

        // delete events

        let that = this;

        $('#delete-os-modal .modalActionButton').click(function () {

            Loading.showLoading();

            os.delete($(this).attr('data-id')).then(() => {
                that.loadOSes();
                PropellerMessage.showMessage('آیتم با موفقیت حذف شد.', 'success');
                Loading.hideLoading();
            });
        });

    }

}

new OSManager();