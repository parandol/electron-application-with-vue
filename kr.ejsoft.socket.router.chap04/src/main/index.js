import { app, ipcMain } from 'electron'
import MainWindow from './window/main-window'

import PreferencesManager from "./window/preferences-window";
import launchTCPRouter from './shared/tcp-router-launcher'
// const TCPRouterManager = require('./core/tcp-router-manager'); 

let mainWindow = null;
function init() {
  mainWindow = MainWindow.create();
  mainWindow.on('closed', () => {
    mainWindow = null
  });



  // // 환경설정 관리자
  app.preference = PreferencesManager.getInstance(mainWindow);

  launchTCPRouter();
  
  // // const prefs = PreferencesManager.getInstance().get();
  // ipcMain.on("open-configuration", (event, args) => {
  //   // console.log(args);
  //   PreferencesManager.show();
  // });


  // ipcMain.on("request-message", (event, args) => {
  //   console.log(args);
  //   event.sender.send("response-message", "This is a Server Message.");
  // });

  // let pushIndex = 0;
  // let pushRenderer = null;
  // // let timer = null;
  // ipcMain.on("push-ipc-init", (event, args) => {
  //   // console.log(args);
  //   pushRenderer = event.sender;
    
  //   if(!timer) {
  //     timer = setInterval(() => {
  //       pushIndex++;
  //       if(pushRenderer) {
  //         pushRenderer.send("push-ipc-message", "Push message at " + pushIndex);
  //       }
  //     }, 1000);
  //   }
  //   // event.sender.send("push-ipc-init-res", "Initialize successfully..");
  // });
  // ipcMain.once("push-ipc-end", (event, args) => {
  //   // console.log(args);
  //   if(timer) clearInterval(timer);
  //   // event.sender.send("push-ipc-end-res", "Terminate successfully..");
  // });
}

app.on('ready', init)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    init()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
