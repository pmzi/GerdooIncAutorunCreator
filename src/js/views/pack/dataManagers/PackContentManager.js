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

                                    currCatElem.append(`<li>
                                    <div class="pmd-ripple-effect">
                                        <i class="material-icons">events</i>
                                        <span>${singleSoftware.title}</span>
                                    </div>
                                </li>`);

                                    if (singleDVD.number === DVDs[DVDs.length - 1].number) {

                                        // We are finished;)

                                        $('#softwares').trigger('reload');

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
            });
        });
    }

}

new PackContentManager();