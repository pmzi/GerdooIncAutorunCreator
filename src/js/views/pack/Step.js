class Step {

    constructor() {

        this.initEvents();

        this.initializeTagAddSystem();

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

}

new Step();