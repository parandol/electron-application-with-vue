<template>
    <b-toast
      id="update-toast"
      variant="secondary"
      toaster="b-toaster-top-right"
      append-toast
      no-auto-hide
      :no-close-button="updateToastNoClose"
      toast-class="toast-top"
      :visible="visible"
    >
      <template v-slot:toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <strong class="mr-auto">Update!</strong>
          <small class="text-muted mr-2"></small>
        </div>
      </template>

      {{ updateStateMessage }}

      <b-progress
        :max="updateTotalBytes"
        show-progress
        animated
        variant="success"
        v-if="updateStep >= 3"
      >
        <b-progress-bar :value="updateDownloadBytes">
          <span class="text-white">
            {{ updateDownloadBytes | prettyBytes }}
            / {{ updateTotalBytes | prettyBytes }}
          </span>
        </b-progress-bar>
      </b-progress>

      <b-container fluid class="text-center m-1 mt-2" v-if="updateStep === 1 && !autoCheck && !showErrorGuide">
        <b-button @click="handleCheckUpdateNow" variant="primary" size="sm">업데이트 확인</b-button>
      </b-container>
      <b-container fluid class="text-center m-1 mt-2" v-if="updateStep === 2 && !autoDownload && !showErrorGuide">
        <b-button @click="handleDownloadNow" variant="primary" size="sm">업데이트 다운로드</b-button>
      </b-container>
      <b-container fluid class="text-center m-1 mt-2" v-if="updateStep === 4 && !autoInstall && !showErrorGuide">
        <b-button @click="handleUpdateToast(1)" variant="primary" size="sm">지금 설치 및 재시작</b-button>
        <b-button @click="handleUpdateToast(2)" variant="secondary" size="sm">지금 종료</b-button>
        <b-button @click="handleUpdateToast(3)" variant="info" size="sm">나중에 종료</b-button>
      </b-container>

      <b-container fluid class="text-center m-1 mt-2" v-if="showErrorGuide">
        <b-button @click="openDirectLink" variant="primary" size="sm">직접 다운로드</b-button>
      </b-container>
    </b-toast>
</template>

<script>
import { ipcRenderer, remote } from 'electron';


