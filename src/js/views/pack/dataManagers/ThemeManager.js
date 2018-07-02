// Models

const Theme = require('../../../models/Theme');

// Utilities

const FileManager = require('../../globals/FileManager');

// NodeJS built-in utilites

const path = require('path');

// Instantiating the models

const theme = new Theme();

// ThemeManager class which handles events and data related to themes

class ThemeManager {

    /**
     * Loads the themes that previously defined
     * @returns {Promise}
     */

    static load() {

        return new Promise(async (resolve, reject) => {

            // Let's fetch all themes from the DB

            let themes = await theme.fetchAll();

            // Let's get the table of the themes

            let targetTable = $('#themesTable tbody');

            // Let's empty it
            
            targetTable.empty();

            // Now, let's append themes into it

            let i = 1;

            for (let singleTheme of themes) {

                targetTable.append(`<tr data-id='${singleTheme._id}'>
                <td>
                    ${i}
                </td>
                <td>
                    ${singleTheme.name}
                </td>
                <td>
                    ${singleTheme.color1}
                </td>
                <td>
                    ${singleTheme.color2}
                </td>
                <td>
                    ${singleTheme.backColor}
                </td>
                <td>
                    <a class="pmd-tooltip delete" data-toggle="tooltip" data-placement="top" title="حذف" href="#" onclick="javascript:void(0)">
                        <i class="material-icons">
                            delete
                        </i>
                    </a>
                </td>
            </tr>`);

                i++;

            }

            // Let's initiate events of the themes on the appended elements(Delete)

            this.initEvents();

            // We are finished

            resolve();
        })

    }

    static initEvents() {

        // Setting event listener for deleting a theme
        
        $('#themesTable .delete').off('clicks').click(function(){

            // Let's get the <tr> of the selected element

            let targetElem = $(this).parent().parent();

            // Let's get the id of the theme

            let id = $(targetElem).attr('data-id');

            // Let's delete the theme from the DB

            theme.deleteById(id).then(()=>{

                // Now, let's delete the <tr>

                targetElem.remove();

            })
        });

    }

    /**
     * Initiates static events which are related to the themes
     */

    static initStaticEvents() {

        // Setting event listener for adding a theme

        $('#add-theme-modal .modalActionButton').click(() => {

            // Let's show the loading

            Loading.showLoading();

            // Let's get the image address of the theme
            
            let imageAddress = $('#add-theme-modal img').attr('src');

            // Let's copy the image to the assets folder of the current pack

            imageAddress = FileManager.copyToLocale(path.join(__dirname,'../../../',imageAddress));

            // Let's get coor inputs

            let inputs = $('#add-theme-modal input[type=color]');

            // Let's get the name of the theme

            let name = $('#add-theme-modal input[type=text]').val();

            // Le's add the theme to the DB

            theme.add(name, imageAddress, inputs[0].value, inputs[1].value, inputs[2].value).then(() => {

                // We are finished

                // Let's hide the modal

                $('#add-theme-modal').modal('hide');

                // Let's reload the themes so that new theme will be appeared there

                this.load();

                // Let's hide the loading and inform user

                Loading.hideLoading();

                PropellerMessage.showMessage('تغییرات با موفقیت ذخیره شدند.','success');

            })
        });

    }

}

// Let's load the theme and add static events

ThemeManager.load();

ThemeManager.initStaticEvents();