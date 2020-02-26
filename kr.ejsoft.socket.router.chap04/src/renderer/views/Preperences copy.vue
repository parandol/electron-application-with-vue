<template>
  <div
    class="app"
    style="-webkit-app-region: no-drag"
  >
    <div
      class="part titlebar"
    >
      <div class="titlebar-drag-region"></div>
      <div class="window-appicon"></div>

      <div class="window-controls-container">
        <div
          class="window-icon-bg window-close-bg"
          @click="handleClose"
        ><div class="window-icon window-close"></div></div>
      </div>
    </div>

    <div class="app-body">
      <div class="main">
        <div class="fullscreen animated fadeIn">
          <b-card>
            <!--
            <div slot="header">
              <i class="icons fa fa-gears" /> Preferences
            </div>
            -->
            <b-tabs>
              <b-tab
                title="공통 설정"
                active
              >
                <b-row>
                  <b-col sm="6">
                    <b-form-group>
                      <label for="deviceName">PC 이름</label>
                      <b-form-input
                        id="deviceName"
                        v-model="prefs.common.deviceName"
                        type="text"
                        placeholder="PC Name"
                        @change="handleChange"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6">
                    <b-form-group>
                      <label for="name">동작 설정</label>
                      <b-form-radio-group>
                        <div class="custom-control custom-radio custom-control-inline">
                          <input
                            id="executeMode1"
                            v-model="prefs.common.executeMode"
                            type="radio"
                            name="executeMode"
                            class="custom-control-input"
                            value="server"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="executeMode1"
                          >Server</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                          <input
                            id="executeMode2"
                            v-model="prefs.common.executeMode"
                            type="radio"
                            name="executeMode"
                            class="custom-control-input"
                            value="client"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="executeMode2"
                          >Client</label>
                        </div>
                      </b-form-radio-group>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="6">
                    <b-form-group>
                      <label for="executeHost">서버 호스트</label>
                      <b-form-input
                        id="executeHost"
                        v-model="prefs.common.executeHost"
                        type="text"
                        placeholder="Host"
                        :disabled="prefs.common.executeMode === 'server'"
                        @change="handleChange"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="3">
                    <b-form-group>
                      <label for="executePort">접속 포트</label>
                      <b-form-input
                        id="executePort"
                        v-model="prefs.common.executePort"
                        type="text"
                        placeholder="Port"
                        @keypress="isNumber"
                        @change="handleChange"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="3">
                    <b-form-group>
                      <label>동시 전송 개수</label>
                      <b-form-select
                        id="basicSelect"
                        v-model="prefs.common.maxTransfer"
                        :plain="true"
                        :options="[
                          {text : '1 개', value : '1'},
                          {text : '2 개', value : '2'},
                          {text : '3 개', value : '3'},
                          {text : '4 개', value : '4'},
                          {text : '5 개', value : '5'},
                          {text : '10 개', value : '10'},
                        ]"
                        @change="handleChange"
                      >
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label>서버 접속 재시도/대기시간</label>
                      <b-form-select
                        id="basicSelect"
                        v-model="prefs.common.retryconnect"
                        :plain="true"
                        :options="[
                          {text : '재시도 안함', value : '0'},
                          {text : '1 초 후 재시도', value : '1'},
                          {text : '2 초 후 재시도', value : '2'},
                          {text : '3 초 후 재시도', value : '3'},
                          {text : '4 초 후 재시도', value : '5'},
                          {text : '10 초 후 재시도', value : '10'},
                          {text : '30 초 후 재시도', value : '30'},
                          {text : '1분 후 재시도', value : '60'},
                        ]"
                        @change="handleChange"
                      >
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label>저장 경로</label>
                      <b-input-group>
                        <b-form-input
                          id="elementsAppendButton"
                          v-model="prefs.common.outputPath"
                          type="text"
                          placeholder="Output..."
                          @change="handleChange"
                        ></b-form-input>
                        <b-input-group-append>
                          <b-button
                            variant="primary"
                            @click="handleFindFolder"
                          ><i class="fa fa-search" /></b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label>시작 및 종료</label>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="autostartup"
                            v-model="prefs.common.autostartup"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="autostartup"
                          >운영체제 시작 시 프로그램 자동시작</label>
                        </div>
                      </b-form-checkbox-group>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="autoservice"
                            v-model="prefs.common.autoservice"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="autoservice"
                          >프로그램 시작 시 서비스 자동시작</label>
                        </div>
                      </b-form-checkbox-group>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="minimizestart"
                            v-model="prefs.common.minimizestart"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="minimizestart"
                          >프로그램 시작 시 최소화로 시작</label>
                        </div>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label>최소화/닫기 설정</label>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="minimizeToTray"
                            v-model="prefs.common.minimizeToTray"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="minimizeToTray"
                          >창을 최소화할 때 시스템 트레이로 숨기기</label>
                        </div>
                      </b-form-checkbox-group>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="closeToTray"
                            v-model="prefs.common.closeToTray"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="closeToTray"
                          >창을 닫을 때 시스템 트레이로 숨기기</label>
                        </div>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-tab>

              <b-tab
                v-if="prefs.common.executeMode === 'server'"
                title="기능 설정"
              >
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label>공유기능 설정</label>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="shareFiles"
                            v-model="prefs.functions.shareFiles"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="shareFiles"
                          >드래그 드롭을 통해 파일을 공유</label>
                        </div>
                      </b-form-checkbox-group>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="shareKeyAndMouse"
                            v-model="prefs.functions.shareKeyAndMouse"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="shareKeyAndMouse"
                          >키보드/마우스 공유</label>
                        </div>
                      </b-form-checkbox-group>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="shareClipboard"
                            v-model="prefs.functions.shareClipboard"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="shareClipboard"
                          >클립보드 공유</label>
                        </div>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label>부가 기능 설정</label>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="qrMaker"
                            v-model="prefs.functions.qrMaker"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="qrMaker"
                          >QR 생성 사용</label>
                        </div>
                      </b-form-checkbox-group>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="clipboardHistory"
                            v-model="prefs.functions.clipboardHistory"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            :disabled="!prefs.functions.shareClipboard"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="clipboardHistory"
                          >클립보드 기록 관리</label>
                        </div>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-tab>

              <b-tab
                v-if="prefs.common.executeMode === 'server' && prefs.functions.shareFiles"
                title="파일 공유"
              >
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label>파일공유 설정</label>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="files-selectfile"
                            v-model="prefs.files.selectfile"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >

                          <label
                            v-if="!isDarwin"
                            class="custom-control-label"
                            for="files-selectfile"
                          >단축키를 이용해 파일(Ctrl+O)/폴더(Ctrl+D) 선택</label>
                          <label
                            v-if="isDarwin"
                            class="custom-control-label"
                            for="files-selectfile"
                          >단축키를 이용해 파일(Command+O)/폴더(Command+D) 선택</label>
                        </div>
                      </b-form-checkbox-group>
                      <b-form-checkbox-group v-if="false">
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="files-copypaste"
                            v-model="prefs.files.copypaste"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            v-if="!isDarwin"
                            class="custom-control-label"
                            for="files-copypaste"
                          >붙여넣기(Ctrl + V)할 경우 파일/폴더를 공유</label>
                          <label
                            v-if="isDarwin"
                            class="custom-control-label"
                            for="files-copypaste"
                          >붙여넣기(Command + V)할 경우 파일/폴더를 공유</label>
                        </div>
                      </b-form-checkbox-group>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="closeConfirm"
                            v-model="prefs.files.closeConfirm"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="closeConfirm"
                          >파일 전송이 진행중일 때 프로그램 종료 여부 묻기</label>
                        </div>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label>기타 설정</label>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="files-auto-remove"
                            v-model="prefs.files.autoremove"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="files-auto-remove"
                          >전송 완료시 자동으로 작업 목록에서 삭제</label>
                        </div>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-tab>


              <b-tab
                v-if="prefs.common.executeMode === 'server' && prefs.functions.shareKeyAndMouse"
                title="키보드/마우스"
              >
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label>장치 위치</label>

                      <b-row
                        v-for="y in 3"
                        :key="y"
                        class="device-row"
                      >
                        <b-col
                          v-for="x in 4"
                          :key="x"
                          :data-x="x"
                          :data-y="y"
                          sm="3"
                          class="device-col"
                          @drop="handleDrop"
                          @dragover="handleDragover"
                        >
                          <div
                            v-if="findDevice(x, y)"
                            :id="'drag-' + x + '-' + y"
                            :data-type="findDevice(x, y).type"
                            :data-x="x"
                            :data-y="y"
                            draggable="true"
                            class="device-div draggable"
                            @dragstart="handleDrag"
                            @click="handleClickDevice"
                          >
                            <div
                              class="device"
                            >
                              <i
                                class="fa fa-desktop"
                                :class="findDevice(x, y).type"
                              />
                            </div>
                            <b-form-group>
                              <b-form-input
                                :value="findDeviceName(x, y)"
                                :disabled="findDevice(x, y).type === 'server'"
                                class="device-input"
                                style="text-align: center;"
                                size="sm"
                                type="text"
                                placeholder="Device Name"
                                @change="handleSaveDevices"
                              ></b-form-input>
                            </b-form-group>
                          </div>
                        </b-col>
                      </b-row>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="9">
                    <!--
                    <b-btn
                      id="command-save-devices"
                      v-b-tooltip.topright.hover
                      title="장치 정보 저장"
                      variant="outline-light"
                      class="mr-1"
                      @click.prevent="handleSaveDevices"
                    >
                      <i
                        class="fa fa-save"
                      />
                    </b-btn>
                    -->
                  </b-col>
                  <b-col sm="3">
                    <b-btn
                      id="command-add-device"
                      v-b-tooltip.topright.hover
                      title="장치 추가"
                      variant="outline-light"
                      class="mr-1"
                      @click.prevent="handleAddDevice"
                    >
                      <i
                        class="fa fa-plus-circle"
                      />
                    </b-btn>
                    <b-btn
                      id="command-delete-device"
                      v-b-tooltip.topright.hover
                      title="장치 삭제"
                      variant="outline-light"
                      class="mr-1"
                      @click.prevent="handleDeleteDevice"
                    >
                      <i
                        class="fa fa-minus-circle"
                      />
                    </b-btn>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="12">
                    <b-form-group>
                      <label>부가 설정</label>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="files-loop-boundary"
                            v-model="prefs.keymouse.loopBoundary"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="files-loop-boundary"
                          >마우스가 화면 가장자리 바깥으로 이동시 반대쪽 화면 전환</label>
                        </div>
                      </b-form-checkbox-group>
                      <b-form-checkbox-group>
                        <div class="custom-control custom-checkbox custom-control-inline">
                          <input
                            id="files-mouse-animation"
                            v-model="prefs.keymouse.mouseAnimation"
                            type="checkbox"
                            class="custom-control-input"
                            value="true"
                            @change="handleChange"
                          >
                          <label
                            class="custom-control-label"
                            for="files-mouse-animation"
                          >화면 전환시 마우스 커서 위치 알려주기</label>
                        </div>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-tab>

            </b-tabs>
          </b-card>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { remote, ipcRenderer } from "electron";
