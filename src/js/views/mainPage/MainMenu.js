const {
    remote
} = require('electron');

// For menu actions

class MainMenu {
    constructor() {

        $(() => {
            this.initMainMenuEvents();
        })

    }

    initMainMenuEvents() {

        // event for hiding modal and clear all inputs

        $('.modal').on('hidden.bs.modal', function () {
            $(this).find('input[type=text]').each((index, elem) => {
                elem.value = "";
            });
            $(this).find('img').each((index, elem) => {
                $(elem).attr('src', '');
            });
        });

        let that = this; // some stupid action...

        $('#mainMenu>ul>li:not(:last-of-type)').click(function () {

            that.showTab($(this).index());

            $("#mainMenu>ul>li.active").removeClass('active');

            $(this).addClass('active');

        });

        $('#mainMenu>ul>li:last-of-type').click(() => {
            this.exitProgram();
        })

    }

    showTab(index) {
        $('.tabWrapper.showTab').removeClass('showTab');
        $(".tabWrapper").eq(index).addClass('showTab');
    }

    exitProgram() {
        remote.getCurrentWindow().close();
    }

}

new MainMenu();