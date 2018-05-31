const Pack = require('../../../models/Pack');
const Software = require('../../../models/Software');
const FileManager = require('../../globals/FileManager');
const path = require('path');
//

const pack = new Pack();

//

class PackManager {

    constructor() {

        this.load().then(() => {
            this.initStaticEvents();
        })

    }

    async load() {
        return new Promise(async (resolve, reject) => {
            let targetCont = $('#search-packs-modal .modal-body');
            targetCont.empty();
            let packs = await pack.fetchAll();
            for (let singlePack of packs) {
                if (singlePack._id === window._id) {
                    continue;
                }
                targetCont.append(`<div class="checkbox">
                <label class="pmd-checkbox">
                    <input value='${singlePack._id}' type="checkbox" class="pm-ini"><span class="pmd-checkbox-label">&nbsp;</span>
                    <span for="Ahmedabad">${singlePack.name}</span>
                </label>
            </div>`);
            }

            resolve();
        })
    }


    initStaticEvents() {

        $('#search-packs-modal .modalActionButton').click(() => {

            Loading.showLoading();

            let selectedPacks = $('#search-packs-modal input[type=checkbox]:checked');
            let name = $('#generalTab').attr('data-name');
            let packIds = [];
            for (let singlePack of selectedPacks) {
                packIds.push($(singlePack).val());
            }
            this.searchForSoftware(name, packIds).then((properSoftware) => {
                if (properSoftware) {

                    // Let's load the software

                    let inputs = $('.tabWrapper input:not([type=checkbox])');
                    let selects = $('.tabWrapper select');
                    let quills = $('.tabWrapper .quillEditor>div:first-of-type');

                    let textarea = $('.tabWrapper textarea');


                    // setting the image address
                    // let's first transfer the image
                    if (properSoftware.image !== null) {
                        let imageAddress = FileManager.copyToLocale(path.join(__dirname, '../../../', properSoftware.image));
                        $('#softwareImageWrapper img').attr('src', imageAddress);
                    }
                    // setting the oses
                    $('.tabWrapper input:checked').attr('checked', false)
                    console.log(properSoftware)
                    for (let os of properSoftware.oses) {
                        if (os.trim() != '') {
                            $('.tabWrapper').find(`input[type=checkbox][value=${os}]`).prop('checked', true);
                        }
                    }
                    // setting the setup
                    inputs[2].value = properSoftware.setup;
                    // setting the tags
                    let tagsCont = $('.tabWrapper .tagsCont');
                    tagsCont.empty();
                    for (let tag of properSoftware.tags) {
                        tagsCont.append(`<a class="list-group-item" href="javascript:void(0);">${tag}</a>`);
                    }
                    $('.tagsCont>a').off('click').click(function () {
                        $(this).remove();
                    });
                    // setting web address
                    inputs[4].value = properSoftware.webAddress;
                    // setting isRecommended
                    if (properSoftware.isRecommended) {
                        $('#isRecommended').prop('checked', true)
                    } else {
                        $('#isRecommended').prop('checked', false)
                    }
                    // set faDesc
                    quills[0].innerHTML = properSoftware.faDesc;
                    // setting en desc
                    quills[1].innerHTML = properSoftware.enDesc;
                    console.log(properSoftware)
                    // hiding the modal

                    $('#search-packs-modal').modal('hide');

                    PropellerMessage.showMessage('مشخصات نرم افزار مورد نظر بارگذاری شد.','success');

                }else{
                    PropellerMessage.showMessage('نرم افزاری با این مشخصات یافت نشد.','error');
                }

                Loading.hideLoading();
                

            })
        })

    }

    async searchForSoftware(name, packIds) {
        return new Promise(async (resolve, reject) => {
            let properSoftware = null;
            for (let singlePackId of packIds) {
                let packInfo = await pack.getById(singlePackId);
                let newSoftware = new Software(packInfo.name);
                properSoftware = await newSoftware.getByTitle(name);
                console.log(properSoftware,packInfo)
                if (properSoftware) {
                    break;
                }
            }
            resolve(properSoftware);
        });
    }

}

new PackManager();