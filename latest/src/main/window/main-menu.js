import { app, Menu, BrowserWindow, dialog, clipboard } from "electron";
import TCPRouterLauncher from '../shared/tcp-router-launcher';

const path = require("path");


// function handlePaste() {
//     console.log("Paste 00", clipboard);

//     const filePath = clipboard.read('public.file-url').replace('file://', '');
//     console.log("Paste 001", filePath);

//     const text = clipboard.readText();
//     console.log("Paste 002", text);

//     const rawFilePath = clipboard.read('FileNameW');
//     const filePath2 = rawFilePath.replace(new RegExp(String.fromCharCode(0), 'g'), '');
//     console.log("Paste 003", rawFilePath);
//     console.log("Paste 004", filePath2);

//     const rawFilePath2 = clipboard.read('FileName');
//     const filePath3 = rawFilePath.replace(new RegExp(String.fromCharCode(0), 'g'), '');
//     console.log("Paste 005", rawFilePath2);
//     console.log("Paste 006", filePath3.toString("ksc5601"));

//     const focusedWin = BrowserWindow.getFocusedWindow();
// }
const isMac = process.platform === 'darwin'

function createMainMenu(window) {
    const template = [
        ...(isMac ? [{
            label: app.name,
            submenu: [
              { role: 'about' },
              { type : "separator" },
              {
                  label : "Preferences",
                  accelerator: 'CmdOrCtrl+P',
                  click : () => {
                      // console.log("Preference....");
                      if(app.preference) app.preference.show();
                  }
              },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideothers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }] : []),
          ...(!isMac ? [{
            label: 'File',
            submenu: [
                // { type : "separator" },
                {
                    label : "Preferences",
                    accelerator: 'CmdOrCtrl+P',
                    click : () => {
                        // console.log("Preference....");
                        if(app.preference) app.preference.show();
                    }
                },
                (!isMac ? { type : "separator" } : {visible:false}),
                // , isMac ? { role: 'close' } : { role: 'quit' }
                (!isMac ? {
                    label : "Exit",
                    click : () => {
                        app.isQuiting = true;
                        app.quit();
                    }
                } : {visible:false}),
            ],
        }] : []),
        {
            label: "Edit",
            submenu: [
                // { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
                // { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
                // { type: "separator" },
                { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
                { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
            ]
        },
        {
            label: 'Service',
            submenu: [
                {
                    label: 'Startup',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        TCPRouterLauncher.getInstance().execute();
                    }
                },
                {
                    label: 'Shutdown',
                    accelerator: 'CmdOrCtrl+D',
                    click: () => {
                        TCPRouterLauncher.getInstance().shutdown();
                    }
                }
            ],
        },
        ...(!isMac ? [{
            label: 'Window',
            submenu: [
                {
                    role: "minimize"
                },
                // {
                //     label: 'Minimize',
                //     // accelerator: 'CmdOrCtrl+M',
                //     click: (item, focusedWindow) => {
                //         focusedWindow.minimize();
                //     }
                // },
                // {
                //     role: "hide"
                // },
                {
                    role: "hide"
                    // label: 'Hide',
                    // // accelerator: 'CmdOrCtrl+H',
                    // click: (item, focusedWindow) => {
                    //     focusedWindow.hide();
                    // }
                },
            ],
        },
        {
            label: 'Help',
            submenu: [
                // { label: 'About App', selector: 'orderFrontStandardAboutPanel:' },
                { type : "separator" },
                {
                    label : "Toggle Developter Tools",
                    accelerator : process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
                    // role : "toggledevtools"
                    click : (item, focusedWindow) => {
                        if(focusedWindow) {
                            focusedWindow.toggleDevTools();
                        }
                    }
                }
            ],
        }] : []),
    ];

/*
    if(process.platform === "darwin") {
        template.unshift({
            label: app.getName(),
            submenu : [
                { role: "about" },
                { type: "separator" },
                {
                    label : "Preferences",
                    accelerator: 'CmdOrCtrl+P',
                    click : () => {
                        // console.log("Preference....");
                        if(app.preference) app.preference.show();
                    }
                },
                { type: "separator" },
                { role: "services", submenu: [] },
                { type: "separator" },
                { role: "hide" },
                { role: "hideothers" },
                { role: "unhide" },
                { type : "separator" },
                // { role: "quit" },
                {
                    label : "Quit",
                    accelerator: "CmdOrCtrl+Q",
                    click: () => {
                        app.isQuiting = true;
                        app.quit();
                    }
                }
            ]
        });

        // template.push({
        //     role: "window",
        //     submenu: [
        //         {role: "minimize"},
        //         {role : "zoom"}
        //     ]
        // });
    } else {

        // template.unshift();
    }
*/
    const appMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(appMenu);
}


export default createMainMenu;
