const {dialog} = require('electron').remote;
const fs = require('fs');

class QuillHandler {

    constructor() {

        this.initQuills();

    }

    initQuills() {
        let configs = {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                    ['blockquote', 'code-block', 'image', 'video'],
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
                this.addQuillVideo(editor)
            });
            editor.getModule('toolbar').addHandler('image', () => {
                this.addQuillImage(editor)
            });
            editor.format('direction', 'rtl');
            editor.format('align', 'right');
        });
    }

    addQuillVideo(editor) {

        let videoAddress = dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{
                name: 'video',
                extensions: ['mkv', 'avi', 'mp4']
            }]
        })[0];

        this.insertVideoToEditor(editor, videoAddress)

    }

    copyToLocale(address){
        
        fs.copyFileSync(address,`${__dirname}/a.ico`);
    }

    addQuillImage(editor) {
        let imageAddress = dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{
                name: 'image',
                extensions: ['png', 'ico', 'jpg', 'jpeg']
            }]
        })[0];
        this.copyToLocale(imageAddress)
        this.insertImageToEditor(editor, imageAddress)
    }

    insertVideoToEditor(editor, url) {
        // push image url to rich editor.
        const range = editor.getSelection();

        editor.insertEmbed(range.index, 'video', 'file:///' + url);
    }

    insertImageToEditor(editor, url) {
        // push image url to rich editor.
        const range = editor.getSelection();

        editor.insertEmbed(range.index, 'image', 'file://' + url);
    }

}

new QuillHandler();