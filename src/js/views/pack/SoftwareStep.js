class SoftwareStep {

    // Header methods start

    static initHeaderEvents() {
        // for header buttons(search, filter by cat, filter by dvd)

        const that = this;

        $('#softwareMenu>header>div>ul>li').click(function () {
            that.changeHeaderSlide($(this).index());
        });
    }

    static changeHeaderSlide(index) {
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

    static initSoftwareSectionEvents() {

        // For slide down and slide up animation

        $('#softwares ul.softWrapper li').off('click').on('click', function (e) {
            e.stopPropagation()

            $('#softwares .active').removeClass('active');

            $(this).children('div').toggleClass('active');
            $('#softwareMenu>footer>ul>li:nth-of-type(3)').addClass('disabled');
        })

        $('#softwares ul:not(.softWrapper) li').off('click').click(function (e) {
            e.stopPropagation()

            $(this).children('ul').slideToggle(500);

            $('#softwares .active').removeClass('active');

            $(this).children('div').toggleClass('active');

            if ($(this).parent().hasClass('catWrapper')) {
                $('#softwareMenu>footer>ul>li:nth-of-type(3)').removeClass('disabled');
            } else {
                $('#softwareMenu>footer>ul>li:nth-of-type(3)').addClass('disabled');
            }

        });

    }



}

SoftwareStep.initHeaderEvents();

$('#softwares').on('reload', () => {
    SoftwareStep.initSoftwareSectionEvents();
});