import Vue from 'vue';
import BTabs from 'bootstrap-vue/es/components/tabs/tabs';
import BTab from 'bootstrap-vue/es/components/tabs/tab';
import BFormInput from 'bootstrap-vue/es/components/form-input/form-input';
import BFormSelect from 'bootstrap-vue/es/components/form-select/form-select';
import BFormCheckboxGroup from 'bootstrap-vue/es/components/form-checkbox/form-checkbox-group';
import BFormRadioGroup from 'bootstrap-vue/es/components/form-radio/form-radio-group';
// Vue.component('b-form-checkbox-group', BFormInput)
// Vue.component('b-form-input', BFormInput);

export default {
    name: "preferences-page",
    components: {
        BTabs, BTab, BFormSelect, BFormInput, BFormCheckboxGroup, BFormRadioGroup
    },
    data() {
        return {
            window : remote.getCurrentWindow(),
            isDarwin : process.platform === "darwin",
            maximized: false,
            prefs : {
                common : {
                    deviceName : "",
                    executeMode : "server",
                    executeHost : "",
                    executePort : 8081,
                    outputPath : "",
                    maxTransfer : 5,
                    autostartup: true,
                    minimizestart: false,
                    autoservice: true,
                    minimizeToTray: true,
                    closeToTray: true,
                    retryconnect: 3,
                },
                functions : {
                    shareFiles : true,
                    shareClipboard : true,
                    shareKeyAndMouse : true,
                    qrMaker : true,
                    clipboardHistory : true,
                },
                files : {
                    selectfile : true,
                    copypaste : false,
                    closeConfirm: true,
                    autoremove : true,
                },
                keymouse: {
                    devices : [
                    ],
                    loopBoundary : true,
                    mouseAnimation : true,
                }
            }
        };
    },
    mounted() {
        const window = remote.getCurrentWindow();
        this.maximized = window.isMaximized();
    },
    created() {
        const window = remote.getCurrentWindow();
        window.on("resize", (e) => {
            if(window.isMaximized()) {
                this.maximized = true;
            } else {
                this.maximized = false;
            }
        });

        ipcRenderer.once("RESPONSE_PREFERENCES", (event, data) => {
            console.log("RESPONSE_PREFERENCES : ", JSON.stringify(data));
            this.prefs = Object.assign({}, this.prefs, data);
            this.initServerDevice();
        });

        ipcRenderer.send("REQUEST_PREFERENCES", {
            target : "prefs"
        });
    },
    methods : {
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
        handleChange(e) {
            console.log(JSON.stringify(this.prefs));
            ipcRenderer.send("SAVE_PREFERENCES", this.prefs);
        },
        handleFindFolder() {
            ipcRenderer.once("RESPONSE_FOLDER", (event, data) => {
                console.log("Folder : ", JSON.stringify(data));
                this.prefs.common.outputPath = data.folder;
                this.handleChange();
            });

            ipcRenderer.send("REQUEST_FOLDER", {
                path : this.prefs.common.outputPath,
                target : "prefs"
            });
        },
        isNumber(evt) {
            const charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            }
            return true;
        },
        handleDrop(e) {
            e.preventDefault();
            const data = e.dataTransfer.getData("text");
            if(e.target.classList.contains('device-col')) {
                // e.target.appendChild(document.getElementById(data));

                const field = e.target;
                const x = field.getAttribute("data-x");
                const y = field.getAttribute("data-y");

                const adevice = field.querySelector(".device-div");
                if(!adevice) {
                    const device = document.getElementById(data);
                    const ox = device.getAttribute("data-x");
                    const oy = device.getAttribute("data-y");
                    const ot = device.getAttribute("data-type");
                    const input = device.querySelector(".device-input");

                    // console.log("(" + ox + ", " + oy + ", " + ot + ") => (" + x + ", " + y + ", " + input.value + ")");

                    this.deleteDevice(ox, oy);
                    const info = {
                        type : ot,
                        name : input.value,
                        x,
                        y,
                    };
                    this.prefs.keymouse.devices.push(info);
                    this.handleChange();
                }
            }
        },
        handleDragover(e) {
            e.preventDefault();
            // console.log(e);
            // if(!e.target.classList.contains('device-col') || e.target.querySelector(".device")) {
            //     e.dataTransfer.effectAllowed = "none";
            //     e.target.draggable = false;
            // } else {
            //     e.target.draggable = true;
            // }
        },
        handleDrag(e) {
            e.dataTransfer.setData("text", e.target.id);
        },
        handleSaveDevices() {
            const fields = document.querySelectorAll(".device-row .device-col");
            // console.log(fields);

            const devices = [];
            for(let idx = 0; idx < fields.length; idx++) {
                const field = fields[idx];
                const device = field.querySelector(".device-div");
                const input = field.querySelector(".device-input");
                if(device && input) {
                    const info = {
                        type : device.getAttribute("data-type"),
                        name : input.value,
                        x : field.getAttribute("data-x"),
                        y : field.getAttribute("data-y"),
                    };
                    devices.push(info);
                }
            }
            // console.log(devices);
            this.prefs.keymouse.devices = devices;
            this.handleChange();
        },
        handleClickDevice(e) {
            // console.log(e);
            e.preventDefault();
            if(e.target.getAttribute("data-type") !== "server") {
                e.target.classList.toggle('selected');
            }
        },
        handleAddDevice(e) {
            const fields = document.querySelectorAll(".device-row .device-col");
            for(let idx = 0; idx < fields.length; idx++) {
                const field = fields[idx];
                const x = field.getAttribute("data-x");
                const y = field.getAttribute("data-y");
                const device = field.querySelector(".device-div");
                if(!device) {
                    const info = {
                        type : "client",
                        name : "NEW DEVICE #" + x + "-" + y,
                        x,
                        y,
                    };
                    this.prefs.keymouse.devices.push(info);
                    this.handleChange();
                    return;
                }
            }

            // alert("더 이상 장치를 추가할 수 없습니다.");
        },
        handleDeleteDevice(e) {
            // console.log(e);
            const fields = document.querySelectorAll(".device-div.selected");
            for(let idx = 0; idx < fields.length; idx++) {
                const field = fields[idx];
                const x = field.getAttribute("data-x");
                const y = field.getAttribute("data-y");
                this.deleteDevice(x, y);
            }
            // console.log("Delete Complete", this.prefs.keymouse.devices);
            this.handleChange();
        },
        deleteDevice(x, y) {
            const { devices } = this.prefs.keymouse;
            const newdevices = [];
            for(let idx = 0; idx < devices.length; idx++) {
                const device = devices[idx];
                if(device && ("" + device.x !== "" + x || "" + device.y !== "" + y)) {
                    newdevices.push(device);
                }
            }
            this.prefs.keymouse.devices = newdevices;
        },
        initServerDevice() {
            const { devices } = this.prefs.keymouse;
            for(let idx = 0; idx < devices.length; idx++) {
                const device = devices[idx];
                if(device && device.type === "server") {
                    return;
                }
            }

            for(let y1 = 1; y1 <= 3; y1++) {
                for(let x1 = 1; x1 <= 4; x1++) {
                    if(!this.findDevice(x1, y1)) {
                        const info = {
                            type : "server",
                            name : this.prefs.common.deviceName,
                            x : x1,
                            y : y1,
                        };
                        this.prefs.keymouse.devices.push(info);
                        return;
                    }
                }
            }
        },
        findDevice(x, y) {
            const { devices } = this.prefs.keymouse;
            let ret = null;
            const blankFields = [];
            for(let idx = 0; idx < devices.length; idx++) {
                const device = devices[idx];
                if(device && "" + device.x === "" + x && "" + device.y === "" + y) {
                    ret = device;
                    break;
                }
            }
            return ret;
        },
        findDeviceName(x, y) {
            const device = this.findDevice(x, y);
            if(device) {
                if(device.type === 'server') {
                    return this.prefs.common.deviceName;
                }
                return device.name;
            }
            return this.prefs.common.deviceName;
        },
    }
};
</script>

