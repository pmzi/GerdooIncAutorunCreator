const {
    ipcRenderer
} = require('electron');
const {dialog} = require('electron').remote;
const fs = require('fs');
const path = require('path');

// packages

const excel = require('node-excel-export');
const h2p = require('html2plaintext');

// models

const Pack = require('../../../models/Pack');
const Software = require('../../../models/Software');
const PackOS = require('../../../models/PackOS');
const Cat = require('../../../models/Cat');
//

const pack = new Pack();

//

class PackManager {

    static loadPacks() {
        return new Promise((resolve, reject) => {

            pack.fetchAll().then((packs) => {

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

                this.initEvents();

                resolve();

            });

        })
    }

    static initEvents() {

        // Delete pack event

        $('#packsTable .delete').off('click').click(function () {
            let id = $(this).parent().parent().attr('data-id');
            $('#delete-pack-modal .modalActionButton').attr('data-id', id);
            $('#delete-pack-modal').modal('show');
        });

        // edit pack event

        $('#packsTable .edit').off('click').click(function () {
            let id = $(this).parent().parent().attr('data-id');
            pack.getById(id).then((packForEdit) => {
                that.addPack(id, packForEdit.name);
            })

        });

        // export excell

        let that =  this;

        $('#packsTable .excel').off('click').click(function () {

            Loading.showLoading();

            let id = $(this).parent().parent().attr('data-id');
            let address = dialog.showOpenDialog({
                properties: ['openDirectory']
            })
            if(address){
                that.exportExcell(id, address).then(()=>{
                    Loading.hideLoading();
                    PropellerMessage.showMessage('اطلاعت در داخل اکسل اکسپورت شدند.','success');
                })
            }
            

        });

    }

    static initStaticEvents() {

        // add events

        $('#add-pack-modal .modalActionButton').off('click').click(() => {

            Loading.showLoading();

            pack.add($("#add-pack-modal input[type=text]").val()).then((newPack) => {

                this.copyAssets(newPack.name);

                $("#add-pack-modal").modal('hide');

                this.loadPacks().then(() => {
                    this.initEvents();

                    PropellerMessage.showMessage('آیتم با موفقیت افزوده شد.', 'success');
                    Loading.hideLoading();
                })

                this.addPack(newPack._id, newPack.name);

            })

        });

        // delete event

        let that = this;

        $('#delete-pack-modal .modalActionButton').click(function () {

            Loading.showLoading();

            pack.delete($(this).attr('data-id')).then(() => {
                that.loadPacks();
                PropellerMessage.showMessage('آیتم با موفقیت حذف شد.', 'success');
                Loading.hideLoading();
            })



        });

    }

    static copyAssets(name) {

        // Let's create the pack directory
        let pathToPack = path.join(__dirname, '../../../../dbs', name);

        fs.mkdirSync(pathToPack);

        // let's create the assets dir

        fs.mkdirSync(path.join(pathToPack, 'assets'));

        // let's copy the oses

        fs.copyFileSync(path.join(pathToPack, '../', 'OSes.db'), pathToPack + '/OSes.db');


    }


    static addPack(id, name) {
        ipcRenderer.send('newWindow', {
            width: 1300,
            height: 650,
            modal: true,
            fullscreen: true,
            parent: 'main',
            view: `addPack.html?id=${id}&name=${name}`
        });
    }

    static async exportExcell(packId, address) {
        return new Promise(async (resolve, reject) => {

            const styles = {
                headerDark: {
                    fill: {
                        fgColor: {
                            rgb: 'FF000000'
                        }
                    },
                    font: {
                        color: {
                            rgb: 'FFFFFFFF'
                        },
                        sz: 14,
                        bold: true
                    }
                }
            };
            // export specification
            const specification = {
                title: {
                    displayName: 'Title',
                    headerStyle: styles.headerDark,
                    width: 220
                },
                version: {
                    displayName: 'Version',
                    headerStyle: styles.headerDark,
                    width: 100
                },
                diskNumber: {
                    displayName: 'disk',
                    headerStyle: styles.headerDark,
                    width: 30
                },
                cat: {
                    displayName: 'Category',
                    headerStyle: styles.headerDark,
                    width: 220
                },
                faDesc: {
                    displayName: 'Persian Description',
                    headerStyle: styles.headerDark,
                    width: 500
                },
                enDesc: {
                    displayName: 'English Description',
                    headerStyle: styles.headerDark,
                    width: 500
                },
                faGuide: {
                    displayName: 'Persian Installation Guide',
                    headerStyle: styles.headerDark,
                    width: 500
                },
                enGuide: {
                    displayName: 'English Installation Guide',
                    headerStyle: styles.headerDark,
                    width: 500
                },
                oses: {
                    displayName: 'Supported OSes',
                    headerStyle: styles.headerDark,
                    width: 150
                }
            }
            const dataset = []

            // let's fill the dataset

            let packInfo = await pack.getById(packId);
            
            let software = new Software(packInfo.name);

            let softwares = await software.fetchAll();
            
            for(let soft of softwares){

                let packOS = new PackOS(packInfo.name)

                let oses = [];

                // let's convert id to os name

                for(let osId of soft.oses){

                    let osInfo = await packOS.getById(osId);

                    oses.push(osInfo.name)

                }

                let cat = new Cat(packInfo.name);

                // let's convert cat id to cat name

                let catInfo = await cat.getById(soft.cat)

                // let's fill to temp
                let temp = {
                    title: soft.title,
                    version: soft.version,
                    diskNumber: soft.DVDNumber,
                    cat: catInfo.title,
                    faDesc: h2p(soft.faDesc),
                    enDesc: h2p(soft.enDesc),
                    faGuide: h2p(soft.faGuide),
                    enGuide: h2p(soft.enGuide),
                    oses
                };

                // let's push to dataset
                dataset.push(temp)
            }

            const report = excel.buildExport(
                [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                    {
                        name: 'Report', // <- Specify sheet name (optional)
                        heading: [], // <- Raw heading array (optional)
                        merges: [], // <- Merge cell ranges
                        specification: specification, // <- Report specification
                        data: dataset // <-- Report data
                    }
                ]
            );

            // let's write report to the xlsx file

            fs.writeFileSync(`${address}/${packInfo.name}.xlsx`, report)

            // we are done

            resolve();

        })

    }

}

PackManager.loadPacks().then(() => {

    PackManager.initStaticEvents();

    // hide the main and first loading

    Loading.hideLoading();

})