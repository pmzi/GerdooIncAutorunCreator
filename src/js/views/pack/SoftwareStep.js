// SoftwareStep class which handles events and functionality related to the second tabWrapper(Software tab)

class SoftwareStep {

    /**
     * Initis the events which are related to the header sliding system
     */

    static initHeaderEvents() {

        // For making the sliding system of the header

        const that = this;

        $('#softwareMenu>header>div>ul>li').click(function () {

            // Let's change the slide

            that.changeHeaderSlide($(this).index());

        });
    }

    /**
     * Changes the slide
     */

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

    /**
     * Inits toggling system of the software menu(Toggle down and toggle up)
     */

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

    /**
     * Inits static events of the software tab
     */

    static initStaticEvents(){

        // For removing software image from the software details section

        $('#softwareImageWrapper>div>button:last-of-type').click(()=>{

            $('#softwareImageWrapper>img').attr('src','');

        });

    }


}

// Let's init events of the software tab

SoftwareStep.initHeaderEvents();

SoftwareStep.initStaticEvents();

// Listens on the #softwares for reload event

$('#softwares').on('reload', () => {

    SoftwareStep.initSoftwareSectionEvents();

});