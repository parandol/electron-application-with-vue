<template>
  <div class="h-100">
  <b-card no-body class="h-100 main-wrapper" @click="clearActiveItem">
    <DialogHeader name="main"></DialogHeader>
    <b-card-body style="margin-bottom:70px;">
    <div class="row h-100">
      <div class="col-md-6 h-100">
        <b-card no-body class="h-100">
          <b-card-header>TCP Router Connections</b-card-header>
          <b-card-body>
            <div class="items overflow-y">
              <div class="item" v-for="(item, key) in tcpRouterState"
                :key="key"
                :class="{'selected': activeItem[key]}"
                @click.prevent.stop="setActiveItem(key)"
              >
                <div class="nodes">
                  <div class="title">
                    {{ item.name }}
                  </div>
                  <div class="name">
                    <font-awesome-icon :icon="['fas', 'bezier-curve']" /> {{ item.listen }}
                    , <font-awesome-icon :icon="['fas', 'cloud']" /> {{item.host}}:{{item.port}}
                    , <font-awesome-icon :icon="['fas', 'link']" /> {{ item.count | currency }}
                  </div>
                  <div class="labels">
                    <div class="bytes">{{ item.bytes.clientWriteBytes | prettyBytes }}</div>
                    <div class="bytes">{{ item.bytes.serverReadBytes | prettyBytes }}</div>
                  </div>
                  <div>
                    <b-icon icon="display" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="arrow-left-right" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="terminal" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="arrow-left-right" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="cloud" font-scale="2" class="node-icon align-middle"></b-icon>
                  </div>
                  <div class="labels">
                    <div class="bytes">{{ item.bytes.clientReadBytes | prettyBytes }}</div>
                    <div class="bytes">{{ item.bytes.serverWriteBytes | prettyBytes }}</div>
                  </div>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </div>

      <div class="col-md-6 h-100" v-if="selectedItem && selectedState">
        <b-card no-body class="h-100">
          <b-card-header>Connection Details</b-card-header>
          <b-card-body>
            <div class="details overflow-y">
              <div class="nodes">
                <div class="title">
                  {{ selectedState.name }}
                  , <font-awesome-icon :icon="['fas', 'link']" /> {{ selectedState.count | currency }}
                </div>
                <!--
                <div class="name">
                  <font-awesome-icon :icon="['fas', 'bezier-curve']" /> {{ selectedState.listen }}
                  , <font-awesome-icon :icon="['fas', 'cloud']" /> {{selectedState.host}}:{{selectedState.port}}
                  , <font-awesome-icon :icon="['fas', 'link']" /> {{ selectedState.count | currency }}
                </div>
                <div class="labels">
                  <div class="bytes">{{ selectedState.bytes.clientWriteBytes | prettyBytes }}</div>
                  <div class="bytes">{{ selectedState.bytes.serverReadBytes | prettyBytes }}</div>
                </div>
                <div>
                  <b-icon icon="display" font-scale="2" class="node-icon align-middle"></b-icon>
                  <b-icon icon="arrow-left-right" font-scale="2" class="node-icon align-middle"></b-icon>
                  <b-icon icon="terminal" font-scale="2" class="node-icon align-middle"></b-icon>
                  <b-icon icon="arrow-left-right" font-scale="2" class="node-icon align-middle"></b-icon>
                  <b-icon icon="cloud" font-scale="2" class="node-icon align-middle"></b-icon>
                </div>
                <div class="labels">
                  <div class="bytes">{{ selectedState.bytes.clientReadBytes | prettyBytes }}</div>
                  <div class="bytes">{{ selectedState.bytes.serverWriteBytes | prettyBytes }}</div>
                </div>
                -->
              </div>

<!--
                <div class="nodes">
                  <div class="title name"><font-awesome-icon :icon="['fas', 'link']" /> aaabbbccd : 8081</div>
                  <div class="labels">
                    <div class="bytes">{{ 13123123 | prettyBytes }}</div>
                    <div class="bytes">{{ 234234234 | prettyBytes }}</div>
                  </div>
                  <div>
                    <b-icon icon="display" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="arrow-left-right" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="terminal" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="arrow-left-right" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="cloud" font-scale="2" class="node-icon align-middle"></b-icon>
                  </div>
                  <div class="labels">
                    <div class="bytes">{{ 362362345 | prettyBytes }}</div>
                    <div class="bytes">{{ 9287337 | prettyBytes }}</div>
                  </div>
                </div>
                <div class="nodes">
                  <div class="title name"><font-awesome-icon :icon="['fas', 'link']" /> aaabbbccd : 8081</div>
                  <div class="labels">
                    <div class="bytes">{{ 13123123 | prettyBytes }}</div>
                    <div class="bytes">{{ 234234234 | prettyBytes }}</div>
                  </div>
                  <div>
                    <b-icon icon="display" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="arrow-left-right" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="terminal" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="arrow-left-right" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="cloud" font-scale="2" class="node-icon align-middle"></b-icon>
                  </div>
                  <div class="labels">
                    <div class="bytes">{{ 362362345 | prettyBytes }}</div>
                    <div class="bytes">{{ 9287337 | prettyBytes }}</div>
                  </div>
                </div>
