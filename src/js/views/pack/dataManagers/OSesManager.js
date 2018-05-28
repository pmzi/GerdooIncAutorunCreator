const packOS = require('../../../models/PackOS');

class OSesManager {

    constructor() {

        this.load().then(() => {
            this.initEvents();

            this.initStaticEvents();
        })

    }

    load() {
        return new Promise((resolve, reject) => {
            $('#osList').empty();

            packOS.fetchAll().then((result) => {

                for (let item of result) {
                    $('#osList').append(`<div class="checkbox pmd-default-theme">
                    <label class="pmd-checkbox pmd-checkbox-ripple-effect">
                        <input type="checkbox" value="${item._id}">
                        <span>${item.name}</span>
                    </label>
                </div>`);
                }

                resolve();

            })
        })


    }

    initEvents() {

        // Event for delete OS

        

    }



    initStaticEvents(){

        // Event for add os modal

        $('#add-os-modal .modalActionButton').click(()=>{
            let osTitle = $('#add-os-modal input').val();

            packOS.add(osTitle).then(()=>{
                this.load().then(()=>{
                    this.initEvents();
                })
                $('#add-os-modal').modal('hide');
            })
        });

    }

}

new OSesManager();