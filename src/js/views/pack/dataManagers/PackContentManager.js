const DVD = require('../../../models/DVD');
const software = require('../../../models/Software');
const cat = require('../../../models/Cat');

class PackContentManager{
    constructor() {

        // loads all the dvds, cats and softwares into the menu

        this.load().then(()=>{

            this.loadDiskNumbers();

            this.initEvents();

        })

    }

    load() {
        return new Promise((resolve, reject) => {
            
            resolve();
            
        })
    }

    /**
     * Loads the number of disks in related comboboxes
     */

    loadDiskNumbers(){
        
        return new Promise((resolve, reject)=>{
            DVD.getDVDNumbers().then((result)=>{
                
                $('.DVDNumbers').each(function(){
                    $(this).empty();
                    result.forEach((item)=>{
                        $(this).append(`<option value='${item.number}'>${item.number}</option>`);
                    })
                });

                resolve();
            })
        });
    }

    initEvents() {

        // events for add dvd

        $('#add-disk-modal .modalActionButton').click(()=>{

            let inputs = $('#add-disk-modal input');

            // inputs[0] is dvd number && inputs[1] is dvd content address

            DVD.add(inputs[0].value).then(()=>{
                this.loadDiskNumbers();
                if(inputs[1].value !== ''){
                    this.addDVDContentFromFolder(inputs[0].value,inputs[1].value);
                }else{
                    $('#add-disk-modal').modal('hide');
                }
                
            }).catch((err)=>{
                console.log(err)
            })

        })

        // events for delete dvd

        // events for add Cat

        $('#add-cat-modal .modalActionButton').click(()=>{

            let inputs = $('#add-cat-modal input');

            let selects = $('#add-cat-modal select');

            let tags = [];

            $('#add-cat-modal .tagsCont>a').each((index,elem)=>{
                tags.push(elem.textContent);
            })

            // inputs[0] is for catTitle, selects[0] is for DVDnumber and tags are the tags array

            cat.add(inputs[0].value, selects[0].value, tags).then(()=>{
                
                $('#add-cat-modal').modal('hide');

            }).catch(()=>{

            })

        });

    }

    addDVDContentFromFolder(DVDNumber, address){

    }
}

new PackContentManager();