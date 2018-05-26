const {dialog} = require('electron').remote;
const FileManager = require('../globals/FileManager');

class Step {

    constructor() {

        this.initEvents();

        this.initializeTagAddSystem();

        this.initializeDialogSystem();

    }

    initEvents() {

        let that = this; // some stupid action...

        // Header click change color and change steps

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
     * For add tag systems
     */

    initializeTagAddSystem(){
        $('.tagsCont>a').click(function(){
            $(this).remove();
        });
        $('.addTagModalBtn').click(function(){
            $('#add-tag-modal').modal('show');
            $('#add-tag-modal .modalActionButton').off('click').click(()=>{
                let tagName = $('#add-tag-modal input[type=text]').val();
                $(this).parent().prev().append(`<a class="list-group-item" href="javascript:void(0);">${tagName}</a>`);
                $('#add-tag-modal').modal('hide');
            });
        });
    }

    initializeDialogSystem(){

        $('.dialogBtn').click(function(){
            
            let exts = $(this).attr('data-exts').split(',');

            let name = $(this).attr('data-name');

            let props = $(this).attr('data-props').split(',');

            let address = dialog.showOpenDialog({
                properties: props,
                filters: [{
                    name,
                    extensions: exts
                }]
            });
            if(address){

                address = address[0];

                let dataFor = $(this).attr('data-for');
                let forElem = $(`[data-this=${dataFor}]`);

                switch(forElem.prop('tagName').toLowerCase()){
                    case "input":
                    forElem.val(address);
                    break;
                    case "img":

                    // copy it to locale

                    address = FileManager.copyToLocale(address);
                    
                    forElem.attr('src',address);
                    break;
                }

            }
        });

    }

}

new Step();