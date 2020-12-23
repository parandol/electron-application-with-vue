import { app, BrowserWindow } from 'electron'
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

class MainWindow {
    constructor () {
        /**
         * Initial window options
         */
        const appicon = CommonUtils.icon(64);
        let window = new BrowserWindow({
            width: 800,
            height: 540,
            title: 'TCP Socket Router',
            useContentSize: true,
            icon: appicon,
            resizable: false,
            minimizable: true,
            maximizable: false,
            useContentSize: true,
            webPreferences : {
                devTools : false,
            },
            show: false
        })
        
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

        // https://stackoverflow.com/questions/37828758/electron-js-how-to-minimize-close-window-to-system-tray-and-restore-window-back
        window.on('minimize', (event) => {
            const prefs = PreferencesManager.getInstance().get();
            if(prefs.common && prefs.common.minimizeToTray === true) {
                event.preventDefault();
                if(process.platform === "darwin") {
                    window.hide();
                } else {
                    window.hide();
                }
            }
        });

        window.on('close', (event) => {
            const prefs = PreferencesManager.getInstance().get();
            if(!app.isQuiting && prefs.common && prefs.common.closeToTray === true) {
                event.preventDefault();
                if(process.platform === "darwin") {
                    window.hide();
                } else {
                    window.hide();
                }
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