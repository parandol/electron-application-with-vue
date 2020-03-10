import { app, BrowserWindow, ipcMain } from 'electron'
import CommonUtils from "../shared/common-utils";
import PreferencesManager from "../window/preferences-manager";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const winURL = process.env.NODE_ENV === 'development'
? `http://localhost:9080`
: `file://${__dirname}/index.html`

// win.loadURL(path.join(__dirname, 'index.html' + to));

const appicon = CommonUtils.icon(64);
const style = {
    width: 800,
    height: 560,
    useContentSize: true,
    icon: appicon,
    frame: false,
    resizable: false,
    minimizable: true,
    maximizable: false,
    useContentSize: true,
    webPreferences : {
        // devTools : false,
        nodeIntegration: true
    },
    show: false
};

class MainWindow {
    constructor () {
        /**
         * Initial window options
         */
        let window = new BrowserWindow(style)
        
        window.loadURL(winURL);

        // 시작시 최소화로 시작 환경설정 적용하기.. show: false 로 시작
        window.once('ready-to-show', () => {
            const prefs = PreferencesManager.getInstance().get();
            if(!prefs.common || !prefs.common.minimizestart || prefs.common.minimizestart == false) {
                window.show();
            }
        });

        // window.on('resize', () => {
        //     const size = window.getSize();
        //     const width = size[0];
        //     const height = size[1];
        //     const maximized = window.isMaximized();
        //     // console.log("width: " + width);
        //     // console.log("height: " + height);
        //     window.webContents.send("window-resized", {
        //         windowid, maximized, width, height
        //     });
        // });


        // window.on('hide', (event) => {
        //     // const prefs = PreferencesManager.getInstance().get();
        //     // if(!app.isQuiting && prefs.common && prefs.common.closeToTray === true) {
        //         console.log("hide....");
        //         // event.preventDefault();
        //         // if(process.platform === "darwin") {
        //         //     window.minimize();
        //         // } else {
        //             // window.hide();
        //         // }
        //     // }
        //     return true;
        // });

        // https://stackoverflow.com/questions/37828758/electron-js-how-to-minimize-close-window-to-system-tray-and-restore-window-back
        window.on('minimize', (event) => {
            const prefs = PreferencesManager.getInstance().get();
            if(prefs.common && prefs.common.minimizeToTray === true) {
                // console.log("minimize....");
                event.preventDefault();
                // if(process.platform === "darwin") {
                //     window.minimize();
                // } else {
                    window.close();
                    event.returnValue = false;
                // }
            }
            return false;
        });

        window.on('close', (event) => {
            const prefs = PreferencesManager.getInstance().get();
            if(!app.isQuiting && prefs.common && prefs.common.closeToTray === true) {
                // console.log("close....");
                event.preventDefault();
                // if(process.platform === "darwin") {
                //     window.minimize();
                // } else {
                    window.hide();
                    event.returnValue = false;
                // }
            }
            return false;
        });

        window.on("closed", () => {
            // app.PAGE_CLIENT_MAP = app.PAGE_CLIENT_MAP || new Map();
            // const client = app.PAGE_CLIENT_MAP.get(windowid);
            // if(client) {
            //     client.shutdown({ windowid });
            // }
            // app.windows.delete(window.windowid);
        });

        ipcMain.on("main-window-state", (event, data) => {
            // console.log(style.minimizable);
            // console.log(style.maximizable);
            // console.log(style.resizable);
            event.sender.send("window-state", {
                minimizable: style.minimizable,
                maximizable: style.maximizable,
                resizable: style.resizable,
            });
        });


        this.mainWindow = window;
    }

    get() {
        return this.mainWindow;
    }

    static create () {
        return new MainWindow().get();
    }
}

export default MainWindow;