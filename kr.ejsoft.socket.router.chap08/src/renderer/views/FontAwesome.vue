<template>
  <b-container fluid>
    <h4>Font Awesome, Solid</h4>
    <ul class="flex flex-row flex-wrap">
    <template v-for="(icon, key) in fasIcons">
      <li class="col-4 col-md-3 col-lg-2 col-xl-1 my-1 d-inline-block">
        <b-card no-body>
          <b-card-body class="text-center">
            <font-awesome-icon :icon="[icon.prefix, icon.iconName]" size="3x" />
          </b-card-body>
          <b-card-footer class="text-center">
            {{ icon.prefix }} {{ icon.iconName }}
          </b-card-footer>
        </b-card>
      </li>
    </template>
    </ul>
    
    <h4>Font Awesome, Regular</h4>
    <template v-for="(icon, key) in farIcons">
      <li class="col-4 col-md-3 col-lg-2 my-1 d-inline-block">
        <b-card no-body>
          <b-card-body class="text-center">
            <font-awesome-icon :icon="[icon.prefix, icon.iconName]" size="3x" />
          </b-card-body>
          <b-card-footer class="text-center">
            {{ icon.prefix }} {{ icon.iconName }}
          </b-card-footer>
        </b-card>
      </li>
    </template>

    <h4>Font Awesome, Brands</h4>
    <template v-for="(icon, key) in fabIcons">
      <li class="col-4 col-md-3 col-lg-2 my-1 d-inline-block">
        <b-card no-body>
          <b-card-body class="text-center">
            <font-awesome-icon :icon="[icon.prefix, icon.iconName]" size="3x" />
          </b-card-body>
          <b-card-footer class="text-center">
            {{ icon.prefix }} {{ icon.iconName }}
          </b-card-footer>
        </b-card>
      </li>
    </template>
      
  </b-container>
</template>

<script>
import { remote, ipcRenderer } from "electron";
import Vue from 'vue';

import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

export default {
    name: "fontawesome-page",
    components: {
    },
    data() {
      return {

      }
    },
    mounted() {
    },
    computed : {
      farIcons : function() {
        return far;
      },
      fasIcons : function() {
        return fas;
      },
      fabIcons : function() {
        return fab;
      }
    },
    methods : {
    }
};
</script>

<style>
body {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