-->

              <!-- <div class="value"> -->
                <div class="nodes" v-for="(detail, index) in selectedItem" :key="index">
                  <div class="title name"><font-awesome-icon :icon="['fas', 'link']" /> {{ detail.address }} : {{ detail.port }}</div>
                  <div class="labels">
                    <div class="bytes">{{ detail.clientWriteBytes | prettyBytes }}</div>
                    <div class="bytes">{{ detail.serverReadBytes | prettyBytes }}</div>
                  </div>
                  <div>
                    <b-icon icon="display" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="arrow-left-right" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="terminal" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="arrow-left-right" font-scale="2" class="node-icon align-middle"></b-icon>
                    <b-icon icon="cloud" font-scale="2" class="node-icon align-middle"></b-icon>
                  </div>
                  <div class="labels">
                    <div class="bytes">{{ detail.clientReadBytes | prettyBytes }}</div>
                    <div class="bytes">{{ detail.serverWriteBytes | prettyBytes }}</div>
                  </div>
                </div>
              <!-- </div> -->
            </div>
          </b-card-body>
        </b-card>
      </div>

      <div class="col-md-6 h-100" v-show="!selectedItem">
        <b-card no-body class="h-100">
          <b-card-header>Event Log</b-card-header>
          <b-card-body>
            <div class="logs overflow-y" ref="logs">
              <div class="log" v-for="(log, index) in logs" :key="index">
                <span class="event-date">{{ log.date }}</span> : <span>{{ log.text }}</span>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </div>
    </div>
    </b-card-body>
    <b-card-footer>
    <div class="row">
      <div class="col-md-5 text-left">
        <b-button pill variant="primary" @click="handleStartup"><b-icon icon="play" font-scale="2" class="align-middle"></b-icon> Start</b-button>
        <b-button pill variant="secondary" @click="handleShutdown"><b-icon icon="stop" font-scale="2" class="align-middle"></b-icon> Shutdown</b-button>
        
      </div>
      <div class="col-md-7 text-right">
        <b-button pill variant="info" @click="handleFontawesome"><b-icon icon="bootstrap" font-scale="2" class="align-middle"></b-icon></b-button>
        <!-- <b-button pill variant="info" @click="handleUpdateNow"><b-icon icon="cloud-download" font-scale="2" class="align-middle"></b-icon></b-button> -->
        <b-button pill variant="warning" @click="handleClearLog"><b-icon icon="trash" font-scale="2" class="align-middle"></b-icon> Clear Log</b-button>
        <b-button pill variant="success" @click="handlePreferences"><b-icon icon="gear" font-scale="2" class="align-middle"></b-icon> Preferences</b-button>
      </div>
    </div>
    </b-card-footer>
  </b-card>
  
  <UpdateToast
    ref="updateToast"
    :auto-check="preferences.update.autoCheck"
    :auto-download="preferences.update.autoDownload"
    :auto-install="preferences.update.autoInstall"
    v-if="preferences.update.autoUpdateUI"
  ></UpdateToast>
  </div>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
//const { remote } = require('electron')
// import { DialogHeader } from '../components/DialogHeader'
const DialogHeader = require('../components/DialogHeader').default;
const UpdateToast = require('../components/UpdateToast').default;

const { Menu, MenuItem } = remote

// const menu = new Menu()
// menu.append(new MenuItem({ label: 'MenuItem1', click() { console.log('item 1 clicked') } }))
// menu.append(new MenuItem({ type: 'separator' }))
// menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))
// window.addEventListener('contextmenu', (e) => {
//   e.preventDefault()
//   menu.popup({ window: remote.getCurrentWindow() })
// }, false)

