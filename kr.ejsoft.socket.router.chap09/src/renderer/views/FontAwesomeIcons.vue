<template>
  <div class="flex flex-row flex-wrap">
    <h4 class="mx-3 my-2">{{ icons.title }}</h4>
    <template v-for="(icon, key) in icons.icons">
      <div class="col-4 col-md-3 col-lg-2 col-xl-1 my-1 d-inline-block">

        <template v-if="icons.type === 'bootstrap'">
          <b-card no-body>
            <b-card-body class="text-center">
              <b-icon :icon='icon' font-scale='3'></b-icon>
            </b-card-body>
            <b-card-footer class="text-center">
              {{ icon }}
            </b-card-footer>
          </b-card>
        </template>

        <template v-else>
          <b-card no-body>
            <b-card-body class="text-center">
              <font-awesome-icon :icon="[icon.prefix, icon.iconName]" size="3x" />
            </b-card-body>
            <b-card-footer class="text-center">
              {{ icon.prefix }} {{ icon.iconName }}
            </b-card-footer>
          </b-card>
        </template>
        
      </div>
    </template>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
    name: "fontawesome-page",
    components: {
    },
    props: {
      icons: {
        type: [Array, Object],
        required:true
      }
    },
    data() {
      return {

      }
    },
    mounted() {
    },
    methods : {
    }
};
</script>
