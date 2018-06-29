const DVD = require('../../../models/DVD');
const Software = require('../../../models/Software');
const FileManager = require('../../globals/FileManager');
const Cat = require('../../../models/Cat');
const PackOS = require('../../../models/PackOS');

//

const cat = new Cat();
const software = new Software();
const dvd = new DVD();

//

const path = require('path');

const fs = require('fs');

class PackContentManager {

    static async load() {

        return new Promise(async (resolve, reject) => {

            // let's empty the menu

            $('#softwares>ul').empty();

            let DVDs = await dvd.fetchAll();

            for (let singleDVD of DVDs) {

                // let's add DVD's element

                $('#softwares>ul').append(`<li data-dvd-number='${singleDVD.number}'><div>
                <i class="material-icons">adjust</i>
                <span>DVD ${singleDVD.number}</span>
            </div><ul class='catWrapper'></ul></li>`);

                let currDVDElem = $(`#softwares>ul>li[data-dvd-number=${singleDVD.number}]>ul`);

                let cats = await cat.getTitlesByDVDNumber(singleDVD.number);

                for (let singleCat of cats) {
                    // let's add cat's element

                    currDVDElem.append(`<li data-cat-id='${singleCat._id}'><div>
                    <i class="material-icons">category</i>
                    <span>${singleCat.title}</span>
                </div><ul class='softWrapper'></ul></li>`);

                    let currCatElem = $(`#softwares [data-cat-id=${singleCat._id}]>ul`);

                    let softwares = await software.getSoftwaresByCat(singleCat._id);

                    for (let singleSoftware of softwares) {
                        // let's add software's element

                        currCatElem.append(`<li data-software-id='${singleSoftware._id}'>
                        <div>
                            <i class="material-icons">insert_drive_file</i>
                            <span>${singleSoftware.title}</span>
                        </div>
                    </li>`);
                    }

                }


            }

            // We are finished;)

            $('#softwares').trigger('reload');

            this.initSoftwareEvents();

            resolve();

        });

    }

    static async search(toSearch) {

        return new Promise(async (resolve, reject) => {

            // let's empty the menu

            $('#softwares>ul').empty();

            let DVDs = await dvd.fetchAll();

            for (let singleDVD of DVDs) {

                // let's add DVD's element

                $('#softwares>ul').append(`<li data-dvd-number='${singleDVD.number}'><div>
                <i class="material-icons">adjust</i>
                <span>DVD ${singleDVD.number}</span>
            </div><ul class='catWrapper'></ul></li>`);

                let currDVDElem = $(`#softwares>ul>li[data-dvd-number=${singleDVD.number}]>ul`);

                let cats = await cat.getTitlesByDVDNumber(singleDVD.number);

                for (let singleCat of cats) {
                    // let's add cat's element

                    currDVDElem.append(`<li data-cat-id='${singleCat._id}'><div>
                    <i class="material-icons">category</i>
                    <span>${singleCat.title}</span>
                </div><ul class='softWrapper'></ul></li>`);

                    let currCatElem = $(`#softwares [data-cat-id=${singleCat._id}]>ul`);

                    let catMatch = await cat.matchItSelf(toSearch,singleDVD.number,singleCat._id)

                    if(catMatch){

                        let softwares = await software.getSoftwaresByCat(singleCat._id);

                        for (let singleSoftware of softwares) {
                            // let's add software's element

                            currCatElem.append(`<li data-software-id='${singleSoftware._id}'>
                            <div>
                                <i class="material-icons">insert_drive_file</i>
                                <span>${singleSoftware.title}</span>
                            </div>
                            </li>`);
                        }

                        continue;
                    }

                    let softwares = await software.findClosest(toSearch, singleCat._id, singleDVD.number);

                    for (let singleSoftware of softwares) {
                        // let's add software's element

                        currCatElem.append(`<li data-software-id='${singleSoftware._id}'>
                        <div>
                            <i class="material-icons">events</i>
                            <span>${singleSoftware.title}</span>
                        </div>
                    </li>`);
                    }

                    if(softwares.length === 0){

                        // if cat matches it self
                        
                        currCatElem.parent().remove();

                    }

                }

                if ($(currDVDElem).find('li').length == 0 && toSearch != '') {
                    currDVDElem.parent().remove();
                }


            }

            // We are finished;)

            $('#softwares').trigger('reload');

            this.initSoftwareEvents();

            resolve();

        });

    }

