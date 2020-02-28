<template>
  <div id="wrapper">
    <section>
      <div class="common-prefs">
        <span class="title">Common</span>
        <div class="options"><input type="checkbox" name="autostartup" id="autostartup" v-model="preferences.common.autostartup" /><label for="autostartup">운영체제 시작 시 프로그램 자동시작</label></div>
        <div class="options"><input type="checkbox" name="autoservice" id="autoservice" v-model="preferences.common.autoservice" /><label for="autoservice">프로그램 시작 시 서비스 자동시작</label></div>
        <div class="options"><input type="checkbox" name="minimizestart" id="minimizestart" v-model="preferences.common.minimizestart" /><label for="minimizestart">프로그램 시작 시 최소화로 시작</label></div>
        <div class="options"><input type="checkbox" name="minimizeToTray" id="minimizeToTray" v-model="preferences.common.minimizeToTray" /><label for="minimizeToTray">창을 최소화할 때 시스템 트레이로 숨기기</label></div>
        <div class="options"><input type="checkbox" name="closeToTray" id="closeToTray" v-model="preferences.common.closeToTray" /><label for="closeToTray">창을 닫을 때 시스템 트레이로 숨기기</label></div>
      </div>
    </section>
    <main>
      <div class="left-side">
        <span class="title">TCP Router</span>
        <div class="items">
          <div class="item" v-for="(item, index) in preferences.routers"
            :key="index"
            :class="{'selected': selectedIndex == index}"
            @click.prevent.stop="setselectedIndex(index)"
          >
            <div class="name">{{ item.listen }}, {{item.host}}:{{item.port}}</div>
          </div>
        </div>
      </div>

      <div class="right-side">
        <div class="title">Router Information</div>
        <div class="information" ref="information">
          <div class="info-row">
            <div class="info-title">Listen</div>
            <div class="info-value"><input type="text" name="listen" v-model="selectedItem.listen" /></div>
          </div>
          <div class="info-row">
            <div class="info-title">Host</div>
            <div class="info-value"><input type="text" name="host" v-model="selectedItem.host" /></div>
          </div>
          <div class="info-row">
            <div class="info-title">Port :</div>
            <div class="info-value"><input type="text" name="port" v-model="selectedItem.port" /></div>
          </div>
        </div>
        <div class="info-control">
          <button class="alt" @click="handleAdd" v-if="selectedIndex >= 0">Modify</button>
          <button class="alt" @click="handleAdd" v-else>Add</button>
          <button class="alt" @click="handleDelete" v-if="selectedIndex >= 0">Delete</button>
          <button @click="handleReset">Reset</button>
        </div>
      </div>
    </main>

    <footer class="controlbox">
      <div class="left-side">
        <div class="doc">
          <button class="alt" @click="handleNew">New Router</button>
        </div>
      </div>
      <div class="right-side">
        <div class="doc">
          <button @click="handleSave">Save</button>
          <button class="alt" @click="handleClose">Close</button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ipcRenderer, remote } from 'electron'

  export default {
    name: 'preferences-page',
    components: {
    },
    data() {
      return {
        selectedIndex: -1,
        selectedItem: {},
        preferences: {
          common:{
            autostartup: false,
            autoservice: false,
            minimizestart: false,
            minimizeToTray: false,
            closeToTray: false,
          },
          routers:[]
        },
      }
    },
    created() {
        console.log("created....");
        ipcRenderer.on("response-preferences", (event, args) => {
          console.log(args);
          this.preferences = args;
        });
        ipcRenderer.on("changed-preferences", (event, args) => {
          console.log(args);
          this.preferences = args;
        });
        
        ipcRenderer.send("request-preferences");
    },
    mounted() {
    },
    destroyed() {
    },
    methods: {
      setselectedIndex(index) {
        this.selectedIndex = index;
        this.bindData(index);
      },
      clearselectedIndex() {
        this.selectedIndex = -1;
        this.selectedItem = {};
      },
      bindData(index) {
        let router = {};
        if(index >= 0) {
          router = this.preferences.routers ? this.preferences.routers[index] : null;
        }
        router = router ? router : {listen:0, host:"", port:0}
        const {listen, host, port} = router;
        this.selectedItem =  {listen, host, port};
      },
      handleNew() {
        this.selectedIndex = -1;
        this.selectedItem = {};
      },
      handleAdd() {
        if(!this.preferences.routers) {
          this.preferences.routers = [];
        }

        const {listen, host, port} = this.selectedItem;
        if(this.selectedIndex >= 0) {
          
          this.preferences.routers.splice(
            this.selectedIndex,
            1, {
              listen, host, port
            }
          );
        } else {
          this.preferences.routers.push({
            listen, host, port
          });
        }
        this.selectedIndex = -1;
        this.selectedItem = {};
      },
      handleDelete() {
        if(this.selectedIndex >= 0) {
          this.preferences.routers.splice(this.selectedIndex, 1);
        }
        this.selectedIndex = -1;
        this.selectedItem = {};
      },
      handleReset() {
        this.bindData(this.selectedIndex);
      },
      handleSave() {
        ipcRenderer.send("save-preferences", this.preferences);
        this.handleClose();
      },
      handleClose() {
        const window = remote.getCurrentWindow();
        window.close();
      },
    }
  }
</script>

<style scoped>
  #wrapper {
    position: relative;
    padding: 10px 20px 50px 20px;
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
    height: 65%;
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

  .items, .information {
    overflow: auto;
    overflow-x: hidden;
    border: 1px solid #2c3e50;
    margin: 0 20px 0 0;
    height: calc(100% - 30px);
    padding: 10px;
  }
  .information {
    height: calc(100% - 80px);
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

  .information .log {
    white-space: nowrap;
    font-size: 0.9em;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }
  .info-row > div { flex-basis: 30%; }

  .info-row > .info-title {
    display: flex;
    flex-direction: column;
  }
  .info-control {
    text-align: center;
    padding: 10px;
  }

  .common-prefs {
    font-size: 0.85em;
    margin-bottom: 10px;
  }
  .common-prefs .options {
    margin-left: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 14px;
    margin-bottom: 10px;
  }

  button {
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

  button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
