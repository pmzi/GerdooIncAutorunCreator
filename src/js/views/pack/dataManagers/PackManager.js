// Models

const Pack = require('../../../models/Pack');

const Software = require('../../../models/Software');

// Utilities

const FileManager = require('../../globals/FileManager');

// NodeJS built in utilites

const path = require('path');

// Instatioating models

const pack = new Pack();

// PackManager class which handles events and data related to Packs

class PackManager {

    /**
     * Loads the packs in to the packs modal
     * @returns {Promise}
     */

    static async load() {

        return new Promise(async (resolve, reject) => {

            // Let's get the target modal

            let targetCont = $('#search-packs-modal .modal-body');

            // Let's empty it

            targetCont.empty();

            // Let's get the packs from the DB

            let packs = await pack.fetchAll();

            // Let's append packs to the target modal

            for (let singlePack of packs) {

                // If this pack is equal to current pack then continue

                if (singlePack._id === window._id) {

                    continue;

                }

                // Let's do some append works!

                targetCont.append(`<div class="checkbox">
                    <label class="pmd-checkbox">
                        <input value='${singlePack._id}' type="checkbox" class="pm-ini"><span class="pmd-checkbox-label">&nbsp;</span>
                        <span for="Ahmedabad">${singlePack.name}</span>
                    </label>
                </div>`);

            }

            // We are good to go

            resolve();

        })
    }

    /**
     * Initiates static events which are related to the Packs
     */

    static initStaticEvents() {

        // Event for the earch button of the modal

        $('#search-packs-modal .modalActionButton').click(() => {

            // Let's show the loading

            Loading.showLoading();

            // Let's get the selected packs

            let selectedPacks = $('#search-packs-modal input[type=checkbox]:checked');

            // Let's get the name of the selected software

            let name = $('#generalTab').attr('data-name');

            // Let's make an array of selected pack IDs

            let packIds = [];

            for (let singlePack of selectedPacks) {

                packIds.push($(singlePack).val());

            }

            // Now, Let's search fo the software in the selected packs

            this.searchForSoftware(name, packIds).then((properSoftware) => {

                // If any matched softwares found

                if (properSoftware) {

                    // Let's load the details of the matched software in to the current one

                    this.loadSoftware(properSoftware);

                    // Let's hide the modal and inform the user

                    $('#search-packs-modal').modal('hide');

                    PropellerMessage.showMessage('مشخصات نرم افزار مورد نظر بارگذاری شد.', 'success');

                } else {

                    // We didn't find any software matches in selected packs

                    PropellerMessage.showMessage('نرم افزاری با این مشخصات یافت نشد.', 'error');

                }

                // Let's hide the loading

                Loading.hideLoading();


            })
        })

    }

    /**
     * This method searches for software in the given packs
     * @param {String} name - The name of the software
     * @param {Array} packIds - An array of IDs of the packs which we are going to look in
     * @returns {Promise}
     */

    static async searchForSoftware(name, packIds) {

        return new Promise(async (resolve, reject) => {

            let properSoftware = null;

            // Let's search each pack

            for (let singlePackId of packIds) {

                // Let's get the info of the pack

                let packInfo = await pack.getById(singlePackId);

                // Let's load the softwares of the pack

                let newSoftware = new Software(packInfo.name);

                // Let's search for any software that matches the name of the given software

                properSoftware = await newSoftware.getByTitle(name);

                // Check whether we have any result or not

                if (properSoftware) {

                    // We have a match! Let's get out

                    break;

                }
            }

            // Let's give the matched software back

            // We are done

            resolve(properSoftware);

        });
    }

    /**
     * Loads the software details
     * @param {Object} properSoftware - Software object which it's details are going to be filled
     */

    static loadSoftware(properSoftware) {

        // Let's get the inputs, selects and quill editor boxes

        let inputs = $('.tabWrapper input:not([type=checkbox])');

        let selects = $('.tabWrapper select');

        let quills = $('.tabWrapper .quillEditor>div:first-of-type');

        let textarea = $('.tabWrapper textarea');


        // Setting the image address of the software

        // First, let's transfer the image to the current pack assets folder
        
        if (properSoftware.image !== null) {

            // Transfering image

            let imageAddress = FileManager.copyToLocale(path.join(__dirname, '../../../', properSoftware.image));

            // Setting the image address

            $('#softwareImageWrapper img').attr('src', imageAddress);

        }

        // Setting the OSes of the software

        $('.tabWrapper input:checked').attr('checked', false)
        
        for (let os of properSoftware.oses) {

            if (os.trim() != '') {

                $('.tabWrapper').find(`input[type=checkbox][value=${os}]`).prop('checked', true);

            }

        }
        // Setting the setup address of the software

        inputs[2].value = properSoftware.setup;

        // Setting the tags of the software

        let tagsCont = $('.tabWrapper .tagsCont');

        tagsCont.empty();

        for (let tag of properSoftware.tags) {

            tagsCont.append(`<a class="list-group-item" href="javascript:void(0);">${tag}</a>`);

        }

        // Setting event for removing tag on click

        $('.tagsCont>a').off('click').click(function () {

            $(this).remove();

        });

        // Setting video address of the software

        inputs[4].value = properSoftware.video;

        // Setting isRecommended of the software

        if (properSoftware.isRecommended) {

            $('#isRecommended').prop('checked', true)

        } else {

            $('#isRecommended').prop('checked', false)

        }

        // Setting faDesc of the software

        // Let's first transfer all content images into current pack's assets folder

        let faDesc = this.copyAllImagesOfText(properSoftware.faDesc);

        // Now, let's set the faDesc of the software

        quills[0].innerHTML = faDesc;

        // Setting enDesc of the software

        // Let's first transfer all content images into current pack's assets folder

        let enDesc = this.copyAllImagesOfText(properSoftware.enDesc);

        // Now, let's set the enDesc of the software

        quills[1].innerHTML = properSoftware.enDesc;

    }

    /**
     * Searches the given text for any images and transfers them to the current pack's assets folder
     * @param {String} text - The text which it is going to search in
     * @returns {String} - The modified text
     */

    static copyAllImagesOfText(text) {

        // Let's set the RegEx of the image

        const imageRegex = new RegExp(`"(\.\.\/dbs\/.+?\/assets\/.+?)(\"|")`, 'ig');

        let match;

        // Let's search for images

        while ((match = imageRegex.exec(text)) != null) {

            // An image matched

            // Let's transfer it to the current pack's assets folder

            let newAddress = FileManager.copyToLocale(path.join(__dirname, '../../../', match[1]));

            // Now, let's change the address to the new one

            text = text.replace(new RegExp(match[1], 'ig'), newAddress);

        }

        // Let's return the change text

        return text;

    }

}

// Let's load the Packs and initiate pack related events

PackManager.load().then(() => {
    PackManager.initStaticEvents();
})