    static async filterByCat(catId) {
        return new Promise(async (resolve, reject) => {

            // let's empty the menu

            $('#softwares>ul').empty();

            // let's get the target cat

            let currCat = await cat.getById(catId);

            // let's add DVD's element

            $('#softwares>ul').append(`<li data-dvd-number='${currCat.DVDNumber}'><div>
                <i class="material-icons">adjust</i>
                <span>DVD ${currCat.DVDNumber}</span>
            </div><ul class='catWrapper'></ul></li>`);

            let currDVDElem = $(`#softwares>ul>li[data-dvd-number=${currCat.DVDNumber}]>ul`);
            // let's add cat's element

            currDVDElem.append(`<li data-cat-id='${currCat._id}'><div>
                    <i class="material-icons">events</i>
                    <span>${currCat.title}</span>
                </div><ul class='softWrapper'></ul></li>`);

            let currCatElem = $(`#softwares [data-cat-id=${currCat._id}]>ul`);

            let softwares = await software.getSoftwaresByCat(currCat._id);

            for (let singleSoftware of softwares) {
                // let's add software's element

                currCatElem.append(`<li data-software-id='${singleSoftware._id}'>
                        <div>
                            <i class="material-icons">events</i>
                            <span>${singleSoftware.title}</span>
                        </div>
                    </li>`);
            }

            // We are finished;)

            $('#softwares').trigger('reload');

            this.initSoftwareEvents();

            resolve();

        });
    }

    static async filterByDVDNumber(DVDNumber) {

        return new Promise(async (resolve, reject) => {

            // let's empty the menu

            $('#softwares>ul').empty();

            // let's add DVD's element

            $('#softwares>ul').append(`<li data-dvd-number='${DVDNumber}'><div>
                <i class="material-icons">adjust</i>
                <span>DVD ${DVDNumber}</span>
            </div><ul class='catWrapper'></ul></li>`);

            let currDVDElem = $(`#softwares>ul>li[data-dvd-number=${DVDNumber}]>ul`);

            let cats = await cat.getTitlesByDVDNumber(DVDNumber);

            for (let singleCat of cats) {
                // let's add cat's element

                currDVDElem.append(`<li data-cat-id='${singleCat._id}'><div>
                    <i class="material-icons">events</i>
                    <span>${singleCat.title}</span>
                </div><ul class='softWrapper'></ul></li>`);

                let currCatElem = $(`#softwares [data-cat-id=${singleCat._id}]>ul`);

                let softwares = await software.getSoftwaresByCat(singleCat._id);

                for (let singleSoftware of softwares) {
                    // let's add software's element

                    currCatElem.append(`<li data-software-id='${singleSoftware._id}'>
                        <div>
                            <i class="material-icons">events</i>
                            <span>${singleSoftware.title}</span>
                        </div>
                    </li>`);
                }


            }

            // We are finished;)

            $('#softwares').trigger('reload');

            this.initSoftwareEvents();

            resolve();

        });

    }

    /**
     * Loads the number of disks in related comboboxes
     */

