class SoftwareStep{

    constructor(){

        this.initHeaderEvents();

    }

    // Header methods start

    initHeaderEvents(){

        // for header buttons(search, filter by cat, filter by dvd)

        let that = this;

        $('#softwareMenu>header>div>ul>li').click(function(){
            
            that.changeHeaderSlide($(this).index());

        });

    }

    search(){

    }

    changeHeaderSlide(index){

        $('#softHeaderSliderWrapper .slideWrapper.forSlide').removeClass('forSlide');
        $('#softHeaderSliderWrapper .slideWrapper.backSlide').removeClass('backSlide');

        $('#softHeaderSliderWrapper .slideWrapper').each((i,elem)=>{
            if(i<index){
                $(elem).addClass('backSlide');
            }else if(i > index){
                $(elem).addClass('forSlide');   
            }
        })

    }

    // Header methods finish

}

new SoftwareStep();