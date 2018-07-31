const {
    dialog
} = require('electron').remote;
const FileManager = require('../globals/FileManager');

// Validator

const Validator = require('../globals/Validator');

// Step class which handles events and functionality of the page

class Step {

    /**
     * Inits general events of the page
     */

    static initEvents() {

        // For hiding loading

        window.onload = ()=>{
            Loading.hideLoading();
        }

        // Event for hiding modal and clear all inputs

        $('.modal').on('hidden.bs.modal', function () {
            $(this).find('input[type=text]').each((index, elem) => {
                elem.value = "";
            });
            $(this).find('input[type=number]').each((index, elem) => {
                elem.value = "";
            });
            $(this).find('img').each((index, elem) => {
                $(elem).attr('src', '');
            });

            // Let's clear validation's signs

            console.log("s")

            Validator.clearSigns($(this));

        });

        let that = this;

        // Change step system(sliding system of the step change)

        $('.stepCont').click(function () {

            $('#steps>div').removeClass('active')

            // let's change the step

            $('.stepWrapper.forActive').removeClass('forActive')

            $('.stepWrapper.backActive').removeClass('backActive')

            $('.stepWrapper').each((index, elem) => {

                if (index < $(this).index() / 2) {

                    $(elem).addClass('backActive');

                } else if (index > $(this).index() / 2) {

                    $(elem).addClass('forActive');

                }
            })

            $('#steps>div').each((index, elem) => {

                if (index <= $(this).index()) {
                    $(elem).addClass('active')
                }

            })
        })

    }

    /**
     * Inits the add tag system
     */

    static initializeTagAddSystem() {

        // Listens on the click event of the addModalButton

        $('.addTagModalBtn').click(function () {

            // Let's show the add tag modal

            $('#add-tag-modal').modal('show');

            // Listens on the add tag button of the modal

            $('#add-tag-modal .modalActionButton').off('click').click(() => {

                // Let's get the tagName

                let tagName = $('#add-tag-modal input[type=text]').val();

                // Let's append it to the list of tags

                $(this).parent().prev().append(`<a class="list-group-item" href="javascript:void(0);">${tagName}</a>`);

                // Setting listener for removing tags on click

                $('.tagsCont>a').off('click').click(function () {

                    $(this).remove();

                });

                // Let's hide the modal

                $('#add-tag-modal').modal('hide');

            });
        });
    }

    /**
     * Inits the dialog button and input system
     */

    static initializeDialogSystem() {

        $('.dialogBtn').click(function () {

            // Let's get the alowed extenstions

            let exts = $(this).attr('data-exts').split(',');

            // Let's get the name

            let name = $(this).attr('data-name');

            // Let's get the properties of the dialog

            let props = $(this).attr('data-props').split(',');

            // Let's show the dialog

            let address = dialog.showOpenDialog({
                properties: props,
                filters: [{
                    name,
                    extensions: exts
                }]
            });

            // Check whether user selected any or not

            if (address) {

                address = address[0];

                // Let's get the input which the dialog is linked to

                let dataFor = $(this).attr('data-for');

                let forElem = $(`[data-this=${dataFor}]`);

                // Let's distinguish image inputs from reqular inputs

                switch (forElem.prop('tagName').toLowerCase()) {

                    case "input":

                        // Setting the value of the input to the address that user selected

                        forElem.val(address);

                        break;

                    case "img":

                        // Copy image to the assets folder of the current pack

                        address = FileManager.copyToLocale(address);

                        // Let's set the image as src of the image

                        forElem.attr('src', address);

                        break;
                }

            }
        });

    }

}

// Let's initate events and other systems

Step.initEvents();

Step.initializeTagAddSystem();

Step.initializeDialogSystem();