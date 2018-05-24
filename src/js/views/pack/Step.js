class Step {

    constructor() {

        this.initEvents();

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

}

new Step();