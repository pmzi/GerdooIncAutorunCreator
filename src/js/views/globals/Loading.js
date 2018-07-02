// Loading class handles showing and hiding loading

class Loading{


    /**
     * Shows the loading
     */

    static showLoading(){
        $('#loading').show(500);
        $('#wrapper').addClass('blur');
    }

    /**
     * Hides the loading
     */

    static hideLoading(){
        $('#loading').hide(500);
        $('#wrapper').removeClass('blur');
    }

}