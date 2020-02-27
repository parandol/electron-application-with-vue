import { BrowserWindow, ipcMain, dialog } from "electron";
import CommonUtils from "../shared/common-utils";

const iswin = process.platform === "win32";

// https://www.npmjs.com/package/preferences
const Preferences = require("preferences");

const winURL = process.env.NODE_ENV === "development"
    ? `http://localhost:9080/#/preferences`
    : `file://${__dirname}/preferences.html`;

export default (() => {
    class PreferencesManager {
        constructor(win) {
            this.win = win;
            this.prefsWindow = null;

            this.preferences = new Preferences("kr.ejsoft.tcp.router", {
                common : {
                    deviceName : "",
                    executeMode : "server",
                    executeHost : "localhost",
                    executePort : 8081,
                    outputPath : "",
                    maxTransfer : 5,
                    autostartup: true,
                    minimizestart: false,
                    autoservice: true,
                    minimizeToTray: true,
                    closeToTray: true,
                    retryconnect: 3,
                },
                routers : [
                    {
                        listen : 3307,
                        host : "192.168.1.24",
                        port : 3306
                    },
                    {
                        listen : 9010,
                        host : "localhost",
                        port : 9090
                    },
                    {
                        listen : 9020,
                        host : "127.0.0.1",
                        port : 9090
                    }
                ]
            }, {
                encrypt: true
            });

            ipcMain.on("open-preperences", (event, data) => {
                this.show();
            });

            ipcMain.on("request-preferences", (event, data) => {
                // const target = (data.target === "prefs") ? this.prefsWindow : this.win;
                const target = event.sender;
                // console.log("REQUEST_PREFERENCES", prefs);
                target.webContents.send("response-preferences", this.preferences);
            });

            ipcMain.on("save-preferences", (event, data) => {
                Object.keys(data).forEach((key) => {
                    this.preferences[key] = data[key];
                });
                // console.log("SAVE_PREFERENCES", prefs);
                this.preferences.save();

                this.win.webContents.send("changed-preferences", this.preferences);
                this.prefsWindow.webContents.send("changed-preferences", this.preferences);
            });
        }

        get() {
            return this.preferences;
        }

        show() {
            if(this.visible === true && this.prefsWindow) {
                this.prefsWindow.show();
                return;
            }
            
            const appicon = CommonUtils.icon(64);
            const style = {
                parent: this.win,
                icon: appicon,
                modal: true,
                width: 600,
                height: 360,
                // frame: false,
                resizable: false,
                minimizable: false,
                maximizable: false,
                useContentSize: true,
                webPreferences : {
                    // devTools : false,
                }
            };
            switch(process.platform) {
            case "darwin":
                style.frame = true;
                style.maximizable = false;
                break;
            default:
            }

            this.prefsWindow = new BrowserWindow(style);

            this.prefsWindow.loadURL(winURL);
            // dialog.once('ready-to-show', () => {
            //     dialog.show();
            // });
            this.prefsWindow.setMenu(null);

            this.prefsWindow.on("closed", () => {
                // null;
                this.visible = false;
                this.prefsWindow = null;
            });

            this.visible = true;
        }
    }

    return {
        getInstance(win) {
            if(!PreferencesManager.instance) {
                if(!win) {
                    throw new Error("윈도우 객체의 인스턴스가 필요합니다.");
                }
                PreferencesManager.instance = new PreferencesManager(win);
            }
            return PreferencesManager.instance;
        },
        get() {
            if(!PreferencesManager.instance) {
                throw new Error("환경설정관리자의 초기화가 먼저 필요합니다.");
            }
            const inst = PreferencesManager.instance;
            return inst.get();
        },
        show() {
            if(!PreferencesManager.instance) {
                throw new Error("환경설정관리자의 초기화가 먼저 필요합니다.");
            }
            const inst = PreferencesManager.instance;
            return inst.show();
        }
    };
})();
