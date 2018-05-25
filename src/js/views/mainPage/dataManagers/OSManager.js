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

                    target.append(`<tr>
                    <td>
                        ${i}
                    </td>
                    <td>
                        ${item.name}
                    </td>
                    <td>
                        <a class="pmd-tooltip" data-toggle="tooltip" data-placement="top" title="ویرایش" href="#" onclick="javascript:void(0)">
                            <i class="material-icons">
                                edit
                            </i>
                        </a>
                        <a class="pmd-tooltip" data-toggle="tooltip" data-placement="top" title="حذف" href="#" onclick="javascript:void(0)">
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


    }

}

new OSManager();