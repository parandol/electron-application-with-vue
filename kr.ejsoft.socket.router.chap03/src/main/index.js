import { app, ipcMain } from 'electron'
import MainWindow from './window/main-window'

import TCPRouterManager from './core/tcp-router-manager'
// const TCPRouterManager = require('./core/tcp-router-manager'); 

let mainWindow = null;
function init() {
  mainWindow = MainWindow.create();
  mainWindow.on('closed', () => {
    mainWindow = null
  });


  const errorQueue = [];
  let pushRenderer = null;
  ipcMain.on("tcp-router-state-init", (event, args) => {
    // console.log(args);
    pushRenderer = event.sender;
    if(errorQueue.length > 0) {
      while(errorQueue.length > 0) {
        const msg = errorQueue.shift();
        pushRenderer.send("tcp-router-error", msg);
      }
    }
  });
  ipcMain.once("tcp-router-state-end", (event, args) => {
    // console.log(args);
    pushRenderer = null;
  });



  const env = [
    {
        listen : 3307,
        host : "192.168.1.24",
        port : 3306
    },
    // {
    //     listen : 9010,
    //     host : "localhost",
    //     port : 9090
    // }
];


  const manager = new TCPRouterManager.getInstance();
  manager.on("transfered", ({key, bytes}) => {
      console.log("Transfered-----" + key + " : " + JSON.stringify(bytes));
      if(pushRenderer) {
        pushRenderer.send("tcp-router-state", manager.state());
      }
  });
  manager.on("connected", ({key, count}) => {
      console.log("Connected-----" + key + " : " + JSON.stringify(count));
      if(pushRenderer) {
        pushRenderer.send("tcp-router-state", manager.state());
      }
  });
  manager.on("closed", ({key, count}) => {
      console.log("Closed-----" + key + " : " + JSON.stringify(count));
      if(pushRenderer) {
        pushRenderer.send("tcp-router-state", manager.state());
      }
  });
  manager.on("error", ({key, error}) => {
    console.log("Error-----" + key + " : " + JSON.stringify(error));
    const msg = (error.code == 'EADDRINUSE') ? "Error, listen port(" + error.port + ") already in use." : error;
    if(pushRenderer) {
      pushRenderer.send("tcp-router-error", msg);
    } else {
      errorQueue.push(msg);
    }
  });
  manager.execute(env);




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
