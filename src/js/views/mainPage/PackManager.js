const {ipcRenderer} = require('electron');

class PackManager{

    constructor(){

        this.getPacks().then(()=>{

            this.initEvents();

        })

    }

    getPacks(){
        return new Promise((resolve, reject)=>{

            // ipcRenderer.send('getPacks');
            resolve();
        })
    }

    initEvents(){

        // add events

        $('.addPack').off('click').click(()=>{

            console.log('click')

            this.addPack();

        });

        // edit events

        // delete events


    }

    addPack(){
        ipcRenderer.send('newWindow',{
            width: 1300,
            height: 650,
            modal:true,
            fullscreen:true,
            parent: 'main',
            view:'addPack.html'
        });
    }

}

new PackManager();