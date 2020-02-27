<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'kr.ejsoft.socket.router'
  }
</script>

<style>
  /* CSS */
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  html, body, #app {
    margin: 0;
    height: 100%;
    overflow: hidden;
    font-size: 0.97em;
  }

</style>
