import { BrowserWindow, ipcMain, dialog } from "electron";
import CommonUtils from "../shared/common-utils";

const iswin = process.platform === "win32";

const winURL = process.env.NODE_ENV === "development"
    ? `http://localhost:9080/#/fontawesome`
    : `file://${__dirname}/fontawesome.html`;

export default (() => {
    class FontAwesomeWindow {
        constructor(win) {
            this.win = win;
            this.prefsWindow = null;

            ipcMain.on("open-fontawesome-window", (event, data) => {
                this.show();
            });
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
                // modal: true,
                width: 800,
                height: 600,
                // frame: false,
                resizable: true,
                minimizable: false,
                maximizable: true,
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
            if(!FontAwesomeWindow.instance) {
                if(!win) {
                    throw new Error("윈도우 객체의 인스턴스가 필요합니다.");
                }
                FontAwesomeWindow.instance = new FontAwesomeWindow(win);
            }
            return FontAwesomeWindow.instance;
        }
    };
})();
