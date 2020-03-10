<template>
  <b-card-header style="-webkit-app-region: drag; color: #fff;">
    <img class="icon" src="~@/assets/apps.png" /> {{ title }}
    <b-button-group class="window-controls-container">
      <b-button @click="handleMinimize" size="sm" variant="outline-primary" class="window-icon-bg" v-if="minimizable"><div class="window-icon window-minimize"></div></b-button>
      <b-button @click="handleMaximize" size="sm" variant="outline-primary" class="window-icon-bg" v-if="maximizable && !maximized"><div class="window-icon window-maximize"></div></b-button>
      <b-button @click="handleMaximize" size="sm" variant="outline-primary" class="window-icon-bg" v-if="maximizable && maximized"><div class="window-icon window-unmaximize"></div></b-button>
      <b-button @click="handleClose" size="sm" variant="outline-danger" class="window-icon-bg window-close-bg"><div class="window-icon window-close"></div></b-button>
    </b-button-group>
  </b-card-header>
</template>

<script>
import { ipcRenderer, remote } from 'electron';

export default {
  name: 'dialog-header',
  components: {
  },
  props: {
    name : {
      type : String,
      required: true
    }
  },
  data() {
    return {
      isDarwin : process.platform === "darwin",

      maximizable: false,
      minimizable: false,
      resizable: false,
      maximized: false,
      title : "",
      
    }
  },
  created() {
    this.title = this.$route.meta.title;



    ipcRenderer.once("window-state", (event, args) => {
      // console.log(args);
      
      this.minimizable = args.minimizable;
      this.maximizable = args.maximizable;
      this.resizable = args.resizable;
    });
    ipcRenderer.send(this.name + "-window-state");



    let window = remote.getCurrentWindow();
//     this.minimizable = (typeof window.minimizable === "undefined") ? true : window.minimizable;
//     this.maximizable = (typeof window.maximizable === "undefined") ? true : window.maximizable;
//     this.maximized = window.isMaximized();

// console.log("minimizable : {}", this.minimizable);
// console.log("maximizable : {}", this.maximizable);
// console.log("maximized : {}", this.maximized);

    window.on('maximize', () => {
      setTimeout( () => {
        this.maximized = true;
      }, 100);
    });
    window.on('unmaximize', () => {
      setTimeout( () => {
        this.maximized = false;
      }, 100);
    });
  },
  methods: {
    handleMinimize(e) {
        const window = remote.getCurrentWindow();
        window.minimize();
    },
    handleMaximize(e) {
        const window = remote.getCurrentWindow();
        if (!this.maximized) {
            this.maximized = true;
            window.maximize();
        } else {
            this.maximized = false;
            window.unmaximize();
        }
    },
    handleClose(e) {
        const window = remote.getCurrentWindow();
        // console.log(prefs);
        // if(this.layout === "main" && this.prefs.common && this.prefs.common.closeToTray === true) {
        //     // console.log("main page closed...");
        //     window.hide();
        // } else {
        window.close();
        // }
    },
  }
}
</script>

<style scoped>
.icon {
  width: 16px;
  height: 16px;
  margin-left:-6px; margin-top:-2px;
}
.window-controls-container {
    display: flex;
    /* flex-grow: 0; */
    /* flex-shrink: 0; */
    /* text-align: center; */
    /* position: relative; */
    /* z-index: 3000; */
    -webkit-app-region: no-drag;
    height: 26px;
    /* width: 138px; */
    margin-left: auto;
    /* margin-right: 1rem; */
    margin-top: -0.72rem;
    float: right;
}
.window-controls-container>.window-icon-bg {
    display: inline-block;
    -webkit-app-region: no-drag;
    height: 100%;
    /* width: 33.34%; */
    width: 45px;
    border: 1px solid #ccc;
    border-top: 0;
    border-right: 0;
    padding: 0;
}
.window-controls-container>.window-icon-bg:first-child {
    /* border-right: 0; */
    border-top-left-radius: 0;
    /* border-bottom-left-radius: 3px; */
}
.window-controls-container>.window-icon-bg:last-child {
    border-right: 1px solid #ccc;
    border-top-right-radius: 0;
    /* border-bottom-right-radius: 3px; */
}

.window-controls-container .window-icon svg {
    shape-rendering: crispEdges;
    text-align: center
}

.window-controls-container .window-close {
    mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
    -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
}

.window-controls-container .window-unmaximize {
    mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
    -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
}

.window-controls-container .window-maximize {
    mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
    -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
}

.window-controls-container .window-minimize {
    mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4.399V5.5H0V4.399h11z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
    -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4.399V5.5H0V4.399h11z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
}

.window-controls-container .window-icon-bg>.window-icon {
    height: 100%;
    width: 100%;
    mask-size: 23.1%;
    -webkit-mask-size: 23.1%;
    background-color: #cccccc;
}

.window-controls-container .window-icon-bg:hover {
    background-color: hsla(0,0%,100%,.1);
}

.window-controls-container .window-icon-bg:hover {
    background-color: rgba(0,0,0,.3);
}

.window-controls-container .window-icon-bg.window-close-bg:hover {
    background-color: rgba(232,17,35,.8);
}

.window-controls-container .window-icon.window-close:hover {
    background-color: #fff;
}
</style>
