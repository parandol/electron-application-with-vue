<template>
  <b-card no-body class="h-100 main-wrapper" @click="clearActiveItem">
    <b-card-body>
    <div class="row h-100">
      <div class="col-md-6">
        <b-card no-body class="h-100">
          <b-card-header>TCP Router Connections</b-card-header>
          <b-card-body>
            <div class="items overflow-y">
              <div class="item" v-for="(item, key) in tcpRouterState"
                :key="key"
                :class="{'selected': activeItem[key]}"
                @click.prevent.stop="setActiveItem(key)"
              >
                <div class="name"><font-awesome-icon :icon="['fas', 'bezier-curve']" /> {{ item.listen }}, <font-awesome-icon :icon="['fas', 'cloud']" /> {{item.host}}:{{item.port}}</div>
                <div class="value"><font-awesome-icon :icon="['fas', 'link']" /> Connections : {{ item.count }}</div>
                <div class="value"><font-awesome-icon :icon="['fas', 'download']" /> Read : {{ item.bytes.clientReadBytes }} bytes</div>
                <div class="value"><font-awesome-icon :icon="['fas', 'upload']" /> Write : {{ item.bytes.clientWriteBytes }} bytes</div>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </div>

      <div class="col-md-6" v-if="selectedItem && selectedState">
        <b-card no-body class="h-100">
          <b-card-header>Connection Details</b-card-header>
          <b-card-body>
            <div class="details overflow-y">
              <div class="name"><font-awesome-icon :icon="['fas', 'bezier-curve']" /> {{ selectedState.listen }}, <font-awesome-icon :icon="['fas', 'cloud']" /> {{selectedState.host}}:{{selectedState.port}}</div>
              <div class="value"><font-awesome-icon :icon="['fas', 'link']" /> Connections : {{ selectedState.count }}</div>
              <div class="value"><font-awesome-icon :icon="['fas', 'download']" /> Client Read : {{ selectedState.bytes.clientReadBytes }} bytes</div>
              <div class="value"><font-awesome-icon :icon="['fas', 'upload']" /> Client Write : {{ selectedState.bytes.clientWriteBytes }} bytes</div>
              <div class="value"><font-awesome-icon :icon="['fas', 'cloud-download-alt']" /> Server Read : {{ selectedState.bytes.serverReadBytes }} bytes</div>
              <div class="value"><font-awesome-icon :icon="['fas', 'cloud-upload-alt']" /> Server Write : {{ selectedState.bytes.serverWriteBytes }} bytes</div>

              <div class="value" v-for="(detail, index) in selectedItem" :key="index">
                <div class="name"><font-awesome-icon :icon="['fas', 'link']" /> {{ detail.address }} : {{ detail.port }}</div>
                <div class="value"><font-awesome-icon :icon="['fas', 'download']" /> Client Read : {{ detail.clientReadBytes }} bytes / <font-awesome-icon :icon="['fas', 'upload']" /> Client Write : {{ detail.clientWriteBytes }} bytes</div>
                <div class="value"><font-awesome-icon :icon="['fas', 'cloud-download-alt']" /> Server Read : {{ detail.serverReadBytes }} bytes / <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" /> Server Write : {{ detail.serverWriteBytes }} bytes</div>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </div>

      <div class="col-md-6" v-show="!selectedItem">
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
        <button class="alt" @click="handleStartup"><b-icon icon="play" font-scale="1.5"></b-icon> Start</button>
        <button @click="handleShutdown"><b-icon icon="stop" font-scale="1.5"></b-icon> Shutdown</button>
      </div>
      <div class="col-md-7 text-right">
        <button class="alt" @click="handleFontawesome"><font-awesome-icon :icon="['fab', 'font-awesome']" size="lg" /></button>
        <button class="alt" @click="handleClearLog"><b-icon icon="trash" font-scale="1.5"></b-icon> Clear Log</button>
        <button @click="handlePreferences"><b-icon icon="gear" font-scale="1.5"></b-icon> Preferences</button>
      </div>
    </div>
    </b-card-footer>
  </b-card>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
//const { remote } = require('electron')
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
  components: { },
  data() {
    return {
      tcpRouterState: {},
      activeItem: {},
      selectedItem: null,
      selectedState: null,
      logs: [],
    }
  },
  created() {
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
      console.log(log);
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
  },
  destroyed() {
    // Destroy ipcRenderer
    ipcRenderer.send("tcp-router-state-end", "");
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
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
.card-deck .card{
  padding-bottom:50px;
}
.card {
  background-color: transparent;
}
.items, .details, .logs {
  overflow: auto;
  overflow-x: hidden;
  height: 320px;
  max-height: 320px;
}
.details, .logs {
  margin: 0;
}
.items > .item {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px dashed #2c3e50;
  cursor: pointer;
  border-radius: 10px;
}
.items > .item.selected {
  border: 1px solid #4fc08d;
}

.main-wrapper {
  position: relative;
  height: 100%;
  width: 100%
}
.main-wrapper:after {
  content : "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: url('~@/assets/apps.png'); 
  background-repeat: no-repeat;
  background-position: center;
  opacity:0.25!important;
  filter:alpha(opacity=25);
  z-index: -1;
}

.item .name, .details .name {
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

button {
  /* font-size: .8em; */
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
