class SoftwareStep {

    constructor() {
        this.initHeaderEvents();

        $('#softwares').on('reload',()=>{
            this.initSoftwareSectionEvents();
        });
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

        // For slide down and slide up animation

        $('#softwares ul:not(.softWrapper) li').off('click').click(function (e) {
            e.stopPropagation()

            let targetUl = $(this).children('ul');

            if(targetUl.css('height') == '0px'){
                let liChilds = targetUl.children('li').length;

            targetUl.css({'height':(liChilds*30)+'px'});
            }else{
                targetUl.css({'height':'0px'});
            }
            
            

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