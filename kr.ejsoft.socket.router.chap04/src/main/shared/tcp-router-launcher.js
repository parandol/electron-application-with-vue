import { ipcMain } from 'electron'
import TCPRouterManager from '../core/tcp-router-manager'
import PreferencesManager from "./window/preferences-window";

  

const preferences = PreferencesManager.get();
const env = preferences.routers || [];


function launchTCPRouter() {
  
  const manager = new TCPRouterManager.getInstance();
  const stateQueue = [];
  const errorQueue = [];
  const logQueue = [];
  let pushRenderer = null;
  ipcMain.on("tcp-router-state-init", (event, args) => {
    // console.log(args);
    pushRenderer = event.sender;
    if(stateQueue.length > 0) {
      while(stateQueue.length > 0) {
        const msg = stateQueue.shift();
        pushRenderer.send("tcp-router-state", msg);
      }
    }
    if(logQueue.length > 0) {
      while(logQueue.length > 0) {
        const msg = logQueue.shift();
        pushRenderer.send("tcp-router-log", msg);
      }
    }
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


  manager.on("transfered", ({key, bytes}) => {
      // console.log("Transfered-----" + key + " : " + JSON.stringify(bytes));
      if(pushRenderer) {
        pushRenderer.send("tcp-router-state", manager.state());
      }
  });
  manager.on("connected", ({key, count}) => {
      // console.log("Connected-----" + key + " : " + JSON.stringify(count));
      if(pushRenderer) {
        pushRenderer.send("tcp-router-state", manager.state());
      }
  });
  manager.on("closed", ({key, count}) => {
      // console.log("Closed-----" + key + " : " + JSON.stringify(count));
      if(pushRenderer) {
        pushRenderer.send("tcp-router-state", manager.state());
      }
  });
  manager.on("error", ({key, error}) => {
    // console.log("Error-----" + key + " : " + JSON.stringify(error));
    const msg = (error.code == 'EADDRINUSE') ? "Error, listen port(" + error.port + ") already in use." : error;
    if(pushRenderer) {
      pushRenderer.send("tcp-router-log", { date : new Date().getTime(), text: msg });
      // pushRenderer.send("tcp-router-error", msg);
    } else {
      errorQueue.push(msg);
    }
  });
  manager.on("update", ({key, error}) => {
    if(pushRenderer) {
      // pushRenderer.send("tcp-router-state", {type : 'routers', state : manager.state()});
      pushRenderer.send("tcp-router-state", manager.state());
    } else {
      logQueue.push(manager.state());
    }
  });
  manager.on("log", (log) => { 
    if(pushRenderer) {
      // pushRenderer.send("tcp-router-state", {type : 'routers', state : manager.state()});
      pushRenderer.send("tcp-router-log", log);
    } else {
      logQueue.push(log);
    }
  });
  manager.execute(env, (routers) => {
    console.log("TCP Router initialized...")
    if(pushRenderer) {
      // pushRenderer.send("tcp-router-state", {type : 'routers', state : manager.state()});
      pushRenderer.send("tcp-router-state", manager.state());
    } else {
      stateQueue.push(manager.state());
    }
  });

  ipcMain.on("tcp-router-state", (event, args) => {
    // console.log(args);
    event.sender.send("tcp-router-state", manager.state());
  });
  ipcMain.on("tcp-router-details", (event, args) => {
    // console.log(args);
    event.sender.send("tcp-router-details", manager.details(args));
  });

  ipcMain.on("tcp-router-startup", (event, args) => {
    manager.startup(env, () => {
      event.sender.send("tcp-router-state", manager.state(args));
    });
  });
  ipcMain.on("tcp-router-shutdown", (event, args) => {
    manager.shutdown();
    event.sender.send("tcp-router-state", manager.state(args));
  });
}
export default launchTCPRouter;