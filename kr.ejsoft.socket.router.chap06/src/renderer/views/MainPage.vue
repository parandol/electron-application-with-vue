<template>
  <div id="wrapper" @click="clearActiveItem">
    <!-- <img id="logo" src="~@/assets/apps.png" alt="electron-vue"> -->
    <main>
      <div class="left-side">
        <span class="title">
          TCP Router Connections
        </span>

        <div class="items">
          <div class="item" v-for="(item, key) in tcpRouterState"
            :key="key"
            :class="{'selected': activeItem[key]}"
            @click.prevent.stop="setActiveItem(key)"
          >
            <div class="name">{{ item.listen }}, {{item.host}}:{{item.port}}</div>
            <div class="value">Connections : {{ item.count }}</div>
            <div class="value">Read : {{ item.bytes.clientReadBytes }} bytes</div>
            <div class="value">Write : {{ item.bytes.clientWriteBytes }} bytes</div>
          </div>
        </div>
      </div>

      <div class="right-side" v-if="selectedItem && selectedState">
        <div class="title">Connection Details</div>
        <div class="details">
          <div class="name">{{ selectedState.listen }}, {{selectedState.host}}:{{selectedState.port}}</div>
          <div class="value">Connections : {{ selectedState.count }}</div>
          <div class="value">Client Read : {{ selectedState.bytes.clientReadBytes }} bytes</div>
          <div class="value">Client Write : {{ selectedState.bytes.clientWriteBytes }} bytes</div>
          <div class="value">Server Read : {{ selectedState.bytes.serverReadBytes }} bytes</div>
          <div class="value">Server Write : {{ selectedState.bytes.serverWriteBytes }} bytes</div>

          <div class="value" v-for="(detail, index) in selectedItem" :key="index">
            <div class="name">{{ detail.address }} : {{ detail.port }}</div>
            <div class="value">Client Read : {{ detail.clientReadBytes }} bytes / Client Write : {{ detail.clientWriteBytes }} bytes</div>
            <div class="value">Server Read : {{ detail.serverReadBytes }} bytes / Server Write : {{ detail.serverWriteBytes }} bytes</div>
          </div>
        </div>
      </div>

      <div class="right-side" v-show="!selectedItem">
        <div class="title">Event Log</div>
        <div class="logs" ref="logs">
          <div class="log" v-for="(log, index) in logs" :key="index">
            <span class="event-date">{{ log.date }}</span> : <span>{{ log.text }}</span>
          </div>
        </div>
      </div>
    </main>

    <footer class="controlbox">
      <div class="left-side">
        <div class="doc">
          <button class="alt" @click="handleStartup">Start</button>
          <button @click="handleShutdown">Shutdown</button>
        </div>
      </div>
      <div class="right-side">
        <div class="doc">
          <button class="alt" @click="handleClearLog">Clear Log</button>
          <button @click="handlePreferences">Preferences</button>
        </div>
      </div>
    </footer>
  </div>
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
        console.log(args);
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
      ipcRenderer.send("open-preperences");
    },
    handleClearLog() {
      this.logs.splice(0, this.logs.length)
    }
  }
}
</script>

<style scoped>
  #wrapper {
    position: relative;
    padding: 30px 20px 50px 20px;
    height: 100%;
    width: 100%
  }
  #wrapper:after {
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

  main {
    display: flex;
    justify-content: space-between;
    height: 100%;
  }

  main > div {
    flex-basis: 50%;
    width: 50%;
    height: 100%;
  }

  footer {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }

  footer > div { flex-basis: 50%; }

  .items, .details, .logs {
    overflow: auto;
    overflow-x: hidden;
    border: 1px solid #2c3e50;
    margin: 0 20px 0 0;
    height: calc(100% - 30px);
    padding: 10px;
  }
  .details, .logs {
    margin: 0;
  }
  .items > .item {
    padding: 10px;
    margin-bottom: 10px;
    border: 2px dotted #2c3e50;
    cursor: pointer;
    border-radius: 10px;
  }

  .items > .item.selected {
    border: 2px solid #4fc08d;
  }

  .item .name, .details .name {
    font-weight: bold;
  }

  .item .value, .details .value {
    margin-left: 10px;
    font-size: 0.9em;
  }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .controlbox .right-side {
    text-align:right;
  }

  .logs .log {
    white-space: nowrap;
    font-size: 0.9em;
  }






  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
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

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
