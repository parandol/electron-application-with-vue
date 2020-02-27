import { app, ipcMain } from 'electron'
import MainWindow from './window/main-window'

import launchTCPRouter from './shared/tcp-router-launcher'
// const TCPRouterManager = require('./core/tcp-router-manager'); 

let mainWindow = null;
function init() {
  mainWindow = MainWindow.create();
  mainWindow.on('closed', () => {
    mainWindow = null
  });

  // launchTCPRouter();
  TCPRouterLauncher.getInstance().execute();
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
