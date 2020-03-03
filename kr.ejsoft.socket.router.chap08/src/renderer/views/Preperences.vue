<template>
  <b-card no-body class="h-100 prefs-wrapper">
    <b-tabs card>
      <b-tab active>
        <template v-slot:title>
          <b-icon icon='play' font-scale='1.5'></b-icon> Common
        </template>
        <b-card-body>
          <b-form-group label="Startup Options:">
            <b-form-checkbox name="autostartup" id="autostartup" v-model="preferences.common.autostartup">Auto start program when operating system starts</b-form-checkbox>
            <b-form-checkbox name="autoservice" id="autoservice" v-model="preferences.common.autoservice">Service auto start at program start</b-form-checkbox>
            <b-form-checkbox name="minimizestart" id="minimizestart" v-model="preferences.common.minimizestart">Start with minimize at program start</b-form-checkbox>
          </b-form-group>
          <b-form-group label="Window minimize & close:">
            <b-form-checkbox name="minimizeToTray" id="minimizeToTray" v-model="preferences.common.minimizeToTray">Hide in system tray when minimizing window</b-form-checkbox>
            <b-form-checkbox name="closeToTray" id="closeToTray" v-model="preferences.common.closeToTray">Hide in system tray when closing window</b-form-checkbox>
          </b-form-group>
          <!--
          <div class="options"><input type="checkbox" name="autostartup" id="autostartup" v-model="preferences.common.autostartup" /><label for="autostartup">운영체제 시작 시 프로그램 자동시작</label></div>
          <div class="options"><input type="checkbox" name="autoservice" id="autoservice" v-model="preferences.common.autoservice" /><label for="autoservice">프로그램 시작 시 서비스 자동시작</label></div>
          <div class="options"><input type="checkbox" name="minimizestart" id="minimizestart" v-model="preferences.common.minimizestart" /><label for="minimizestart">프로그램 시작 시 최소화로 시작</label></div>
          <div class="options"><input type="checkbox" name="minimizeToTray" id="minimizeToTray" v-model="preferences.common.minimizeToTray" /><label for="minimizeToTray">창을 최소화할 때 시스템 트레이로 숨기기</label></div>
          <div class="options"><input type="checkbox" name="closeToTray" id="closeToTray" v-model="preferences.common.closeToTray" /><label for="closeToTray">창을 닫을 때 시스템 트레이로 숨기기</label></div>
          -->
        </b-card-body>
      </b-tab>
      <b-tab title="TCP Router">
        <template v-slot:title>
          <b-icon icon='cloud' font-scale='1.5'></b-icon> TCP Router
        </template>
        <b-card-group>
          <b-card no-body style="max-width: 250px;">
            <b-card-text class="items overflow-y">
              <div class="item" v-for="(item, index) in preferences.routers"
                :key="index"
                :class="{'selected': selectedIndex == index}"
                @click.prevent.stop="setselectedIndex(index)"
              >
                <div class="name">{{ item.listen }}, {{item.host}}:{{item.port}}</div>
              </div>
            </b-card-text>
          </b-card>
          <b-card no-body>
            <b-card-body>
              <b-row class="my-1">
                <b-col sm="3">Listen</b-col>
                <b-col sm="9"><b-form-input type="number" name="listen" v-model="selectedItem.listen" /></b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="3">Host</b-col>
                <b-col sm="9"><b-form-input type="text" name="host" v-model="selectedItem.host" /></b-col>
              </b-row>
              <b-row class="my-1">
                <b-col sm="3">Port</b-col>
                <b-col sm="9"><b-form-input type="number" name="port" v-model="selectedItem.port" /></b-col>
              </b-row>
            </b-card-body>
            <b-card-footer class="text-center">
              <b-row>
                <b-col sm="5" class="text-left">
                  <button class="sml alt" @click="handleNew">New Router</button>
                </b-col>
                <b-col sm="7" class="text-right">
                  <button class="sml alt" @click="handleAdd" v-if="selectedIndex >= 0">Modify</button>
                  <button class="sml alt" @click="handleAdd" v-else>Add</button>
                  <button class="sml alt" @click="handleDelete" v-if="selectedIndex >= 0">Delete</button>
                  <button class="sml" @click="handleReset">Reset</button>
                </b-col>
              </b-row>
            </b-card-footer>
          </b-card>
        </b-card-group>
      </b-tab>
    </b-tabs>
    <b-card-footer class="text-right">
      <button @click="handleSave"><b-icon icon="check-circle" font-scale="1.5"></b-icon> Save</button>
      <button class="alt" @click="handleClose"><b-icon icon="x" font-scale="1.5"></b-icon> Close</button>
    </b-card-footer>
  </b-card>
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
.items {
  height: 240px;
  max-height: 240px;
  padding: 10px;
}
.items > .item {
  padding: 10px;
  margin: 0 0 10px 0;
  border: 1px dashed #2c3e50;
  cursor: pointer;
  border-radius: 10px;
}
.items > .item.selected {
  border: 1px solid #4fc08d;
}
.item .name, .details .name {
  font-weight: bold;
}
.item .value, .details .value {
  margin-left: 10px;
  font-size: 0.9em;
}

.prefs-wrapper {
  position: relative;
  height: 100%;
  width: 100%
}
.prefs-wrapper:after {
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
.form-control {
  background-color: rgba(255,255,255, 0.6);
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

button.sml {
  padding:0.2em 1em;
}
</style>
