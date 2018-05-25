const OS = require('../../../models/OS');

class OSManager{

    constructor() {

        this.loadOSes().then(() => {

            this.initEvents();

        })

    }

    loadOSes() {
        return new Promise((resolve, reject) => {

            OS.fetchAll((err, OSes) => {

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

                resolve();

            });

        })
    }

    initEvents() {

        // add events

        $('#add-os-modal .modalActionButton').off('click').click(() => {

            OS.add($("#add-os-modal input[type=text]").val(), (err, newPack) => {

                $("#add-os-modal").modal('hide');

                this.loadOSes().then(()=>{
                    this.initEvents();
                })

            })

        });

        // delete events


        let that = this;

        $('#OSesTable .delete').click(function () {
            let id = $(this).parent().parent().attr('data-id');
            $('#delete-os-modal .modalActionButton').attr('data-id', id);
            $('#delete-os-modal').modal('show');
        });

        $('#delete-os-modal .modalActionButton').click(function () {
            that.deleteOS($(this).attr('data-id'));
        });

    }

    deleteOS(id){

        OS.delete(id,()=>{
            this.loadOSes();
        });

    }

}

new OSManager();