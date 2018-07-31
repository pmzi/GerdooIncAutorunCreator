// Filemanager utility

const FileManager = require('../../globals/FileManager');

// Validator

const Validator = require('../../globals/Validator');

// Models refrence

const cat = window.dbs.cat;

const software = window.dbs.software;

const dvd = window.dbs.dvd;

// Some Node utilities

const path = require('path');

const fs = require('fs');

// PackContentManager class which handles events and data related to PackContent(Softwares, DVDs and Cats)

class PackContentManager {

    /**
     * Loads the DVDs, Cats and Softwares
     * @returns {Promise}
     */

    static async load() {

        return new Promise(async (resolve, reject) => {

            // Let's empty the menu

            $('#softwares>ul').empty();

            // Let's fetch all

            let DVDs = await dvd.fetchAll();

            // Let's append DVDs

            for (let singleDVD of DVDs) {

                // Let's append DVD's element

                $('#softwares>ul').append(`<li data-dvd-number='${singleDVD.number}'><div>
                <i class="material-icons">adjust</i>
                <span>DVD ${singleDVD.number}</span>
            </div><ul class='catWrapper'></ul></li>`);

                // Getting current DVD element

                let currDVDElem = $(`#softwares>ul>li[data-dvd-number=${singleDVD.number}]>ul`);

                // Let's get Cats of the current DVD

                let cats = await cat.getTitlesByDVDNumber(singleDVD.number);

                // Let's append cats

                for (let singleCat of cats) {

                    // Let's appned cat's element to current DVD

                    currDVDElem.append(`<li data-cat-id='${singleCat._id}'><div>
                    <i class="material-icons">category</i>
                    <span>${singleCat.title}</span>
                </div><ul class='softWrapper'></ul></li>`);

                    // Let's get current cat element

                    let currCatElem = $(`#softwares [data-cat-id=${singleCat._id}]>ul`);

                    // Let's get current cat's softwares

                    let softwares = await software.getSoftwaresByCat(singleCat._id);

                    // Let's append softwares to current cat

                    for (let singleSoftware of softwares) {

                        // Let's append software's element

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

            // Trigger reload to reload system of slide down and slide up which has been declared in SoftwareStep.js

            $('#softwares').trigger('reload');

            // Let's init software related events(for showing software events)

            this.initSoftwareEvents();

            // We are truly done:)

            resolve();

        });

    }

    /**
     * Searches the content of the pack and appends the result
     * @returns {Promise}
     */

    static async search(toSearch) {

        return new Promise(async (resolve, reject) => {

            // Let's empty the softwares section

            $('#softwares>ul').empty();

            // Let's fetch all DVDs

            let DVDs = await dvd.fetchAll();

            // Let's append all DVDs elements

            for (let singleDVD of DVDs) {

                // Let's append DVD's element

                $('#softwares>ul').append(`<li data-dvd-number='${singleDVD.number}'><div>
                <i class="material-icons">adjust</i>
                <span>DVD ${singleDVD.number}</span>
            </div><ul class='catWrapper'></ul></li>`);

                // Let's get the current DVD element

                let currDVDElem = $(`#softwares>ul>li[data-dvd-number=${singleDVD.number}]>ul`);

                // Let's get the cats of current DVD

                let cats = await cat.getTitlesByDVDNumber(singleDVD.number);

                // Let's append all cats

                for (let singleCat of cats) {

                    // Let's append cat's element

                    currDVDElem.append(`<li data-cat-id='${singleCat._id}'><div>
                    <i class="material-icons">category</i>
                    <span>${singleCat.title}</span>
                </div><ul class='softWrapper'></ul></li>`);

                    // Let's get the current cat's element

                    let currCatElem = $(`#softwares [data-cat-id=${singleCat._id}]>ul`);

                    // Let's get the match case of the cat
                    // Returns whether the cat matches the search conditions or not

                    let catMatch = await cat.matchItSelf(toSearch,singleDVD.number,singleCat._id)

                    // Checks whether cat has the condition or not

                    if(catMatch){

                        // Matched:)

                        // Let's get softwares of the current cat

                        let softwares = await software.getSoftwaresByCat(singleCat._id);

                        // Let's append softwares of current cats

                        for (let singleSoftware of softwares) {

                            // Let's append software's element

                            currCatElem.append(`<li data-software-id='${singleSoftware._id}'>
                            <div>
                                <i class="material-icons">insert_drive_file</i>
                                <span>${singleSoftware.title}</span>
                            </div>
                            </li>`);

                        }

                        // Let's skip furthers

                        continue;

                    }

                    // Let's get the softwares which match the search conditions

                    let softwares = await software.findClosest(toSearch, singleCat._id, singleDVD.number);

                    // Let's append matched softwares

                    for (let singleSoftware of softwares) {

                        // Let's add software's element

                        currCatElem.append(`<li data-software-id='${singleSoftware._id}'>
                            <div>
                                <i class="material-icons">events</i>
                                <span>${singleSoftware.title}</span>
                            </div>
                        </li>`);

                    }

                    // If there is now matched softwares found, let's remove the parent cat

                    if(softwares.length === 0){

                        // Let's remove the cat
                        
                        currCatElem.parent().remove();

                    }

                }

                // If DVD has no matching cat, let's remove the DVD element

                if ($(currDVDElem).find('li').length == 0 && toSearch != '') {
                    currDVDElem.parent().remove();
                }


            }

            // We are finished;)

            // Trigger reload to reload system of slide down and slide up which has been declared in SoftwareStep.js

            $('#softwares').trigger('reload');

            // Let's init software related events(for showing software events)

            this.initSoftwareEvents();

            // We are truly done:)

            resolve();

        });

    }

    /**
     * Filters the softwares section by selected cat
     * @param {String} catId - The id of cat we are going to filter by
     * @returns {Promise}
     */

    static async filterByCat(catId) {

        return new Promise(async (resolve, reject) => {

            // Let's empty the softwares section

            $('#softwares>ul').empty();

            // Let's get the cat from DB

            let currCat = await cat.getById(catId);

            // Let's append cat's DVD element

            $('#softwares>ul').append(`<li data-dvd-number='${currCat.DVDNumber}'><div>
                <i class="material-icons">adjust</i>
                <span>DVD ${currCat.DVDNumber}</span>
            </div><ul class='catWrapper'></ul></li>`);

            // Let's get the current DVD's element

            let currDVDElem = $(`#softwares>ul>li[data-dvd-number=${currCat.DVDNumber}]>ul`);

            // Let's append cat's element

            currDVDElem.append(`<li data-cat-id='${currCat._id}'><div>
                    <i class="material-icons">category</i>
                    <span>${currCat.title}</span>
                </div><ul class='softWrapper'></ul></li>`);

            // Let's get current cat's element

            let currCatElem = $(`#softwares [data-cat-id=${currCat._id}]>ul`);

            // Let's get the current cat's softwares

            let softwares = await software.getSoftwaresByCat(currCat._id);

            // Let's append softwares

            for (let singleSoftware of softwares) {

                // Let's append software's element

                currCatElem.append(`<li data-software-id='${singleSoftware._id}'>
                        <div>
                            <i class="material-icons">insert_drive_file</i>
                            <span>${singleSoftware.title}</span>
                        </div>
                    </li>`);
            }

            // We are finished;)

            // Trigger reload to reload system of slide down and slide up which has been declared in SoftwareStep.js

            $('#softwares').trigger('reload');

            // Let's init software related events(for showing software events)

            this.initSoftwareEvents();

            // We are truly done:)

            resolve();

        });
    }

    /**
     * Filters the softwares section by selected cat
     * @param {Number} DVDNumber - The number of the DVD we are going to filter by
     * @returns {Promise}
     */

    static async filterByDVDNumber(DVDNumber) {

        return new Promise(async (resolve, reject) => {

            // Let's empty the softwares section

            $('#softwares>ul').empty();

            // Let's append DVD's element

            $('#softwares>ul').append(`<li data-dvd-number='${DVDNumber}'><div>
                <i class="material-icons">adjust</i>
                <span>DVD ${DVDNumber}</span>
            </div><ul class='catWrapper'></ul></li>`);

            // Let's get the current DVD's element

            let currDVDElem = $(`#softwares>ul>li[data-dvd-number=${DVDNumber}]>ul`);

            // Let's get the cats of the current DVD

            let cats = await cat.getTitlesByDVDNumber(DVDNumber);

            // Let's append cats

            for (let singleCat of cats) {

                // Let's append cat's element

                currDVDElem.append(`<li data-cat-id='${singleCat._id}'><div>
                    <i class="material-icons">category</i>
                    <span>${singleCat.title}</span>
                </div><ul class='softWrapper'></ul></li>`);

                // Let's get the current cat's element

                let currCatElem = $(`#softwares [data-cat-id=${singleCat._id}]>ul`);

                // Let's get the current cat's softwares

                let softwares = await software.getSoftwaresByCat(singleCat._id);

                // Let's append the softwares of current cat

                for (let singleSoftware of softwares) {

                    // Let's append software's element

                    currCatElem.append(`<li data-software-id='${singleSoftware._id}'>
                        <div>
                            <i class="material-icons">insert_drive_file</i>
                            <span>${singleSoftware.title}</span>
                        </div>
                    </li>`);

                }


            }

            // We are finished;)

            // Trigger reload to reload system of slide down and slide up which has been declared in SoftwareStep.js

            $('#softwares').trigger('reload');

            // Let's init software related events(for showing software events)

            this.initSoftwareEvents();

            // We are truly done:)

            resolve();

        });

    }

    /**
     * Loads DVDs in related selects(With the class of DVDNumbers)
     * @param {Promise}
     */

    static loadDiskNumbers() {

        return new Promise((resolve, reject) => {

            // Let's load the DVDNumbers from DB

            dvd.getDVDNumbers().then((result) => {

                // Let's load DVD numbers into the selects with DVDNumber class

                $('.DVDNumbers').each(function () {

                    // First empty the select

                    $(this).empty();

                    // Let's append the as option in select

                    result.forEach((item) => {
                        $(this).append(`<option value='${item.number}'>${item.number}</option>`);
                    })

                });

                // Triggering the DVDsLoaded event so the DVD's cats select will be loaded

                $('.changableDVD').trigger('DVDsLoaded');

                // We are good to go:)

                resolve();
                
            })
        });
    }

    /**
     * Loads cats in related selects(With the class of catsList)
     */

    static loadCats() {

        return new Promise((resolve, reject) => {

            // Let's get cats from DB

            cat.getAllTitles().then((result) => {

                // Let's append them to all related select

                $('.catsList').each(function () {

                    // Let's empty the select

                    $(this).empty();

                    // Let's append the as option in select

                    result.forEach((item) => {
                        $(this).append(`<option value='${item._id}'>${item.title}</option>`);
                    })

                });

            });

        });
    }

    /**
     * Initiatest the static events related to the PackContent(DVDs, Cats and softwares)
     */

    static initStaticEvents() {

        // Events for add DVD

        $('#add-disk-modal .modalActionButton').click(() => {

            // Let's show the loading

            Loading.showLoading();

            // Let's validate it

            if(Validator.validate($("#add-disk-modal"))){
                Loading.hideLoading();
                PropellerMessage.showMessage('بعضی از فیلدها فاقد اعتبارند.','error');
                return;
            }

            // Let's get all inputs of the add DVD model

            let inputs = $('#add-disk-modal input');

            // Let's add new DVD to DB

            // inputs[0] is DVD number && inputs[1] is DVD content address

            dvd.add(inputs[0].value).then(() => {

                // If it is not willing to get the content of the DVD from the hard disk

                if (inputs[1].value !== '') {

                    // Let's get the content of the DVD from hard disk

                    this.addDVDContentFromFolder(inputs[0].value, inputs[1].value).then(() => {
                        
                        // Let's reload the softwares section(So that new DVD will be appeared)

                        this.load();

                        // Let's hide the add DVD modal

                        $('#add-disk-modal').modal('hide');

                        // We are good to go;)

                        // Let's hide the loading

                        Loading.hideLoading();

                        PropellerMessage.showMessage('محتویات بارگذاری شدند.', 'success');

                    })

                } else {

                    // It is not willing to get the content of the DVD from hard disk

                    // Let's reload the softwares section(So that new DVD will be appeared)

                    this.load();

                    // Let's hide the add DVD modal

                    $('#add-disk-modal').modal('hide');

                    // We are good to go;)

                    // Let's hide the loading

                    Loading.hideLoading();

                    PropellerMessage.showMessage('دی وی دی با موفقیت افزوده شد.', 'success');

                }

                // Let's load the disk numbers in selects so that new DVD will be appeared in selects

                this.loadDiskNumbers();

            }).catch((err) => {

                // Don't know, Don't care:))

                console.log(err)

            })

        })

        // Events for add Cat

        $('#add-cat-modal .modalActionButton').click(() => {

            // Let's show loading

            Loading.showLoading();

            // Let's validate it

            if(Validator.validate($("#add-cat-modal"))){
                Loading.hideLoading();
                PropellerMessage.showMessage('بعضی از فیلدها فاقد اعتبارند.','error');
                return;
            }

            // Let's get the input of the cat model

            let inputs = $('#add-cat-modal input');

            // Let's get the selects of the cat model

            let selects = $('#add-cat-modal select');

            // Let's get the tags of the cat

            let tags = [];

            $('#add-cat-modal .tagsCont>a').each((index, elem) => {
                tags.push(elem.textContent);
            })
            
            // Let's add the cat to the DB

            // inputs[0] is for catTitle, selects[0] is for DVDnumber and tags are the tags array

            cat.add(inputs[0].value, selects[0].value, tags).then(() => {

                //  Let's load the cats so that new cat will be appeared

                this.loadCats();

                // Let's reload the software section tab so that new cat will be appeared

                this.load();

                // Let's trigger DVD related selects so that new cat will be appeared

                $('.changableDVD').trigger('change');

                // Let's hide the loading

                Loading.hideLoading();

                PropellerMessage.showMessage('کتگوری افزوده شد.', 'success');

                // Let's hide the modal

                $('#add-cat-modal').modal('hide');

            }).catch(() => {

                // Don't know, Don't care:)

            })

        });

        // Events for add software

        $('#add-soft-modal .modalActionButton').click(() => {

            // Let's sjow the loading

            Loading.showLoading();

            // Let's validate it

            if(Validator.validate($("#add-soft-modal"))){
                Loading.hideLoading();
                PropellerMessage.showMessage('بعضی از فیلدها فاقد اعتبارند.','error');
                return;
            }

            // Let's get the inputs of the software's modal

            let inputs = $('#add-soft-modal input');

            // Let's get teh selects of the software's modal

            let selects = $('#add-soft-modal select');

            // Let's add tags of the software

            let tags = [];

            $('#add-soft-modal .tagsCont>a').each((index, elem) => {
                tags.push(elem.textContent);
            })

            // Let's add software to the DB

            // inputs[0] is software name, inputs[1] is the software version, selects[0] is DVDNumber, selects[1] is category and tags is the tags

            software.add(inputs[0].value, inputs[1].value, selects[0].value, selects[1].value, tags).then(() => {
                this.load();
                $('#add-soft-modal').modal('hide');

                Loading.hideLoading();
                PropellerMessage.showMessage('نرم افزار افزوده شد.', 'success');

            }).catch(() => {

                // Dont' know, Don't care:)

            })

        });

        // Event for save software

        $('#saveSoftware').off('click').click(() => {

            // Let's show the loading

            Loading.showLoading();

            // Let's save the software to the DB

            this.saveSoftware().then(()=>{

                // It had been saved :-)

                // Reloading the software menu so that new software will be appeared

                this.load();

                // Let's hide the loading

                Loading.hideLoading();

                PropellerMessage.showMessage('تغییرات با موفقیت ذخیره شدند.', 'success');

            })

        })

        // Event for deleting item(DVD, Cat or Software)

        $('#delete-alert-modal .modalActionButton').click(() => {

            // Let's show the loading

            Loading.showLoading();

            // Let's select the item that user selected and wiling to delete

            let itemToDelete = $('#softwareMenu .active').parent();

            // Check whether any item has been selected by the user or not

            if (itemToDelete.length === 0) {

                // There is no selected items

                // We are going to hide loading and tell the user to select one

                Loading.hideLoading();

                PropellerMessage.showMessage('موردی را انتخاب کنید.', 'error');

                // Let's hide the loading

                $('#delete-alert-modal').modal('hide');

                // Out, out:)

                return;
            }

            // Oh, user has selected one item. We are going to handle it!

            // Let's check whether it is a Software, Cat or a DVD

            if ($(itemToDelete).parent().hasClass('softWrapper')) {

                // It is a software

                // Let's get the ID of the selected software

                let softwareID = $(itemToDelete).attr('data-software-id');

                // Let's delete the software from the DB

                software.deleteById(softwareID).then(() => {

                    // Let's reload the software menu so that deleted software will be disappeared

                    this.load();

                    // Let's hide the loading and inform user about successful oporation

                    Loading.hideLoading();

                    PropellerMessage.showMessage('آیتم با موفقیت حذف شد.', 'success');

                    // Happy user :-)

                })
            } else if ($(itemToDelete).parent().hasClass('catWrapper')) {

                // It is a cat

                // Let's get the cat ID

                let catId = $(itemToDelete).attr('data-cat-id');

                // Got it! Let's remove that.

                cat.deleteById(catId).then(() => {

                    // Cat has been removed!

                    // Let's remove it's softwares

                    software.deleteByCat(catId).then(() => {

                        // Hah! Got them!

                        // Let's reload the software menu so that deleted Cat and it's childs(Softwares) disappear:-)

                        this.load();

                        // Let's hide the loading and inform the user about this success

                        Loading.hideLoading();

                        PropellerMessage.showMessage('آیتم با موفقیت حذف شد.', 'success');

                    })
                })
            } else {

                // It is a DVD

                // Let's get the number of selected DVD

                let DVDNumber = $(itemToDelete).attr('data-dvd-number');

                // Let's delete the DVD from the DB.

                dvd.deleteByNumber(DVDNumber).then(() => {

                    // Let's remove the DVD's cats

                    cat.deleteByDVD(DVDNumber).then(() => {

                        // Hah! Got them:)

                        // Let's remove the softwares of the cat

                        software.deleteByDVD(DVDNumber).then(() => {

                            // We got them!

                            // Let's reload the software menu so that deleted dvd and it's childs(Cats & Softwares) will be disappeared

                            this.load();

                            // Let's hide the loading and inform the user about the success:)

                            Loading.hideLoading();

                            PropellerMessage.showMessage('آیتم با موفقیت حذف شد.', 'success');

                        })
                    })
                })
            }

            // Let's hide the delete modal! We got it done dude;)

            $('#delete-alert-modal').modal('hide');

        });

        // Event for editing category

        $('#softwareMenu>footer li:nth-of-type(3)').click(() => {

            // Let's show the loading

            Loading.showLoading();

            // Let's get the ID of the selected Cat

            let id = $('#softwareMenu .active').parent().attr('data-cat-id');

            // Let's load the info of the cat from DB into the modal

            cat.getById(id).then((item) => {

                // Got it!

                // Let's fill the data

                $('#edit-cat-modal input[type=text]').val(item.title);

                $(`#edit-cat-modal option[value=${item.DVDNumber}]`).attr('selected', true);

                // Let's fill in the tags

                let tagCont = $('#edit-cat-modal .tagsCont');

                tagCont.empty();

                for (let tag of item.tags) {
                    tagCont.append(`<a class="list-group-item" href="javascript:void(0);">${tag}</a>`);
                }

                // Got them all;)

                // Let's hide the loading

                Loading.hideLoading();

                // Let's show the edit cat modal

                $('#edit-cat-modal').modal('show');

            });
        });

        // Event for editing the cat

        $('#edit-cat-modal .modalActionButton').click(() => {

            // Let's show the loading

            Loading.showLoading();

            // Let's get the id of the cat

            let id = $('#softwareMenu .active').parent().attr('data-cat-id');

            // Let's get the information of the cat that user filled in

            let title = $('#edit-cat-modal input[type=text]').val();

            let DVDNumber = $('#edit-cat-modal select').val();

            // Let's get the tags of the cat

            let tagsElems = $('#edit-cat-modal .tagsCont>a');
            
            let tags = [];

            for (let tag of tagsElems) {
                tags.push(tag.textContent);
            }

            // Let's edit the cat into DB

            cat.edit(id, title, DVDNumber, tags).then(() => {

                // We DID it!

                // Let's reload the software menu so that edited cat will be edited there

                this.load();

                // Hah! Now let's hide the loading and inform user

                Loading.hideLoading();

                PropellerMessage.showMessage('آیتم با موفقیت ویرایش شد.', 'success');

            })

            // Let's hide the modal

            $('#edit-cat-modal').modal('hide');

        });

        // Event for search software

        $('#softHeaderSliderWrapper>.slideWrapper:nth-of-type(1) button').click(() => {

            // Let's show the loading

            Loading.showLoading();

            // Let's get the search string that user filled in

            let toSearch = $('#softHeaderSliderWrapper>.slideWrapper:nth-of-type(1) input[type=text]').val();

            // Let's do the search

            this.search(toSearch).then(() => {

                // We DID it:)

                // Let's hide the loading

                Loading.hideLoading();

            })
        })

        // Event for filtering by DVDNumber

        $('#softHeaderSliderWrapper>.slideWrapper:nth-of-type(2) button').click(() => {

            // Let's show the loading

            Loading.showLoading();

            // Let's get the DVDNumber that user selected in search bar

            let DVDNumber = $('#softHeaderSliderWrapper>.slideWrapper:nth-of-type(2) select').val();

            // Let's filter softwares by DVDNumber

            this.filterByDVDNumber(DVDNumber).then(() => {

                // Now let's hide the loading

                Loading.hideLoading();

            })
        })

        // Event for filtering softwares by cat

        $('#softHeaderSliderWrapper>.slideWrapper:nth-of-type(3) button').click(() => {

            // Let's show the loading

            Loading.showLoading();

            // Let's get the ID of the cat that user selected in the search bar

            let catId = $('#softHeaderSliderWrapper>.slideWrapper:nth-of-type(3) select').val();

            // Let's filter the softwares by cat

            this.filterByCat(catId).then(()=>{

                // We got it! Let's hide the loading

                Loading.hideLoading();

            })
            
        })

    }

    /**
     * Initiates the events which are related to the software menu
     */

    static initSoftwareEvents() {

        // Little dirty work... Forgive me about it, I have to...

        let that = this;

        // Event for showing the software details

        $('#softwares ul.softWrapper>li').click(function (e) {

            // For stopping Propagation

            e.stopPropagation();

            // Let's show the loading

            Loading.showLoading();

            // Let's get the software id of the selected software

            let softwareId = $(this).attr('data-software-id');

            // Let's get the software details from the DB

            software.getById(softwareId).then((result) => {

                // Let's show the software

                that.showSoftware(result).then(()=>{

                    // Let's hide the blur of the software details wrapper

                    $('.tabWrapper.forSoftware').removeClass('blur');

                    // Let's hide the loading

                    Loading.hideLoading();

                })

            });

        });

    }

    /**
     * Reads the given directory and adds DVD cats and softwares and softwares information from the hard disk
     * @returns {Promise}
     */

    static async addDVDContentFromFolder(DVDNumber, address) {
        return new Promise(async (resolve, reject) => {

            // Let's check whether the address given exists or not

            if (fs.existsSync(address)) {

                // Exists!

                // Let's get the first level directories which are cats directories

                let catsDirectories = fs.readdirSync(address);

                // Let's check each file which appear to be catDirectory

                for (let catDirectory of catsDirectories) {

                    // Check whether it is a directory and it exists or not

                    if (fs.existsSync(path.join(address, catDirectory)) && fs.lstatSync(path.join(address, catDirectory)).isDirectory()) {

                        // It exists and it is a directory

                        // Let's add it to DB

                        let newCat = await cat.add(catDirectory, DVDNumber, []);

                        // Let's get the content of the catDirectory which are softwares

                        let softwaresInTheCat = fs.readdirSync(path.join(address, catDirectory));

                        // Let's check the content of the directory for directories
                        
                        for (let singleSoft of softwaresInTheCat) {

                            if (fs.existsSync(path.join(address, catDirectory, singleSoft)) && fs.lstatSync(path.join(address, catDirectory, singleSoft)).isDirectory()) {
                                
                                // It was a directory and it exists

                                // Let's check whether software image(1.gif) exits in the dirctory or not

                                let softImage = null;

                                if (fs.existsSync(path.join(address, catDirectory, singleSoft, '1.gif'))) {

                                    // It exists

                                    softImage = FileManager.copyToLocale(path.join(address, catDirectory, singleSoft, '1.gif'));

                                }

                                // Lets's check whether software setup(setup.exe) exits in the dirctory or not

                                let setup = null;

                                if (fs.existsSync(path.join(address, catDirectory, singleSoft, 'setup.exe'))) {

                                    // It exists

                                    setup = 'setup.exe';

                                }

                                // Check if gerdoo.txt file exists

                                if (fs.existsSync(path.join(address, catDirectory, singleSoft, 'gerdoo.txt'))) {

                                    // Gerdoo.txt exists

                                    let gerdooText = fs.readFileSync(path.join(address, catDirectory, singleSoft, 'gerdoo.txt'), 'utf8');

                                    // <ig> tag is for installation guide

                                    let igArr = /<ig>((?:.|\s)*)<\/ig>/i.exec(gerdooText);

                                    let ig = "";

                                    if(ig.length >= 2){
                                        ig = igArr[1];
                                    }

                                    // <d> tag is for description

                                    let descArr = /<d>((?:.|\s)*)<\/d>/i.exec(gerdooText);

                                    let desc = "";

                                    if(descArr.length >= 2){
                                        desc = descArr[1];
                                    }

                                    // <s> tag is for supported oses(Seorated by \n)

                                    let supportedOSesArr = /<s>((?:.|\s)*)<\/s>/i.exec(gerdooText);

                                    let supportedOSes = [];

                                    if(supportedOSesArr.legnth >= 2){
                                        supportedOSes = supportedOSesArr[1].trim().split('\n');
                                    }

                                    // Let's convert os names to IDs

                                    let finalOSes = [];

                                    let packOS = window.packOS;

                                    for(let singleOS of supportedOSes){

                                        finalOSes.push((await packOS.getByName(singleOS.trim()))._id);

                                    }

                                    // Let's add the software to the DB

                                    await software.add(singleSoft, null, DVDNumber, newCat._id, [], finalOSes, softImage, setup, `${catDirectory}/${singleSoft}`, null, false, null, desc, null, ig, null, null)

                                } else {

                                    // Gerdoo.txt doesn't exist

                                    // Let's add the software to the DB

                                    await software.add(singleSoft, null, DVDNumber, newCat._id, [], [], softImage, setup, `${catDirectory}/${singleSoft}`, null, false, null, null, null, null, null, null)

                                }
                            }

                        }
                    }


                }

                // We are good to go

                resolve();

            } else {

                // Address doesn't exists

                reject(-1);
            }
        });


    }

    /**
     * This method loads the cats of the DVDNumber when a select containing DVDNumbers change
     */

    static initializeChangableDVDs() {

        // Let's set the event listener for change of the DVDNumber

        $('.changableDVD').off('change DVDsLoaded').on('change DVDsLoaded', function () {

            // DVDNumber select changed!

            // Let's load the cats of the DVD from DB

            cat.getTitlesByDVDNumber($(this).val()).then((result) => {

                // Let's get the select of the cats

                let targetSelect = $(this).parent().parent().next().find('select');

                // Let's empty it

                targetSelect.empty();

                // Let's fill in the cats into the select

                result.forEach((item) => {

                    targetSelect.append(`<option value='${item._id}'>${item.title}</option>`);

                });

                // Let's trigger changed event for the cat select so that we know that it has been filled

                $(targetSelect).trigger('changed');

            });
        });
    }

    /**
     * For showing the details of a software
     * @returns {Promise}
     */

    static async showSoftware(software){

        return new Promise(async(resolve, reject)=>{

            // Let's get the inputs and selects and quill editor boxes

            let inputs = $('.tabWrapper input:not([type=checkbox])');

            let selects = $('.tabWrapper select');

            let quills = $('.tabWrapper .quillEditor>div:first-of-type');

            let textarea = $('.tabWrapper textarea');


            // Let's set the _id of the software for further uses

            $('#generalTab').attr('data-id', software._id);

            // Let's set the name of the software on data-name attribute for further uses

            $('#generalTab').attr('data-name', software.title);

            // Setting the DVD number of the software

            $(selects[0]).find(`[value=${software.DVDNumber}]`).attr('selected', 'true').trigger('change');

            // Setting the cat of the software

            $(selects[1]).on('changed', function () {

                $(this).find(`[value=${software.cat}]`).attr('selected', 'true');

            })

            // Setting the title of the software 

            inputs[0].value = software.title;

            // Setting the version of the software

            inputs[1].value = software.version;

            // Setting the image address of the software

            $('#softwareImageWrapper img').attr('src', software.image);

            // Setting the OSes of the software

            $('.tabWrapper input:checked').attr('checked', false)

            for (let os of software.oses) {
                if (os.trim() != '') {
                    $('.tabWrapper').find(`input[type=checkbox][value=${os}]`).prop('checked', true);
                }
            }

            // Setting the setup address of the software

            inputs[2].value = software.setup;

            // Setting the program address of the software

            let softwareCat = await cat.getById(software.cat);

            inputs[3].value = software.programAddress ? software.programAddress : `${softwareCat.title}/${software.title}`;

            // Setting the tags of the software

            let tagsCont = $('.tabWrapper .tagsCont');

            tagsCont.empty();

            for (let tag of software.tags) {

                tagsCont.append(`<a class="list-group-item" href="javascript:void(0);">${tag}</a>`);

            }

            // Setting remove by click event for tags of the software

            $('.tagsCont>a').off('click').click(function () {

                $(this).remove();
                
            });

            // Setting video address of the software

            inputs[4].value = software.video;

            // Setting isRecommended  of the software

            if (software.isRecommended) {

                $('#isRecommended').prop('checked', true)

            } else {

                $('#isRecommended').prop('checked', false)

            }

            // Setting the faDesc  of the software
            quills[0].innerHTML = software.faDesc;

            // Setting the enDesc of the software

            quills[1].innerHTML = software.enDesc;

            // Setting the fa guide

            quills[2].innerHTML = software.faGuide;

            // Setting the enGuide of the software

            quills[3].innerHTML = software.enGuide;

            // Setting the crack address of the software

            inputs[9].value = software.crack;

            // We are done

            resolve();

        })

    }

    /**
     * For saving a software details in to the DB
     * @returns {Promise}
     */

    static saveSoftware(){

        return new Promise((resolve, reject)=>{

            // Let's validate it

            if(Validator.validate($(".tabWrapper"))){
                Loading.hideLoading();
                PropellerMessage.showMessage('بعضی از فیلدها فاقد اعتبارند.','error');
                return;
            }

            // Let's get the inputs, selects and qull editor boxes

            let inputs = $('.tabWrapper input:not([type=checkbox])');

            let selects = $('.tabWrapper select');

            let quills = $('.tabWrapper .quillEditor>div:first-of-type');

            let textarea = $('.tabWrapper textarea');


            // Let's get the _id of the software

            let id = $('#generalTab').attr('data-id');

            // Getting the DVD number of the software

            let DVDNumber = $(selects[0]).find('option:selected').val();

            // Getting the cat of the software

            let cat = $(selects[1]).find('option:selected').val();

            // Getting the name of the software

            let title = inputs[0].value;

            // Getting the version of the software

            let version = inputs[1].value;

            // Getting the image address of the software

            let image = $('#softwareImageWrapper img').attr('src');

            // Getting the OSes of the software

            let selectedOSes = $('#osList input:checked')

            let oses = [];

            for (let os of selectedOSes) {

                oses.push($(os).val());

            }

            // Getting the setup address of the software

            let setup = inputs[2].value;

            // Getting the program address

            let programAddress = inputs[3].value;

            // Getting the tags of the software

            let tagsElems = $('.tabWrapper .tagsCont>a');

            let tags = [];
            
            for (let tag of tagsElems) {

                tags.push(tag.textContent.trim());

            }

            // Getting video address of the software

            let video = inputs[4].value;

            // Getting isRecommended of the software

            let isRecommended = false;

            if ($('#isRecommended').is(':checked')) {

                isRecommended = true;

            }

            // Getting the faDesc of the software
            let faDesk = quills[0].innerHTML;

            // Getting the enDesc of the software

            let enDesk = quills[1].innerHTML;

            // Getting the faGuide of the software

            let faGuide = quills[2].innerHTML;

            // Getting the enGuide of the software

            let enGuide = quills[3].innerHTML;

            // Getting the crack address of the software

            let crack = inputs[9].value;

            // :et's save the software to the DB

            software.save(id, title, version, DVDNumber, cat, tags, oses, image, setup, programAddress, video, isRecommended, faDesk, enDesk, faGuide, enGuide, crack).then(() => {
                
                // We are good to go

                resolve();

            })
        })
    }

}

// Let's initiate PackContentManager

// It first loads DVDs, Cats & softwares then initiates related events

PackContentManager.load().then(() => {

    PackContentManager.initializeChangableDVDs();

    PackContentManager.loadDiskNumbers();

    PackContentManager.loadCats();

    PackContentManager.initStaticEvents();

})