<style>
/*
.fullscreen {
  height: 100%;
}
.fullscreen > .card {
  height: 100%;
}
.fullscreen > .card > .card-body {
  height: calc(100% - 2.25rem);
}
.fullscreen div.tabs {
  height: 100%;
}
.tab-content {
  height: calc(100% - 2.5rem);
  overflow-y: auto;
}
*/
.card:last-child {
  margin-bottom: 0;
}
.input-group-append {
    height: 35px;
    border-radius: 0.25rem;
    border: 1px solid #23282c;
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.device-row {
    height: 80px;
    border-bottom: 1px dashed #ffffff;
    margin-left: 5px;
    margin-right: 5px;
}
.device-col {
    padding: 0;
    border-right: 1px dashed #ffffff;
}
.device-div {
    text-align: center;
    padding: 5px;
    margin: 5px;
}
.device-div.selected {
    border: 1px solid #fff;
    border-radius: 6px;
}
.device-div > .device {
    pointer-events: none;
}
.device-div > .device > i {
    font-size: 30px;
}
.device-div > .device > i.server {
    color: #20A8D8;
}
.device-div > .device > i.client {
    color: #4DBD74;
}
.device-row:last-child {
    border-bottom: 0;
}
.device-col:last-child {
    border-right: 0;
}
.col-sm-4 {
    flex: 0 0 33.33333%;
    max-width: 33.33333%;
}
.device-col {
    flex: 0 0 25%;
    max-width: 25%;
}
.draggable {
    cursor: move; /* fallback: no `url()` support or images disabled */
    cursor: -webkit-grab; /* Chrome 1-21, Safari 4+ */
    cursor:    -moz-grab; /* Firefox 1.5-26 */
    cursor:         grab; /* W3C standards syntax, should come least */
}
.draggable:active {
    cursor: -webkit-grabbing;
    cursor:    -moz-grabbing;
    cursor:         grabbing;
}
.device-div .form-group {
    margin-bottom: 0;
}

</style>
