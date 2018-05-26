const DVD = require('../../../models/DVD');
const software = require('../../../models/Software');
const cat = require('../../../models/Cat');


class PackContentManager {
    constructor() {

        // loads all the dvds, cats and softwares into the menu

        this.load().then(() => {

            this.initializeChangableDVDs();

            this.loadDiskNumbers();

            this.loadCats();

            this.initEvents();

        })

    }

    load() {
        return new Promise((resolve, reject) => {

            // let's empty the menu

            $('#softwares>ul').empty();

            DVD.fetchAll().then((DVDs) => {

                DVDs.forEach((singleDVD) => {

                    // let's add DVD's element

                    $('#softwares>ul').append(`<li data-dvd-number='${singleDVD.number}'><div class="pmd-ripple-effect">
                    <i class="material-icons">adjust</i>
                    <span>DVD ${singleDVD.number}</span>
                </div><ul class='catWrapper'></ul></li>`);

                    let currDVDElem = $(`#softwares>ul>li[data-dvd-number=${singleDVD.number}]>ul`);

                    cat.getTitlesByDVDNumber(singleDVD.number).then((cats) => {
                        cats.forEach((singleCat) => {

                            // let's add cat's element

                            currDVDElem.append(`<li data-cat-id='${singleCat._id}'><div class="pmd-ripple-effect">
                            <i class="material-icons">events</i>
                            <span>${singleCat.title}</span>
                        </div><ul class='softWrapper'></ul></li>`);

                            let currCatElem = $(`#softwares [data-cat-id=${singleCat._id}]>ul`);

                            software.getSoftwaresByCat(singleCat._id).then((softwares) => {
                                softwares.forEach((singleSoftware) => {

                                    // let's add software's element

                                    currCatElem.append(`<li data-software-id='${singleSoftware._id}'>
                                    <div class="pmd-ripple-effect">
                                        <i class="material-icons">events</i>
                                        <span>${singleSoftware.title}</span>
                                    </div>
                                </li>`);

                                    if (singleDVD.number === DVDs[DVDs.length - 1].number) {

                                        // We are finished;)

                                        $('#softwares').trigger('reload');

                                        this.initSoftwareEvents();

                                        resolve();
                                    }

                                });
                            })
                        });
                    })

                });

            })



        })
    }

    /**
     * Loads the number of disks in related comboboxes
     */

    loadDiskNumbers() {

        return new Promise((resolve, reject) => {
            DVD.getDVDNumbers().then((result) => {

                $('.DVDNumbers').each(function () {
                    $(this).empty();
                    result.forEach((item) => {
                        $(this).append(`<option value='${item.number}'>${item.number}</option>`);
                    })
                });
                $('.changableDVD').trigger('DVDsLoaded')
                resolve();
            })
        });
    }

    /**
     * Loads the cats in related comboboxes
     */

    loadCats() {
        return new Promise((resolve, reject) => {

            cat.getAllTitles().then((result) => {

                $('.catsList').each(function () {

                    $(this).empty();

                    result.forEach((item) => {
                        $(this).append(`<option value='${item._id}'>${item.title}</option>`);
                    })

                });

            });

        });
    }

    initEvents() {

        // events for add dvd

        $('#add-disk-modal .modalActionButton').click(() => {

            let inputs = $('#add-disk-modal input');

            // inputs[0] is dvd number && inputs[1] is dvd content address

            DVD.add(inputs[0].value).then(() => {
                this.loadDiskNumbers();
                this.load();
                if (inputs[1].value !== '') {
                    this.addDVDContentFromFolder(inputs[0].value, inputs[1].value);
                } else {
                    $('#add-disk-modal').modal('hide');
                }

            }).catch((err) => {
                console.log(err)
            })

        })

        // events for delete dvd

        // events for add Cat

        $('#add-cat-modal .modalActionButton').click(() => {

            let inputs = $('#add-cat-modal input');

            let selects = $('#add-cat-modal select');

            let tags = [];

            $('#add-cat-modal .tagsCont>a').each((index, elem) => {
                tags.push(elem.textContent);
            })

            // inputs[0] is for catTitle, selects[0] is for DVDnumber and tags are the tags array

            cat.add(inputs[0].value, selects[0].value, tags).then(() => {

                this.loadCats();
                this.load();

                $('#add-cat-modal').modal('hide');

            }).catch(() => {

            })

        });

        // events for add software

        $('#add-soft-modal .modalActionButton').click(() => {

            let inputs = $('#add-soft-modal input');

            let selects = $('#add-soft-modal select');

            let tags = [];

            $('#add-soft-modal .tagsCont>a').each((index, elem) => {
                tags.push(elem.textContent);
            })

            // inputs[0] is software name, selects[0] is DVDNumber, selects[1] is category and tags is the tags

            software.add(inputs[0].value, selects[0].value, selects[1].value, tags).then(() => {
                this.load();
                $('#add-soft-modal').modal('hide');

            }).catch(() => {

            })

        });

    }

    initSoftwareEvents(){

        let that = this;

        $('#softwares ul.softWrapper>li').off('click').click(function(e){
            e.stopPropagation()
            let softwareId = $(this).attr('data-software-id');

            software.getById(softwareId).then((result)=>{

                // Let's load the software

                let inputs = $('.tabWrapper input:not([type=checkbox])');
                let selects = $('.tabWrapper select');
                let quills = $('.tabWrapper .quillEditor>div:first-of-type');
                let textarea = $('.tabWrapper textarea');

                // setting the dvd number
                $(selects[0]).find(`[value=${result.DVDnumber}]`).attr('selected','true').trigger('change');
                // setting the cat  
                $(selects[1]).on('changed',function(){
                    $(this).find(`[value=${result.cat}]`).attr('selected','true')
                })
                // setting the name 
                inputs[0].value = result.title;
                // setting the image address
                $('#softwareImageWrapper img').attr('src',result.image);
                // setting the oses
                // @todo
                // setting the setup
                inputs[1].value = result.setup;
                // setting the program address
                inputs[2].value = result.programAddress;
                // setting the tags
                // @todo
                // setting web address
                // @todo
                // set faDesc
                quills[0].innerHTML = result.faDesc;
                // setting en desc
                quills[1].innerHTML = result.enDesc;
                // setting the fa guide
                quills[2].innerHTML = result.faGuide;
                // setting the en guide
                quills[3].innerHTML = result.enGuide;
                // setting the crack
                inputs[4].value = result.crack;
                // setting the patch
                inputs[5].value = result.patch;
                // setting the serial numbers
                textarea.textContent = result.serial;
            });

        });

    }

    addDVDContentFromFolder(DVDNumber, address) {

    }

    initializeChangableDVDs() {

        // set the action for the onchange event
        $('.changableDVD').off('change DVDsLoaded').on('change DVDsLoaded', function () {
            cat.getTitlesByDVDNumber($(this).val()).then((result) => {
                let targetSelect = $(this).parent().parent().next().find('select');
                targetSelect.empty();
                result.forEach((item) => {
                    targetSelect.append(`<option value='${item._id}'>${item.title}</option>`);
                });
                $(targetSelect).trigger('changed');
            });
        });
    }

}

new PackContentManager();