export default {
  name: 'main-page',
  components: {
    DialogHeader, UpdateToast
  },
  data() {
    return {
      isDarwin : process.platform === "darwin",
      maximized: false,

      preferences: {
        update:{
          autoUpdateUI: true,
          autoCheck: false,
          autoDownload: false,
          autoInstall: false,
        }
      },

      tcpRouterState: {},
      activeItem: {},
      selectedItem: null,
      selectedState: null,
      logs: [],

    }
  },
  created() {
    ipcRenderer.on("response-preferences", (event, args) => {
      // console.log(args);
      for(const key in args) {
        this.preferences[key] = args[key];
      };

      this.$refs.updateToast.updateProps();
    });
    // ipcRenderer.on("changed-preferences", (event, args) => {
    //   // console.log(args);
    //   for(const key in args) {
    //     this.preferences[key] = args[key];
    //   };
    // });
    
    ipcRenderer.send("request-preferences");

    // TCP Socket Router State
    ipcRenderer.on("tcp-router-state", (event, args) => {
      // console.log(args);
      this.tcpRouterState = args;
      for(const key in this.activeItem) {
        if(key) {
          this.showDetails(key);
          break;
        }
      }
    });

    // TCP Socket Event Log
    ipcRenderer.on("tcp-router-log", (event, log) => {
      // console.log(log);
      this.addLog(log);
    });

    // TCP Socket Router Shutdown Event
    ipcRenderer.on("tcp-router-shutdown", (event) => {
      ipcRenderer.send("tcp-router-state");
    });
    
    // Init ipcRenderer
    ipcRenderer.send("tcp-router-state-init");

    // request current State
    ipcRenderer.send("tcp-router-state");

    // Context menu(Right button)
    const _this = this;
    const menu = new Menu()
    menu.append(new MenuItem({ label: 'Clear Log', click() { _this.handleClearLog(); } }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: 'Preferences', click() { _this.handlePreferences(); } }))
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      menu.popup({ window: remote.getCurrentWindow() })
    }, false)
  },
  mounted() {
    // if(this.autoCheck) {
    //   this.handleUpdateNow();
    // }
  },
  destroyed() {
    // Destroy ipcRenderer
    ipcRenderer.send("tcp-router-state-end", "");
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    handleUpdateNow() {
      // console.log("handleUpdateNow..................")
      ipcRenderer.send("update-check-now", "");
    },
    setActiveItem(key) {
      // console.log(JSON.stringify(this.activeItem));
      // if (this.activeItem[item]) {
      //   this.removeActiveItem(item);
      //   return;
      // }
      this.clearActiveItem();

      // this.selectedItem = item;
      this.addActiveItem(key);
      this.showDetails(key);
    },
    addActiveItem(key) {
      this.activeItem[key] = key;
      this.activeItem = Object.assign({}, this.activeItem);
    },
    removeActiveItem(key) {
      delete this.activeItem[key];
      this.activeItem = Object.assign({}, this.activeItem);
    },
    clearActiveItem() {
      this.activeItem = {};
      this.selectedItem = null;
      this.selectedState = null;
    },
    showDetails(key) {
      ipcRenderer.once("tcp-router-details", (event, args) => {
        // console.log(args);
        this.selectedItem = args;
      });
      ipcRenderer.send("tcp-router-details", key);
      this.selectedState = this.tcpRouterState[key];
    },
    addLog({key, date, text}) {
      
      if(this.logs.length > 100) {
        this.logs.shift();
      }
      this.logs.push({
        key,
        text,
        date: new Date(date).toISOString().replace(/T/, ' ').replace(/\..+/, '')      // replace T with a space
      });

      const container = this.$refs.logs;
      // if((container.scrollHeight - container.clientHeight) <= container.scrollTop) {
        container.scrollTop = container.scrollHeight;
      // }
      // console.log("clientHeight : " + container.clientHeight + ", scrollTop : " + container.scrollTop + ", scrollHeight : " + container.scrollHeight);
      
    },
    handleStartup() {
      ipcRenderer.send("tcp-router-startup");
    },
    handleShutdown() {
      ipcRenderer.send("tcp-router-shutdown");
    },
    handlePreferences() {
      ipcRenderer.send("open-preferences");
    },
    handleFontawesome() {
      ipcRenderer.send("open-fontawesome-window");
    },
    handleClearLog() {
      this.logs.splice(0, this.logs.length)
    }
  }
}
</script>

<style scoped>
.card-footer{
  position:absolute;
  bottom:0;
  width:100%;
}
.card-deck .card {
  padding-bottom:50px;
}
/* .card {
  background-color: transparent;
} */
.items, .details, .logs {
  overflow: auto;
  overflow-x: hidden;
  height: 300px;
  max-height: 300px;
}
.details, .logs {
  margin: 0;
}
.items > .item {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px dashed #101113;
  cursor: pointer;
  border-radius: 10px;
}
.items > .item.selected {
  color: #ffffff;
  border: 1px dashed #ffffff;
  background-color: rgba(128, 128, 128, 0.25);
}
.item .title, .details .title {
  font-weight: bold;
}
.item .value, .details .value {
  margin-left: 10px;
  font-size: 0.9em;
}
.logs .log {
  white-space: nowrap;
  font-size: 0.9em;
}
body {
  overflow: hidden;
}

.nodes {
  text-align: center;
}
.nodes.small {
  font-size: 0.8 rem;
}
.nodes .title {
  text-align: left;
}
.nodes .labels {
  text-align: center;
  display: inline-block;
  width: 80%;
}
.nodes .bytes {
  width: 48%;
  text-align: center;
  display: inline-block;
}
.nodes .node-icon {
  width: 18%;
  text-align: center;
  display: inline-block;
}

.details .nodes {
  padding: 10px;
  border: 1px dashed #ffffff;
  border-radius: 0;
  border-bottom: 0;
}
.details .nodes .title {
  color: #eeeeee;
}
.details .nodes:first-child {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.details .nodes:last-child {
  margin-bottom: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border: 1px dashed #ffffff;
}
</style>
