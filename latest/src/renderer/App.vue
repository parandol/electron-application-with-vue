<template>
    <router-view></router-view>
</template>

<script>
  export default {
    name: 'kr.ejsoft.socket.router',
    created() {
      document.body.classList.add("over-hidden");
    }
  }
</script>

<style lang="scss">
// @import './assets/scss/_variables.scss';

@import "~bootswatch/dist/slate/variables";
@import "~bootstrap/scss/bootstrap";
@import "~bootswatch/dist/slate/bootswatch";

// @import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
</style>
<style>
  /* @import "assets/app.css"; */
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body, #app {
    margin: 0;
    height: 100%;
    font-size: 0.9em;
  }
  
  body.over-hidden {
    overflow: hidden;
  }
  body.over-x-auto {
    overflow-x: auto;
  }
  body.over-y-auto {
    overflow-y: auto;
  }
</style>
