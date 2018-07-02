// Electron's utilites

const {
    remote
} = require('electron');

// MainMenu class which handles events and functionality of the aside

class MainMenu {

    /**
     * Inits events of the main menu
     */

    static initMainMenuEvents() {

        // Event for clearing all inputs

        $('.modal').on('hidden.bs.modal', function () {
            $(this).find('input[type=text]').each((index, elem) => {
                elem.value = "";
            });
            $(this).find('img').each((index, elem) => {
                $(elem).attr('src', '');
            });
        });

        // Event for showing new tab and hiding previous tab

        let that = this;

        $('#mainMenu>ul>li:not(:last-of-type)').click(function () {

            // Let's show the tab

            that.showTab($(this).index());

            // Let's hide the prev tab

            $("#mainMenu>ul>li.active").removeClass('active');

            $(this).addClass('active');

        });

        // Event for exiting the program

        $('#mainMenu>ul>li:last-of-type').click(() => {
            this.exitProgram();
        })

    }

    /**
     * For showing a new tab
     * @param {Number} index - The index of the tab that is going to be opened
     */

    static showTab(index) {

        $('.tabWrapper.showTab').removeClass('showTab');

        $(".tabWrapper").eq(index).addClass('showTab');

    }

    /**
     * Terminates process of teh program
     */

    static exitProgram() {

        remote.getCurrentWindow().close();

    }

}

// Inits main menu's events after window is loaded

$(() => {

    MainMenu.initMainMenuEvents();

})