import { ipcMain } from 'electron'
import TCPRouterManager from '../core/tcp-router-manager'
import PreferencesManager from "../window/preferences-window";

export default (() => {
  class TCPRouterLauncher {
    constructor() {
      this.stateQueue = [];
      this.errorQueue = [];
      this.logQueue = [];
      this.pushRenderer = null;

      this.manager = new TCPRouterManager.getInstance();

      this.bindEvents();
    }

    bindEvents() {
      ipcMain.on("tcp-router-state-init", (event, args) => {
        // console.log(args);
        this.pushRenderer = event.sender;
        if(this.stateQueue.length > 0) {
          while(this.stateQueue.length > 0) {
            const msg = this.stateQueue.shift();
            this.pushRenderer.send("tcp-router-state", msg);
          }
        }
        if(this.logQueue.length > 0) {
          while(this.logQueue.length > 0) {
            const msg = this.logQueue.shift();
            this.pushRenderer.send("tcp-router-log", msg);
          }
        }
        if(this.errorQueue.length > 0) {
          while(this.errorQueue.length > 0) {
            const msg = this.errorQueue.shift();
            this.pushRenderer.send("tcp-router-error", msg);
          }
        }
      });

      ipcMain.once("tcp-router-state-end", (event, args) => {
        // console.log(args);
        this.pushRenderer = null;
      });

      ipcMain.on("tcp-router-state", (event, args) => {
        // console.log(args);
        event.sender.send("tcp-router-state", this.manager.state());
      });

      ipcMain.on("tcp-router-details", (event, args) => {
        // console.log(args);
        event.sender.send("tcp-router-details", this.manager.details(args));
      });

      ipcMain.on("tcp-router-startup", (event, args) => {
        this.execute(() => {
          event.sender.send("tcp-router-state", this.manager.state(args));
        });
      });

      ipcMain.on("tcp-router-shutdown", (event, args) => {
        this.shutdown();
        event.sender.send("tcp-router-state", this.manager.state(args));
      });
      
      this.manager.on("transfered", ({key, bytes}) => {
          if(this.pushRenderer) {
            this.pushRenderer.send("tcp-router-state", this.manager.state());
          }
      });
      this.manager.on("connected", ({key, count}) => {
          if(this.pushRenderer) {
            this.pushRenderer.send("tcp-router-state", this.manager.state());
          }
      });

      this.manager.on("closed", ({key, count}) => {
        if(this.pushRenderer) {
          this.pushRenderer.send("tcp-router-state", this.manager.state());
        }
      });
      this.manager.on("shutdown", () => {
          if(this.pushRenderer) {
            this.pushRenderer.send("tcp-router-shutdown", this.manager.state());
          }
      });

      this.manager.on("error", ({key, error}) => {
        const msg = (error.code == 'EADDRINUSE') ? "Error, listen port(" + error.port + ") already in use." : error;
        if(this.pushRenderer) {
          this.pushRenderer.send("tcp-router-log", { date : new Date().getTime(), text: msg });
          // this.pushRenderer.send("tcp-router-error", msg);
        } else {
          this.errorQueue.push(msg);
        }
      });

      this.manager.on("update", ({key, error}) => {
        if(this.pushRenderer) {
          this.pushRenderer.send("tcp-router-state", this.manager.state());
        } else {
          this.logQueue.push(this.manager.state());
        }
      });

      this.manager.on("log", (log) => { 
        if(this.pushRenderer) {
          // this.pushRenderer.send("tcp-router-state", {type : 'routers', state : this.manager.state()});
          this.pushRenderer.send("tcp-router-log", log);
        } else {
          this.logQueue.push(log);
        }
      });
    }
  
    execute(callback) {
      const preferences = PreferencesManager.get();
      const env = preferences.routers || [];
      
      this.manager.execute(env, (routers) => {
        console.log("TCP Router initialized...")
        if(this.pushRenderer) {
          // this.pushRenderer.send("tcp-router-state", {type : 'routers', state : this.manager.state()});
          this.pushRenderer.send("tcp-router-state", this.manager.state());
        } else {
          this.stateQueue.push(this.manager.state());
        }

        if(callback && typeof callback === "function") {
          callback();
        }
      });
    }

    shutdown() {
      this.manager.shutdown();
    }
  }


  return {
      getInstance() {
          if(!TCPRouterLauncher.instance) {
              TCPRouterLauncher.instance = new TCPRouterLauncher();
          }
          return TCPRouterLauncher.instance;
      }
  };
})();
