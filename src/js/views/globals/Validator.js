class Validator{

    static validate(parent) {

        let hasError = false;

        let inputs = $(parent).find('input[data-validation]');

        console.log(inputs)

        for(let input of inputs){

            // let's check validation

            // check empty

            if(input.value.trim() == ''){
                this.showMessage(input, 'این فیلد الزامی است.', 2);
                hasError = true;
                continue;
            }

            // check for being a number

            if(input.getAttribute('type') == 'number'){
                if(parseInt(input.value.trim()) != input.value.trim()){
                    this.showMessage(input, "یک عدد وارد کنید.", type);
                    hasError = true;
                    continue;
                }
            }

            // it has no errors

            this.hideMessage(input)

        }

        let selects = $(parent).find('select[data-validation]');

        for(let select of selects){

            if(select.value.trim() == ''){

                this.showMessage(select, "موردی را انتخاب کنید.", 2);
                hasError = true;
                continue;

            }

            this.hideMessage(select)

        }

        return hasError;

    }

    /**
     * 
     * @param {Number} type - 1-> success, 2-> error
     */

    static showMessage(inputElement, message, type){

        $(inputElement).parent().addClass('has-error');
        console.log($(inputElement).next().next())
        if($(inputElement).next().next().hasClass('control-label')){
            console.log("has")
            $(inputElement).next().next().text(message);
            return;
        }

        $(inputElement).parent().append(`<label class="control-label">${message}</label>`);

    }

    static hideMessage(inputElement){
        $(inputElement).parent().removeClass('has-error');
        $(inputElement).parent().addClass('has-success')
        $(inputElement).next().next().remove();
    }

}

module.exports = Validator;