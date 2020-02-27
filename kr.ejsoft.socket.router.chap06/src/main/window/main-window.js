import { BrowserWindow } from 'electron'
import CommonUtils from "../shared/common-utils";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const winURL = process.env.NODE_ENV === 'development'
? `http://localhost:9080`
: `file://${__dirname}/index.html`

class MainWindow {
  constructor () {
    /**
     * Initial window options
     */
    const appicon = CommonUtils.icon(64);
    let window = new BrowserWindow({
      width: 800,
      height: 540,
      useContentSize: true,
      icon: appicon,
    })
  
    window.loadURL(winURL)
    // window.on('closed', () => {
    //   window = null
    // })

    this.mainWindow = window;
  }

  get() {
    return this.mainWindow;
  }

  static create () {
    return new MainWindow().get();
  }
}

export default MainWindow;