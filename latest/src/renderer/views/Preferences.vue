<template>
  <b-card no-body class="h-100 prefs-wrapper">

    <DialogHeader name="preferences"></DialogHeader>

    <b-tabs card>
      <b-tab active title-item-class="mr-1">
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
      <b-tab title="TCP Router" title-item-class="mr-1">
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
                <div class="name">
                  {{ item.name }}<br />
                  {{ item.listen }}, {{item.host}}:{{item.port}}
                </div>
              </div>
            </b-card-text>
          </b-card>
          <b-card no-body>
            <b-card-body>
              <b-row class="my-1">
                <b-col sm="3">Name</b-col>
                <b-col sm="9"><b-form-input type="text" name="name" v-model="selectedItem.name" /></b-col>
              </b-row>
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
                <b-col sm="4" class="text-left">
                  <b-button size="sm" variant="info" @click="handleNew"><b-icon icon="brightness-high" class="align-middle"></b-icon> New Router</b-button>
                </b-col>
                <b-col sm="8" class="text-right">
                  <b-button size="sm" variant="primary" @click="handleAdd" v-if="selectedIndex >= 0"><b-icon icon="pen" class="align-middle"></b-icon> Modify</b-button>
                  <b-button size="sm" variant="primary" @click="handleAdd" v-else><b-icon icon="pen" class="align-middle"></b-icon> Add</b-button>
                  <b-button size="sm" variant="danger" @click="handleDelete" v-if="selectedIndex >= 0"><b-icon icon="trash" class="align-middle"></b-icon> Delete</b-button>
                  <b-button size="sm" variant="secondary" @click="handleReset"><b-icon icon="x-circle" class="align-middle"></b-icon> Reset</b-button>
                </b-col>
              </b-row>
            </b-card-footer>
          </b-card>
        </b-card-group>
      </b-tab>
      <b-tab title-item-class="mr-1">
        <template v-slot:title>
          <b-icon icon='cloud-download' font-scale='1.5'></b-icon> Update
        </template>
        <b-card-body>
          <b-form-group label="Update Options:">
            <b-form-checkbox name="autoUpdateUI" id="autoUpdateUI" v-model="preferences.update.autoUpdateUI">Check for updates automatically at program startup.</b-form-checkbox>
            <b-form-checkbox name="autoCheck" id="autoCheck" v-model="preferences.update.autoCheck">Automatically check the update version.</b-form-checkbox>
            <b-form-checkbox name="autoDownload" id="autoDownload" v-model="preferences.update.autoDownload">Automatically download new updates.</b-form-checkbox>
            <b-form-checkbox name="autoInstall" id="autoInstall" v-model="preferences.update.autoInstall">Installs automatically when the download is complete.</b-form-checkbox>
          </b-form-group>
        </b-card-body>
      </b-tab>
    </b-tabs>
    <b-card-footer class="text-right">
      <b-button @click="handleSave" variant="primary" pill><b-icon icon="check-circle" font-scale="1.5" class="align-middle"></b-icon> Save</b-button>
      <b-button @click="handleClose" variant="secondary" pill><b-icon icon="x" font-scale="1.5" class="align-middle"></b-icon> Close</b-button>
    </b-card-footer>
  </b-card>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
// import { DialogHeader } from '../components/DialogHeader'
const DialogHeader = require('../components/DialogHeader').default;
// console.log("JSON.stringify(DialogHeader)");
// console.log(JSON.stringify(DialogHeader));
// console.log(DialogHeader);

export default {
  name: 'preferences-page',
  components: {
    DialogHeader
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
        routers:[],
        update: {
          autoUpdateUI: true,
          autoCheck: false,
          autoDownload: false,
          autoInstall: false,
        }
      },
    }
  },
  created() {
    ipcRenderer.on("response-preferences", (event, args) => {
      // console.log(args);
      for(const key in args) {
        this.preferences[key] = args[key];
      };
    });
    ipcRenderer.on("changed-preferences", (event, args) => {
      // console.log(args);
      for(const key in args) {
        this.preferences[key] = args[key];
      };
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
      router = router ? router : {name: "", listen: 0, host: "", port: 0}
      const {name, listen, host, port} = router;
      this.selectedItem =  {name, listen, host, port};
    },
    handleNew() {
      this.selectedIndex = -1;
      this.selectedItem = {};
    },
    handleAdd() {
      if(!this.preferences.routers) {
        this.preferences.routers = [];
      }

      const {name, listen, host, port} = this.selectedItem;
      if(this.selectedIndex >= 0) {
        
        this.preferences.routers.splice(
          this.selectedIndex,
          1, {
            name, listen, host, port
          }
        );
      } else {
        this.preferences.routers.push({
          name, listen, host, port
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
/* .card {
  background-color: transparent;
} */
.items {
  height: 270px;
  max-height: 270px;
  padding: 10px;
  overflow: auto;
  overflow-x: hidden;
}
.items > .item {
  padding: 10px;
  margin: 0 0 10px 0;
  border: 1px dashed #2c3e50;
  cursor: pointer;
  border-radius: 10px;
}
.items > .item.selected {
  border: 1px solid #101113;
}
.item .name, .details .name {
  font-weight: bold;
}
.item .value, .details .value {
  margin-left: 10px;
  font-size: 0.9em;
}
</style>
