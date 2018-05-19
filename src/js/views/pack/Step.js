class Step{

    constructor(){

        this.initEvents();

    }

    initEvents(){

        let that = this;// some stupid action...

        $('.stepCont').click(function(){

            $('#steps>div').removeClass('active')

            $('#steps>div').each((index,elem)=>{

                if(index <= $(this).index()){
                    $(elem).addClass('active')
                }

            })
        })
    }

}

new Step();