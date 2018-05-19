const {remote, ipcRenderer} = require('electron');

// For menu actions

class MainMenu{
    constructor(){

        $(()=>{
            setTimeout(()=>{
                ipcRenderer.send('newWindow','');
            },2000)
            

            this.initMainMenuEvents();
        })

    }

    initMainMenuEvents(){

        let that = this;// some stupid action...

        $('#mainMenu>ul>li:not(:last-of-type)').click(function(){

            that.showTab($(this).index());

            $("#mainMenu>ul>li.active").removeClass('active');

            $(this).addClass('active');

        });

        $('#mainMenu>ul>li:last-of-type').click(()=>{
            this.exitProgram();
        })

    }

    showTab(index){
        $('.tabWrapper.showTab').removeClass('showTab');
        $(".tabWrapper").eq(index).addClass('showTab');
    }

    exitProgram(){
        remote.getCurrentWindow().close();
    }

}

new MainMenu();