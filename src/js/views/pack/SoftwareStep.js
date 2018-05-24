class SoftwareStep {

    constructor() {
        this.initHeaderEvents();

        this.initSoftwareSectionEvents();
    }

    // Header methods start

    initHeaderEvents() {
        // for header buttons(search, filter by cat, filter by dvd)

        const that = this;

        $('#softwareMenu>header>div>ul>li').click(function () {
            that.changeHeaderSlide($(this).index());
        });
    }

    search() {

    }

    changeHeaderSlide(index) {
        $('#softHeaderSliderWrapper .slideWrapper.forSlide').removeClass('forSlide');
        $('#softHeaderSliderWrapper .slideWrapper.backSlide').removeClass('backSlide');

        $('#softHeaderSliderWrapper .slideWrapper').each((i, elem) => {
            if (i < index) {
                $(elem).addClass('backSlide');
            } else if (i > index) {
                $(elem).addClass('forSlide');
            }
        });
    }

    // Header methods finish

    // Soft list methods

    initSoftwareSectionEvents() {
        $('#softwares ul:not(.softWrapper) li').click(function (e) {
            e.stopPropagation()
            
            $(this).children('ul').slideToggle(500);

            $('#softwares .active').removeClass('active');

            $(this).children('div').toggleClass('active');

            if($(this).parent().hasClass('catWrapper')){
                $('#softwareMenu>footer>ul>li:nth-of-type(3)').removeClass('disabled');
            }else{
                $('#softwareMenu>footer>ul>li:nth-of-type(3)').addClass('disabled');
            }

        });
    }

}

new SoftwareStep();