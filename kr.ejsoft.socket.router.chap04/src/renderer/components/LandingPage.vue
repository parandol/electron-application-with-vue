<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
      <div class="left-side">
        <span class="title">
          Welcome to your new project!
        </span>
        <system-information v-if="false"></system-information>

        <div class="title">Information</div>

        <div class="doc" style="margin-top:16px;">
          <div class="title alt">IPC(Inter-Process Communication)</div>
          <div class="items">
            <div class="item" v-for="(value, key) in tcpRouterState ">
              <div class="name">{{ key }}</div>
              <div class="value">{{ value.count }}</div>
              <div class="value">{{ value.bytes.clientReadBytes }} -> client <- {{ value.bytes.clientWriteBytes }} ROUTER {{ value.bytes.serverWriteBytes }} -> server <- {{ value.bytes.serverReadBytes }}</div>
            </div>
          </div>
          <div>{{ tcpRouterError }}</div>
        </div>
      </div>

      <div class="right-side">
        <div class="doc">
          <div class="title">Getting Started</div>
          <p>
            electron-vue comes packed with detailed documentation that covers everything from
            internal configurations, using the project structure, building your application,
            and so much more.
          </p>
          <button @click="open('https://simulatedgreg.gitbooks.io/electron-vue/content/')">Read the Docs</button><br><br>
        </div>
        <div class="doc">
          <div class="title alt">Other Documentation</div>
          <button class="alt" @click="open('https://electron.atom.io/docs/')">Electron</button>
          <button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data() {
      return {
        responseMessage : "",
        tcpRouterError : "",
        tcpRouterState: {},
      }
    },
    created() {
        ipcRenderer.on("tcp-router-state", (event, args) => {
          // console.log(args);
          this.tcpRouterState = args;
        });
        ipcRenderer.on("tcp-router-error", (event, args) => {
          // console.log(args);
          this.tcpRouterError = args;
        });
        
        ipcRenderer.send("tcp-router-state-init", "");
    },
    destroyed() {
        ipcRenderer.send("tcp-router-state-end", "");
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      sendMessage() {
        ipcRenderer.once("response-message", (event, args) => {
          console.log(args);
          this.responseMessage = args;
        });
        ipcRenderer.send("request-message", "This is a Renderer Message.");
      }
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
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
