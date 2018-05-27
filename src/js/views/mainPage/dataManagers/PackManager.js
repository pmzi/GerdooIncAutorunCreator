const {
    ipcRenderer
} = require('electron');
const fs = require('fs');
const path = require('path');
const pack = require('../../../models/Pack');

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

                    target.append(`<tr data-id='${item._id}'>
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
                        <a class="pmd-tooltip excel" data-toggle="tooltip" data-placement="top" title="خروجی اکسل" href="#" onclick="javascript:void(0)">
                            <i class="material-icons">
                                cloud_download
                            </i>
                        </a>
                        <a class="pmd-tooltip edit" data-toggle="tooltip" data-placement="top" title="ویرایش" href="#" onclick="javascript:void(0)">
                            <i class="material-icons">
                                edit
                            </i>
                        </a>
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

        $('#add-pack-modal .modalActionButton').off('click').click(() => {

            pack.add($("#add-pack-modal input[type=text]").val(), (err, newPack) => {

                this.copyAssets(newPack.name);

                $("#add-pack-modal").modal('hide');

                this.loadPacks().then(() => {
                    this.initEvents();
                })

                this.addPack(newPack._id, newPack.name);

            })

        });

        // Delete pack event

        let that = this;

        $('#packsTable .delete').click(function () {
            let id = $(this).parent().parent().attr('data-id');
            $('#delete-pack-modal .modalActionButton').attr('data-id', id);
            $('#delete-pack-modal').modal('show');
        });

        $('#delete-pack-modal .modalActionButton').click(function () {
            that.deletePack($(this).attr('data-id'));
        });

    }

    deletePack(id) {

        pack.delete(id,()=>{
            this.loadPacks();
        });

    }

    copyAssets(name){

        // Let's create the pack directory
        let pathToPack = path.join(__dirname,'../../../../dbs',name);
        console.log(pathToPack)
        fs.mkdirSync(pathToPack);

        // let's create the assets dir

        fs.mkdirSync(path.join(pathToPack,'assets'));
        
        // let's copy the oses
        
        fs.copyFileSync(path.join(pathToPack, '../', 'OSes.db'), pathToPack+'/OSes.db');


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