// Electron utilities

const {dialog} = require('electron').remote;

// NodeJS build-in utilites

const fs = require('fs');

const path = require('path');

// Utilites

const FileManager = require('../globals/FileManager');

// QuillHandler class handles events and functionality of the Quill editors

class QuillHandler {

    /**
     * Turns normal divs to quill editor
     */

    static initQuills() {

        // Setting the config

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

        // Let's turn divs with className of quillEditor to quill editor

        $('.quillEditor').each(() => {

            // Let's turn it to quill editor

            let editor = new Quill('.quillEditor:not(.ql-container)', configs);

            // Setting the handler of the video

            editor.getModule('toolbar').addHandler('video', () => {

                this.addQuillVideo(editor)

            });

            // Setting the handler of the image

            editor.getModule('toolbar').addHandler('image', () => {

                this.addQuillImage(editor)

            });

            // Changing direction and align

            editor.format('direction', 'rtl');

            editor.format('align', 'right');

        });

        // GeneralInfo tab wapper scrolls down after Quill initializes

        // Let's scroll it up

        $('main#stepWrapper #stepManagerWrapper>.stepWrapper:first-of-type').scrollTop(0);

    }

    /**
     * Handles video add system of the quill editors
     * @param {QuillEditorObject} editor - The editor refrence
     */

    static addQuillVideo(editor) {

        // Let's open a dialog to get the address of the video

        let videoAddress = dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{
                name: 'video',
                extensions: ['mkv', 'avi', 'mp4']
            }]
        });
        
        // Check whether user selected one or not

        if(!videoAddress){

            // Nah!

            return;

        }else{

            // Let's get the address

            videoAddress = videoAddress[0];

        }

        // Let's copy the video to the assets folder of the current pack

        videoAddress = FileManager.copyToLocale(videoAddress);

        // Let's insert the <video> tag into the editor

        this.insertVideoToEditor(editor, videoAddress)

    }

    /**
     * Handles image add system of the quill editors
     * @param {QuillEditorObject} editor - The editor refrence
     */

    static addQuillImage(editor) {

        // Gets the image address from the user

        let imageAddress = dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{
                name: 'image',
                extensions: ['png', 'ico', 'jpg', 'jpeg']
            }]
        });

        // Check whether user selected one or not

        if(!imageAddress){

            // Nah!

            return;

        }else{

            // Let's get the address

            imageAddress = imageAddress[0];

        }

        // Let's copy the image to the assets folder of the current pack

        imageAddress = FileManager.copyToLocale(imageAddress)

        // Let's insert the <img> tag into the editor

        this.insertImageToEditor(editor, imageAddress);

    }

    /**
     * Inserts <video> tag into the editor
     * @param {QuillEditorObject} editor - The editor tag should be inserted in
     * @param {String} url - The url of the video
     */

    static insertVideoToEditor(editor, url) {

        // Push video url to quill editor

        const range = editor.getSelection();

        editor.insertEmbed(range.index, 'video',  url);

    }

    /**
     * Inserts <img> tag into the editor
     * @param {QuillEditorObject} editor - The editor tag should be inserted in
     * @param {String} url - The url of the image
     */

    static insertImageToEditor(editor, url) {

        // Push image url to quill editor

        const range = editor.getSelection();

        editor.insertEmbed(range.index, 'image', url);
    }

}

// Let's turn all the desired divs to quil editors

QuillHandler.initQuills();