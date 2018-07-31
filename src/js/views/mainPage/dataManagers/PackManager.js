// Electron's utilites

const {
    ipcRenderer
} = require('electron');
const {dialog} = require('electron').remote;

const Validator = require('../../globals/Validator');

// NodeJS built-in utilites

const fs = require('fs');

const path = require('path');

// Packages

const excel = require('node-excel-export');

const h2p = require('html2plaintext');

// Models

const Software = require('../../../models/Software');

const PackOS = require('../../../models/PackOS');

const Cat = require('../../../models/Cat');

// Getting refrence to DB

const pack = window.dbs.pack

// PackManager class which handles events and data, related to Packs

class PackManager {

    /**
     * Loads the packs into the target table
     * @returns {Promise}
     */

    static loadPacks() {

        return new Promise((resolve, reject) => {

            // Let's get all packs from the DB

            pack.fetchAll().then((packs) => {

                // Let's get the desired table

                let target = $("#packsTable tbody");

                // Making it empty

                target.empty();

                // Let's append packs to the table

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

                // Let's init events on the newly added packs elements

                this.initEvents();

                // We are done :-)

                resolve();

            });

        })
    }

    /**
     * Inits events on the packs <tr> elements
     */

    static initEvents() {

        // Delete pack event

        $('#packsTable .delete').off('click').click(function () {

            // Let's get the id of the selected pack

            let id = $(this).parent().parent().attr('data-id');

            $('#delete-pack-modal .modalActionButton').attr('data-id', id);

            // Let's show the "Are You Sure" modal
            
            $('#delete-pack-modal').modal('show');

        });

        // Edit pack event

        $('#packsTable .edit').off('click').click(function () {

            // Let's get the id of the selected pack

            let id = $(this).parent().parent().attr('data-id');

            // Let's get the details of the selected pack from the DB

            pack.getById(id).then((packForEdit) => {

                // Let's open the edit pack window

                that.showPackDetailsWindow(id, packForEdit.name);

            })

        });

        // Export excell event

        let that =  this;

        $('#packsTable .excel').off('click').click(function () {

            // Let's show the loading

            Loading.showLoading();

            // Let's get the id of the selectd pack

            let id = $(this).parent().parent().attr('data-id');

            // Let's get the address for exporting the excel from the user
            
            let address = dialog.showOpenDialog({
                properties: ['openDirectory']
            })

            // Check whether user selected any addresses or not
            
            if(address && address !== null){

                // Let's export the excel
                
                that.exportExcell(id, address).then(()=>{

                    // Let's hide the loading and inform the user

                    Loading.hideLoading();

                    PropellerMessage.showMessage('اطلاعت در داخل اکسل اکسپورت شدند.','success');

                })

            }else{
                Loading.hideLoading();
            }

        });

    }

    /**
     * Inits static events which re realted to the packs section
     */

    static initStaticEvents() {

        // Add pack event

        $('#add-pack-modal .modalActionButton').off('click').click(() => {

            // Let's validate it

            if(Validator.validate($("#add-pack-modal"))){
                Loading.hideLoading();
                PropellerMessage.showMessage('بعضی از فیلدها فاقد اعتبارند.','error');
                return;
            }

            // Let's show the loading

            Loading.showLoading();

            // Let's add the pack to the DB

            pack.add($("#add-pack-modal input[type=text]").val()).then((newPack) => {

                // Let's make the DB and assets folder and copy default OSes in them

                this.copyAssets(newPack.name);

                // Let's hide the modal

                $("#add-pack-modal").modal('hide');

                // Let's reload the packs so that newly added pack will be appeared there

                this.loadPacks().then(() => {

                    // Let's init events for the new pack

                    this.initEvents();

                    // Let's hide the loading and inform the user

                    Loading.hideLoading();

                    PropellerMessage.showMessage('آیتم با موفقیت افزوده شد.', 'success');

                })

                // Let's open the pack details window

                this.showPackDetailsWindow(newPack._id, newPack.name);

            })

        });

        // Delete pack event

        let that = this;

        $('#delete-pack-modal .modalActionButton').click(function () {

            // Let's show the loading

            Loading.showLoading();

            // Let's delete the selected pack from the DB

            pack.delete($(this).attr('data-id')).then(() => {

                // Let's reload the packs so that deleted pack will be disappeared

                that.loadPacks();

                // Let's hide the loading inform the user

                Loading.hideLoading();

                PropellerMessage.showMessage('آیتم با موفقیت حذف شد.', 'success');

            })

        });

    }

    /**
     * Makes the DB and assets folder and copies default OSes in them
     * @param {String} name - The name of the pack
     */

    static copyAssets(name) {

        // Let's create the pack directory

        let pathToPack = path.join(__dirname, '../../../../dbs', name);

        fs.mkdirSync(pathToPack);

        // Let's create the assets dir

        fs.mkdirSync(path.join(pathToPack, 'assets'));

        // Let's copy the OSes DB

        fs.copyFileSync(path.join(pathToPack, '../', 'OSes.db'), pathToPack + '/OSes.db');

    }

    /**
     * Opens details window for the pack
     * @param {String} id - The id of the targeted pack
     * @param {String} name - The name of the pack
     */

    static showPackDetailsWindow(id, name) {
        
        ipcRenderer.send('newWindow', {
            width: 1300,
            height: 650,
            modal: true,
            fullscreen: true,
            parent: 'main',
            view: `addPack.html?id=${id}&name=${name}`
        });

    }

    /**
     * Exports excell containing information about the pack's content
     * @returns {Promise}
     */

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

            // Export specification

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

            // Let's fill the dataset

            let packInfo = await pack.getById(packId);
            
            let software = new Software(packInfo.name);

            let softwares = await software.fetchAll();
            
            for(let soft of softwares){

                let packOS = new PackOS(packInfo.name)

                let oses = [];

                // Let's convert id to os name

                for(let osId of soft.oses){

                    let osInfo = await packOS.getById(osId);

                    oses.push(osInfo.name)

                }

                let cat = new Cat(packInfo.name);

                // Let's convert cat id to cat name

                let catInfo = await cat.getById(soft.cat)

                // Let's fill to temp

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

                // Let's push to dataset

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

            // Let's write report to the xlsx file

            fs.writeFileSync(`${address}/${packInfo.name}.xlsx`, report)

            // We are done

            resolve();

        })

    }

}

// Let's load packs and init their events so that packs section will work as expected

PackManager.loadPacks().then(() => {

    PackManager.initStaticEvents();

    // Hide the first loading

    Loading.hideLoading();

})