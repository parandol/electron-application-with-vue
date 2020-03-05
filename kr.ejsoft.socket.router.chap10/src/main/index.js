import { app } from 'electron'
import MainWindow from './window/main-window'
import createMainMenu from './window/main-menu'
import SystemTray from './window/tray-manager'
import PreferencesManager from "./window/preferences-manager";
import TCPRouterLauncher from './shared/tcp-router-launcher';

import FontAwesomeWindow from './window/font-awesome';

const autoUpdater = require('electron-updater').autoUpdater

let mainWindow = null;
let mainContents;
function init() {
    mainWindow = MainWindow.create();
    mainWindow.on('closed', () => {
        mainWindow = null
    });


    app.fontawesome = FontAwesomeWindow.getInstance(mainWindow);

    // 메인 메뉴 생성하기
    createMainMenu(mainWindow);

    // 환경설정 관리자
    app.preference = PreferencesManager.getInstance(mainWindow);

    // 시스템 트레이 생성하기
    SystemTray.init(mainWindow);

    // TCP Socket Router 인스턴스 생성
    const launcher = TCPRouterLauncher.getInstance();
    
    // 프로그램 시작시 서비스 자동시작 환경 적용하기
    const prefs = PreferencesManager.getInstance().get();
    if(prefs.common.autoservice) {
        launcher.execute();
    }

    
    mainContents = mainWindow.webContents
    // mainContents.openDevTools()
    autoUpdater.checkForUpdates()
}

app.on('ready', init)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.isQuiting = true;
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        init()
    }
})

app.on('before-quit', (e) => {
    // console.log("before-quit", process.platform);
    app.isQuiting = true;
    // app.quit();
});
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

autoUpdater.on('update-available', function () {
    console.log('A new update is available')
    mainContents.send('updater-message', 'A new update is available')
})
autoUpdater.on('checking-for-update', function () {
    console.log('Checking-for-update')
    mainContents.send('updater-message', 'Checking for Update..')
})
autoUpdater.on('error', function (error) {
    console.log('error')
    console.error(error)
    mainContents.send('updater-message', 'Got Error')
})
autoUpdater.on('download-progress', function (bytesPerSecond, percent, total, transferred) {
    console.log(`${bytesPerSecond}, ${percent}, ${total}, ${transferred}`)
    mainContents.send('updater-message', `download progress : ${bytesPerSecond}, ${percent}, ${total}, ${transferred}`)
})
autoUpdater.on('update-downloaded', function (event) {
    console.log('update-downloaded')
    console.log(event)
    mainContents.send('updater-message', 'update-downloaded')
    autoUpdater.quitAndInstall()
})
  
autoUpdater.on('update-not-available', function () {
    console.log('update-not-available')
    mainContents.send('updater-message', 'update-not-available')
})