export default {
  name: 'update-toast',
  components: {
  },
  props: {
    autoCheck :{
      type: Boolean,
      default: false
    },
    autoDownload :{
      type: Boolean,
      default: false
    },
    autoInstall : {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      visible : false,
      updateStateMessage: "",

      updateToastNoClose: false,
      updateDownloadBytes: 5,
      updateTotalBytes: 10,

      updateStep: 1,

      showErrorGuide: false,
      directDownloadLink: "",
    }
  },
  created() {
    // this.$bvToast.show('update-toast');

    if(!this.autoCheck){
      this.updateStateMessage = "서버에서 신규 버전이 있는지 확인하시겠습니까?";
      this.visible = true;
    }

    var packagejson = require('../../../package.json');
    if(packagejson.build && packagejson.build.publish) {
      const publish = packagejson.build.publish;
      if(publish.provider === "github") {
        this.directDownloadLink = "https://github.com/" + publish.owner + "/" + publish.repo + "/releases";
      }
    }
    console.log("Link : " + this.directDownloadLink);
    // ipcRenderer.send("update-check-now", "");
  },
  watch: {
    autoCheck : function(val) {
      if(val) {
        if(this.updateStep === 1) {
          this.handleCheckUpdateNow();
        }
      }
      this.autoCheck = val;
    }
  },
  mounted() {
    ipcRenderer.on("updater-message", (event, args) => {
      // console.log("updater-message");
      console.log(args);
      switch(args.type) {
        case "checking-for-update":
          this.updateStateMessage = "서버에서 신규 버전이 있는지 확인 중입니다.";
          this.updateToastNoClose = false;
          this.visible = true;
          break;
        case "update-not-available":
          this.updateStateMessage = "최신 버전의 애플리케이션을 사용 중입니다.";
          this.updateToastNoClose = false;
          this.visible = true;
          setTimeout(() => {
            this.$bvToast.hide('update-toast');
          }, 3000);
          break;
        case "update-available":
          const {releaseName} = args.info;
          this.updateStateMessage = "서버에서 신규 버전(" + releaseName + ")을 찾았습니다.";
          this.updateStep = 2;
          // {
          //   "version":"9.0.1",
          //   "files":[
          //     {"url":"TCP-Socket-Router-Setup-9.0.1.exe"
          //     ,"sha512":"XX8cFZW93AiFmw85fRdrwLIXZwBfN5ezxdFbgjGE+zlTrjmdl2asuyuytP2qrpEHJD0hYl3taRxb5DApPq6b1g=="
          //     ,"size":111068833}
          //   ]
          //   ,"path":"TCP-Socket-Router-Setup-9.0.1.exe"
          //   ,"sha512":"XX8cFZW93AiFmw85fRdrwLIXZwBfN5ezxdFbgjGE+zlTrjmdl2asuyuytP2qrpEHJD0hYl3taRxb5DApPq6b1g=="
          //   ,"releaseDate":"2020-03-06T05:56:54.284Z"
          //   ,"releaseName":"9.0.1"
          //   ,"releaseNotes":"No content."
          // }

          this.updateToastNoClose = false;
          this.visible = true;
          break;
        case "download-progress":
          const {bytesPerSecond, percent, total, transferred, delta} = args.progress;
          this.updateStateMessage = "업데이트 파일을 다운로드(" + percent.toFixed(1) + "%) 중입니다.";
          this.updateToastNoClose = true;
          this.visible = true;
          
          this.updateStep = 3;

          this.updateDownloadBytes = transferred;
          this.updateTotalBytes = total;
          break;
        case "update-downloaded":
          this.updateStateMessage = "모든 업데이트 파일을 다운로드하였습니다.";
          this.updateToastNoClose = true;
          this.visible = true;
          this.updateStep = 4;

          if(this.autoInstall) {
            this.handleUpdateToast(1);
          }
          break;
        case "update-error":
          // this.updateStateMessage = "에러: " + JSON.stringify(args.error);
          this.updateStateMessage = "업데이트를 진행하는 과정에서 오류가 발생하였습니다.";
          this.updateToastNoClose = false;
          this.visible = true;
          this.showErrorGuide = true;
          // setTimeout(() => {
          //   this.$bvToast.hide('update-toast');
          // }, 2000);
          break;
      }
    });

    if(this.autoCheck) {
      this.handleCheckUpdateNow();
    }
  },
  methods: {
    updateProps() {
      // console.log("updateProps...");
      // if(this.autoCheck) {
      //   this.handleCheckUpdateNow();
      // }
    },
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    openDirectLink() {
      this.open(this.directDownloadLink);
    },
    handleDownloadNow() {
      ipcRenderer.send("update-download-now", {});
    },
    handleCheckUpdateNow() {
      ipcRenderer.send("update-check-now", {
        download : this.autoDownload,
        install : this.autoInstall
      });
    },
    handleUpdateToast(actions) {
      switch(actions) {
        case 0 : 
          break;
        case 1 :
            console.log("Resart Now...");
            ipcRenderer.send("update-and-install-now", "");
          break;
        case 2 :
            console.log("Quit Now...");
            ipcRenderer.send("update-quit-now", "");
          break;
        case 3 :
            console.log("Quit Later...");
            ipcRenderer.send("update-quit-later", "");

            this.updateStateMessage = "";
            this.updateToastNoClose = true;
            this.visible = false;
          break;
      }
    },
  }
}
</script>

<style>
.b-toaster.b-toaster-top-right, .b-toaster.b-toaster-top-left, .b-toaster.b-toaster-top-center, .b-toaster.b-toaster-top-full {
    top: 3rem;
}
.b-toaster.b-toaster-top-right, .b-toaster.b-toaster-top-full {
    right: 1.5rem;
}
</style>