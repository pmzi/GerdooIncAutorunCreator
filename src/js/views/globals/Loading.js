class Loading{

    static showLoading(){
        $('#loading').show(500);
        $('#wrapper').addClass('blur');
    }

    static hideLoading(){
        $('#loading').hide(500);
        $('#wrapper').removeClass('blur');
    }

}