    static loadDiskNumbers() {

        return new Promise((resolve, reject) => {
            dvd.getDVDNumbers().then((result) => {

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

    static loadCats() {
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

    static initStaticEvents() {

        // events for add dvd

        $('#add-disk-modal .modalActionButton').click(() => {

            Loading.showLoading();

            let inputs = $('#add-disk-modal input');

            // inputs[0] is dvd number && inputs[1] is dvd content address

            dvd.add(inputs[0].value).then(() => {
                if (inputs[1].value !== '') {
                    this.addDVDContentFromFolder(inputs[0].value, inputs[1].value).then(() => {
                        this.load();
                        $('#add-disk-modal').modal('hide');

                        Loading.hideLoading();
                        PropellerMessage.showMessage('محتویات بارگذاری شدند.', 'success');

                    })
                } else {
                    this.load();
                    $('#add-disk-modal').modal('hide');

                    Loading.hideLoading();
                    PropellerMessage.showMessage('دی وی دی با موفقیت افزوده شد.', 'success');
                }

                this.loadDiskNumbers();

            }).catch((err) => {
                console.log(err)
            })

        })

        // events for add Cat

        $('#add-cat-modal .modalActionButton').click(() => {

            Loading.showLoading();

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

                Loading.hideLoading();
                PropellerMessage.showMessage('کتگوری افزوده شد.', 'success');

                $('#add-cat-modal').modal('hide');

            }).catch(() => {

            })

        });

        // events for add software

        $('#add-soft-modal .modalActionButton').click(() => {

            Loading.showLoading();

            let inputs = $('#add-soft-modal input');

            let selects = $('#add-soft-modal select');

            let tags = [];

            $('#add-soft-modal .tagsCont>a').each((index, elem) => {
                tags.push(elem.textContent);
            })

            // inputs[0] is software name, inputs[1] is the software version, selects[0] is DVDNumber, selects[1] is category and tags is the tags

            software.add(inputs[0].value, inputs[1].value, selects[0].value, selects[1].value, tags).then(() => {
                this.load();
                $('#add-soft-modal').modal('hide');

                Loading.hideLoading();
                PropellerMessage.showMessage('نرم افزار افزوده شد.', 'success');

            }).catch(() => {

            })

        });

        // event for save software

        $('#saveSoftware').off('click').click(() => {

            Loading.showLoading();

            this.saveSoftware().then(()=>{

                this.load();

                Loading.hideLoading();
                PropellerMessage.showMessage('تغغیرات با موفقیت ذخیره شدند.', 'success');

            })

        })

        // event for deleting item(dvd - cat - software)

        $('#delete-alert-modal .modalActionButton').click(() => {

            Loading.showLoading();

            let itemToDelete = $('#softwareMenu .active').parent();

            if (itemToDelete.length === 0) {
                // there is now active items
                Loading.hideLoading();
                PropellerMessage.showMessage('موردی را انتخاب کنید.', 'error');
                $('#delete-alert-modal').modal('hide');
                return;
            }

            if ($(itemToDelete).parent().hasClass('softWrapper')) {
                // it's a software
                software.deleteById($(itemToDelete).attr('data-software-id')).then(() => {
                    this.load();

                    Loading.hideLoading();
                    PropellerMessage.showMessage('آیتم با موفقیت حذف شد.', 'success');

                })
            } else if ($(itemToDelete).parent().hasClass('catWrapper')) {
                // it's a cat
                let catId = $(itemToDelete).attr('data-cat-id');
                cat.deleteById(catId).then(() => {
                    software.deleteByCat(catId).then(() => {
                        this.load();

                        Loading.hideLoading();
                        PropellerMessage.showMessage('آیتم با موفقیت حذف شد.', 'success');

                    })
                })
            } else {
                // it's a dvd
                let DVDNumber = $(itemToDelete).attr('data-dvd-number');
                dvd.deleteByNumber(DVDNumber).then(() => {
                    cat.deleteByDVD(DVDNumber).then(() => {
                        software.deleteByDVD(DVDNumber).then(() => {
                            this.load();

                            Loading.hideLoading();
                            PropellerMessage.showMessage('آیتم با موفقیت حذف شد.', 'success');

                        })
                    })
                })
            }

            $('#delete-alert-modal').modal('hide');

        });

        // event for editing category

        // for loading

        $('#softwareMenu>footer li:nth-of-type(3)').click(() => {

            Loading.showLoading();

            let id = $('#softwareMenu .active').parent().attr('data-cat-id');
            cat.getById(id).then((item) => {
                $('#edit-cat-modal input[type=text]').val(item.title);
                $(`#edit-cat-modal option[value=${item.DVDNumber}]`).attr('selected', true);
                let tagCont = $('#edit-cat-modal .tagsCont');
                tagCont.empty();
                for (let tag of item.tags) {
                    tagCont.append(`<a class="list-group-item" href="javascript:void(0);">${tag}</a>`);
                }

                Loading.hideLoading();

                $('#edit-cat-modal').modal('show');
            });
        });

        // for edit itself

        $('#edit-cat-modal .modalActionButton').click(() => {

            Loading.showLoading();

            let id = $('#softwareMenu .active').parent().attr('data-cat-id');
            let title = $('#edit-cat-modal input[type=text]').val();
            let DVDNumber = $('#edit-cat-modal select').val();
            let tagsElems = $('#edit-cat-modal .tagsCont>a');
            let tags = [];
            for (let tag of tagsElems) {
                tags.push(tag.textContent);
            }
            cat.edit(id, title, DVDNumber, tags).then(() => {
                this.load();

                Loading.hideLoading();

                Loading.hideLoading();
                PropellerMessage.showMessage('آیتم با موفقیت ویرایش شد.', 'success');

            })
            $('#edit-cat-modal').modal('hide');
        });

        // search

        $('#softHeaderSliderWrapper>.slideWrapper:nth-of-type(1) button').click(() => {
            Loading.showLoading();
            let toSearch = $('#softHeaderSliderWrapper>.slideWrapper:nth-of-type(1) input[type=text]').val();
            this.search(toSearch).then(() => {
                Loading.hideLoading();
            })
        })

        // filter by DVDNumber

        $('#softHeaderSliderWrapper>.slideWrapper:nth-of-type(2) button').click(() => {
            Loading.showLoading();
            let DVDNumber = $('#softHeaderSliderWrapper>.slideWrapper:nth-of-type(2) select').val();
            this.filterByDVDNumber(DVDNumber).then(() => {
                Loading.hideLoading();
            })
        })

        // filter by cat

        $('#softHeaderSliderWrapper>.slideWrapper:nth-of-type(3) button').click(() => {
            Loading.showLoading();
            let catId = $('#softHeaderSliderWrapper>.slideWrapper:nth-of-type(3) select').val();
            this.filterByCat(catId)
            Loading.hideLoading();
        })

    }

    static initSoftwareEvents() {

        let that = this;

        $('#softwares ul.softWrapper>li').click(function (e) {
            e.stopPropagation()

            Loading.showLoading();

            let softwareId = $(this).attr('data-software-id');

            software.getById(softwareId).then((result) => {

                // Let's show the software

                that.showSoftware(result).then(()=>{

                    // Let's hide the blur

                    $('.tabWrapper.forSoftware').removeClass('blur');

                    Loading.hideLoading();

                })

            });

        });

    }

    static async addDVDContentFromFolder(DVDNumber, address) {
        return new Promise(async (resolve, reject) => {
            if (fs.existsSync(address)) {

                let catsDirectories = fs.readdirSync(address);

                for (let catDirectory of catsDirectories) {
                    console.log(catDirectory)
                    // Adding the category
                    if (fs.existsSync(path.join(address, catDirectory)) && fs.lstatSync(path.join(address, catDirectory)).isDirectory()) {
                        let newCat = await cat.add(catDirectory, DVDNumber, []);

                        let softwaresInTheCat = fs.readdirSync(path.join(address, catDirectory));

                        for (let singleSoft of softwaresInTheCat) {
                            if (fs.existsSync(path.join(address, singleSoft)) && fs.lstatSync(path.join(address, singleSoft)).isDirectory()) {

                                // check if gerdoo.txt file exists

                                if (fs.existsSync(path.join(address, catDirectory, singleSoft, 'gerdoo.txt'))) {
                                    let gerdooText = fs.readFileSync(path.join(address, catDirectory, singleSoft, 'gerdoo.txt'), 'utf8');

                                    // <ig> is for installation guide

                                    let ig = /<ig>((?:.|\s)*)<\/ig>/i.exec(gerdooText)[1];

                                    // <d> is for description

                                    let desc = /<d>((?:.|\s)*)<\/d>/i.exec(gerdooText)[1];

                                    // <s> is for supported oses

                                    let supportedOSes = /<s>((?:.|\s)*)<\/s>/i.exec(gerdooText)[1].trim().split('\n');

                                    // let's convert os names to ids

                                    let finalOSes = [];

                                    let packOS = new PackOS();

                                    for(let singleOS of supportedOSes){
                                        finalOSes.push((await packOS.getByName(singleOS.trim()))._id);
                                    }

                                    // let's add it to the DB

                                    let softImage = null;
                                    

                                    if (fs.existsSync(path.join(address, catDirectory, singleSoft, '1.gif'))) {
                                        softImage = FileManager.copyToLocale(path.join(address, catDirectory, singleSoft, '1.gif'));
                                    }

                                    let setup = null;

                                    if (fs.existsSync(path.join(address, catDirectory, singleSoft, 'setup.exe'))) {
                                        setup = 'setup.exe'
                                    }

                                    await software.add(singleSoft, null, DVDNumber, newCat._id, [], finalOSes, softImage, setup, `${catDirectory}/${singleSoft}`, null, false, null, desc, null, ig, null, null, null, null)

                                } else {
                                    await software.add(singleSoft, null, DVDNumber, newCat._id, []);
                                }
                            }

                        }
                    }


                }

                resolve();

            } else {
                // Address doesn't exists
                reject(-1);
            }
        });


    }

    static initializeChangableDVDs() {

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

    static async showSoftware(software){

        return new Promise(async(resolve, reject)=>{

            // Let's load the software

            let inputs = $('.tabWrapper input:not([type=checkbox])');
            let selects = $('.tabWrapper select');
            let quills = $('.tabWrapper .quillEditor>div:first-of-type');

            let textarea = $('.tabWrapper textarea');


            // let's set the _id
            $('#generalTab').attr('data-id', software._id);
            // let's set the name on the data-name
            $('#generalTab').attr('data-name', software.title);
            // setting the dvd number
            $(selects[0]).find(`[value=${software.DVDNumber}]`).attr('selected', 'true').trigger('change');
            // setting the cat  
            $(selects[1]).on('changed', function () {
                $(this).find(`[value=${software.cat}]`).attr('selected', 'true')
            })
            // setting the name 
            inputs[0].value = software.title;
            // setting the version
            inputs[1].value = software.version;
            // setting the image address
            $('#softwareImageWrapper img').attr('src', software.image);
            // setting the oses
            console.log($('.tabWrapper input:checked'))
            $('.tabWrapper input:checked').attr('checked', false)
            for (let os of software.oses) {
                if (os.trim() != '') {
                    $('.tabWrapper').find(`input[type=checkbox][value=${os}]`).prop('checked', true);
                }
            }
            // setting the setup
            inputs[2].value = software.setup;
            // setting the program address

            let softwareCat = await cat.getById(software.cat);

            inputs[3].value = software.programAddress ? software.programAddress : `${softwareCat.title}/${software.title}`;
            // setting the tags
            let tagsCont = $('.tabWrapper .tagsCont');
            tagsCont.empty();
            for (let tag of software.tags) {
                tagsCont.append(`<a class="list-group-item" href="javascript:void(0);">${tag}</a>`);
            }
            $('.tagsCont>a').off('click').click(function () {
                $(this).remove();
            });
            // setting web address
            inputs[4].value = software.video;
            // setting isRecommended
            if (software.isRecommended) {
                $('#isRecommended').prop('checked', true)
            } else {
                $('#isRecommended').prop('checked', false)
            }
            // set faDesc
            quills[0].innerHTML = software.faDesc;
            // setting en desc
            quills[1].innerHTML = software.enDesc;
            // setting the fa guide
            quills[2].innerHTML = software.faGuide;
            // setting the en guide
            quills[3].innerHTML = software.enGuide;
            // setting the crack
            inputs[4].value = software.crack;

            // we are done

            resolve();

        })

    }

    static saveSoftware(){

        return new Promise((resolve, reject)=>{

            // let's get the contents

            let inputs = $('.tabWrapper input:not([type=checkbox])');
            let selects = $('.tabWrapper select');
            let quills = $('.tabWrapper .quillEditor>div:first-of-type');

            let textarea = $('.tabWrapper textarea');


            // let's set the _id
            let id = $('#generalTab').attr('data-id');
            // setting the dvd number
            let DVDNumber = $(selects[0]).find('option:selected').val();
            // setting the cat  
            let cat = $(selects[1]).find('option:selected').val();
            // setting the name 
            let title = inputs[0].value;
            // setting the version
            let version = inputs[1].value;
            // setting the image address
            let image = $('#softwareImageWrapper img').attr('src');
            // setting the oses
            let selectedOSes = $('.tabWrapper input:checked')
            let oses = [];
            for (let os of selectedOSes) {
                oses.push($(os).val());
            }
            // setting the setup
            let setup = inputs[2].value;
            // setting the program address
            let programAddress = inputs[3].value;
            // setting the tags
            let tagsElems = $('.tabWrapper .tagsCont>a');
            let tags = [];
            for (let tag of tagsElems) {
                tags.push(tag.textContent.trim());
            }
            // setting web address
            let video = inputs[4].value;
            // getting isRecommended
            let isRecommended = false;
            if ($('#isRecommended').is(':checked')) {
                isRecommended = true;
            }
            // set faDesc
            let faDesk = quills[0].innerHTML;
            // setting en desc
            let enDesk = quills[1].innerHTML;
            // setting the fa guide
            let faGuide = quills[2].innerHTML;
            // setting the en guide
            let enGuide = quills[3].innerHTML;
            // setting the crack
            let crack = inputs[4].value;

            // let's save the software

            software.save(id, title, version, DVDNumber, cat, tags, oses, image, setup, programAddress, video, isRecommended, faDesk, enDesk, faGuide, enGuide, crack).then(() => {
                
                resolve();

            })
        })
    }

}

// loads all the dvds, cats and softwares into the menu

PackContentManager.load().then(() => {

    PackContentManager.initializeChangableDVDs();

    PackContentManager.loadDiskNumbers();

    PackContentManager.loadCats();

    PackContentManager.initStaticEvents();

})