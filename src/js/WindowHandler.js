const {
    ipcMain,
    BrowserWindow
} = require('electron');

class WindowHandler {
    constructor() {

        this._mainWindow = null;

        this._windows = [];

        this.initWindowListeners();

    }

    init() { // creates main window

        this._mainWindow = new BrowserWindow({
            width: 940,
            height: 500,
            show: false
        });

        // and load the index.html of the app.
        this._mainWindow.loadURL(`file://${__dirname}/../views/mainPage.html`);

        // Open the DevTools.
        this._mainWindow.webContents.openDevTools();

        // Emitted when the window is closed.
        this._mainWindow.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            this._mainWindow = null;
        });

        this._mainWindow.once('ready-to-show',()=>{
            this._mainWindow.show();
        })

    }

    getMainWindow() {
        return this._mainWindow;
    }

    initWindowListeners() {
        ipcMain.once('newWindow', (event, args) => {
           
            // new window

        });
    }

    newWindow(width, height, view, parent=null, modal=false, arg = {name:"test",value:null}) {
        
        this._windows.push(new BrowserWindow({
            width: width,
            height: height,
            show: false,
            parent,
            modal
        }))

        let currWindow = this._windows[this._windows.length-1];

        // and load the index.html of the app.
        currWindow.loadURL(`file://${__dirname}/../views/${view}?${arg.name}=${arg.value}`);

        // Open the DevTools.
        currWindow.webContents.openDevTools();

        // Emitted when the window is closed.
        currWindow.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            currWindow = null;
        });

        currWindow.once('ready-to-show',()=>{
            currWindow.show();
        })

    }

}

let windowHandler = new WindowHandler();

module.exports = windowHandler;