const Theme = require('../../../models/Theme');
const FileManager = require('../../globals/FileManager');
const path = require('path');

//

const theme = new Theme();

//

class ThemeManager {

    static load() {

        return new Promise(async (resolve, reject) => {
            let themes = await theme.fetchAll();
            let targetTable = $('#themesTable tbody');
            targetTable.empty();
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

            // initialize the dynamic events

            this.initEvents();

            // we are finished

            resolve();
        })

    }

    static initEvents() {

        // for deleting a theme
        
        $('#themesTable .delete').off('clicks').click(function(){
            let targetElem = $(this).parent().parent();
            let id = $(targetElem).attr('data-id');
            theme.deleteById(id).then(()=>{
                targetElem.remove();
            })
        });

    }

    static initStaticEvents() {

        // for adding a theme

        $('#add-theme-modal .modalActionButton').click(() => {

            Loading.showLoading();
            
            let imageAddress = $('#add-theme-modal img').attr('src');

            imageAddress = FileManager.copyToLocale(path.join(__dirname,'../../../',imageAddress));

            let inputs = $('#add-theme-modal input[type=color]');
            let name = $('#add-theme-modal input[type=text]').val();
            theme.add(name, imageAddress, inputs[0].value, inputs[1].value, inputs[2].value).then(() => {
                $('#add-theme-modal').modal('hide');
                this.load();

                Loading.hideLoading();
                PropellerMessage.showMessage('تغییرات با موفقیت ذخیره شدند.','success');

            })
        });

    }

}

ThemeManager.load();
ThemeManager.initStaticEvents();