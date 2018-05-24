const {
    ipcRenderer
} = require('electron');
const pack = require('../../models/Pack');

class PackManager {

    constructor() {

        this.loadPacks().then(() => {

            this.initEvents();

        })

    }

    loadPacks() {
        return new Promise((resolve, reject) => {

            pack.fetchAll((err, packs) => {

                let target = $("#packsTable tbody")

                target.empty();

                let i = 1;

                packs.forEach((item) => {

                    target.append(`<tr>
                    <td>
                        ${i}
                    </td>
                    <td>
                        ${item.name}
                    </td>
                    <td>
                        ${item.createdAt}
                    </td>
                    <td>
                        ${item.updatedAt}
                    </td>
                    <td>
                        <a class="pmd-tooltip" data-toggle="tooltip" data-placement="top" title="خروجی اکسل" href="#" onclick="javascript:void(0)">
                            <i class="material-icons">
                                cloud_download
                            </i>
                        </a>
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

        $('#add-pack-modal .modalActionButton').off('click').click(() => {

            pack.add($("#add-pack-modal input[type=text]").val(), (err, newPack) => {

                $("#add-pack-modal").modal('hide');

                this.addPack(newPack._id, newPack.name);

            })

        });

        // edit events

        // delete events


    }

    addPack(id, name) {
        ipcRenderer.send('newWindow', {
            width: 1300,
            height: 650,
            modal: true,
            fullscreen: true,
            parent: 'main',
            view: `addPack.html?id=${id}&name=${name}`
        });
    }

}

new PackManager();