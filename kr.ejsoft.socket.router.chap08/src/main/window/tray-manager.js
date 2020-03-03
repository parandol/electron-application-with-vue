import { app, Tray, Menu } from "electron";
import CommonUtils from "../shared/common-utils";
// const fs = require("fs");
// const path = require("path");


export default (() => {
    class TrayManager {
        constructor(win) {
            this.win = win;

            const menu = Menu.buildFromTemplate([
                {
                    label: "Show Application",
                    click : () => {
                        this.win.show();
                    }
                },
                {
                    label : "Preferences",
                    click : () => {
                        // console.log("Preference....");
                        if(app.preference) app.preference.show();
                    }
                },
                {
                    type : "separator"
                },
                {
                    label : "Quit",
                    click : () => {
                        app.isQuiting = true;
                        app.quit();
                    }
                }
            ]);

            const trayicon = CommonUtils.icon(16);
            let tray = new Tray(trayicon);
            tray.setToolTip("TCP Socket Router");
            tray.setContextMenu(menu);

            tray.on("double-click", () => {
                this.win.show();
            });

            this.tray = tray;
        }
    }


    return {
        init(win) {
            if(!TrayManager.instance) {
                if(!win) {
                    throw new Error("윈도우 객체의 인스턴스가 필요합니다.");
                }
                TrayManager.instance = new TrayManager(win);
            }
            return TrayManager.instance;
        }
    };
})();

