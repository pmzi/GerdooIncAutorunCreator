class Step {

    constructor() {

        this.initEvents();

        this.initQuill();

    }

    initEvents() {

        let that = this; // some stupid action...

        // Header click change color and change steps

        $('.stepCont').click(function () {

            $('#steps>div').removeClass('active')

            // let's change the step

            $('.stepWrapper.forActive').removeClass('forActive')
            $('.stepWrapper.backActive').removeClass('backActive')

            $('.stepWrapper').each((index, elem) => {
                if (index < $(this).index() / 2) {
                    $(elem).addClass('backActive');
                } else if (index > $(this).index() / 2) {
                    $(elem).addClass('forActive');
                }
            })

            $('#steps>div').each((index, elem) => {

                if (index <= $(this).index()) {
                    $(elem).addClass('active')
                }

            })
        })

    }

    initQuill() {

        let configs = {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                    ['blockquote', 'code-block', 'image','video'],
                    [{
                        'header': 1
                    }, {
                        'header': 2
                    }], // custom button values
                    [{
                        'list': 'ordered'
                    }, {
                        'list': 'bullet'
                    }],
                    [{
                        'script': 'sub'
                    }, {
                        'script': 'super'
                    }], // superscript/subscript
                    [{
                        'indent': '-1'
                    }, {
                        'indent': '+1'
                    }], // outdent/indent
                    [{
                        'direction': 'rtl'
                    }], // text direction

                    [{
                        'size': ['small', false, 'large', 'huge']
                    }], // custom dropdown
                    [{
                        'header': [1, 2, 3, 4, 5, 6, false]
                    }],

                    [{
                        'color': []
                    }, {
                        'background': []
                    }], // dropdown with defaults from theme
                    [{
                        'font': []
                    }],
                    [{
                        'align': []
                    }],

                    ['clean'] // remove formatting button
                ]
            },
            placeholder: 'متن...',
            theme: 'snow' // or 'bubble'
        }

        $('.quillEditor').each(() => {
            let editor = new Quill('.quillEditor:not(.ql-container)', configs);
            editor.getModule('toolbar').addHandler('video', () => {
                adddd();
              });
            editor.format('direction', 'rtl');
            editor.format('align', 'right');
        });

    }

}

new Step();
function adddd(){
    console.log("HERE")
}