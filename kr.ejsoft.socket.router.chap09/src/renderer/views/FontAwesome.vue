<template>
  <b-card no-body>
    <DialogHeader name="fontawesome"></DialogHeader>
    <b-tabs card>
      <template v-for="(icons, index) in icons">
        <b-tab no-body :title="icons.title" :active="index === 0">
          <FontAwesomeIcons :icons="icons" />
        </b-tab>
      </template>
    </b-tabs>
  </b-card>
</template>

<script>
import { remote, ipcRenderer } from "electron";
import Vue from 'vue';
// import { DialogHeader } from '../components/DialogHeader'
const DialogHeader = require('../components/DialogHeader').default;

import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import FontAwesomeIcons from './FontAwesomeIcons'

export default {
  name: "fontawesome-page",
  components: {
    FontAwesomeIcons,
    DialogHeader
  },
  data() {
    return {
      icons : [
        {title: "Bootstrap Icons v2.2.0", type:"bootstrap", icons : [
          'alarm', 'alarm-fill', 'alert-circle', 'alert-circle-fill', 'alert-octagon',
          'alert-octagon-fill', 'alert-square', 'alert-square-fill', 'alert-triangle', 'alert-triangle-fill',
          'archive', 'archive-fill', 'arrow-bar-bottom', 'arrow-bar-left', 'arrow-bar-right',
          'arrow-bar-up', 'arrow-clockwise', 'arrow-counterclockwise', 'arrow-down', 'arrow-down-left',
          'arrow-down-right', 'arrow-down-short', 'arrow-left', 'arrow-left-right', 'arrow-left-short',
          'arrow-repeat', 'arrow-right', 'arrow-right-short', 'arrow-up', 'arrow-up-down',
          'arrow-up-left', 'arrow-up-right', 'arrow-up-short', 'arrows-angle-contract', 'arrows-angle-expand',
          'arrows-collapse', 'arrows-expand', 'arrows-fullscreen', 'at', 'award',
          'backspace', 'backspace-fill', 'backspace-reverse', 'backspace-reverse-fill', 'bar-chart',
          'bar-chart-fill', 'battery', 'battery-charging', 'battery-full', 'bell',
          'bell-fill', 'blank', 'blockquote-left', 'blockquote-right', 'book',
          'book-half-fill', 'bookmark', 'bookmark-fill', 'bootstrap', 'bootstrap-fill',
          'bootstrap-reboot', 'box-arrow-bottom-left', 'box-arrow-bottom-right', 'box-arrow-down', 'box-arrow-left',
          'box-arrow-right', 'box-arrow-up', 'box-arrow-up-left', 'box-arrow-up-right', 'braces',
          'brightness-fill-high', 'brightness-fill-low', 'brightness-high', 'brightness-low', 'brush',
          'bucket', 'bucket-fill', 'building', 'bullseye', 'calendar',
          'calendar-fill', 'camera', 'camera-video', 'camera-video-fill', 'capslock',
          'capslock-fill', 'chat', 'chat-fill', 'check', 'check-box',
          'check-circle', 'chevron-compact-down', 'chevron-compact-left', 'chevron-compact-right', 'chevron-compact-up',
          'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 'circle',
          'circle-fill', 'circle-half', 'circle-slash', 'clock', 'clock-fill',
          'cloud', 'cloud-download', 'cloud-fill', 'cloud-upload', 'code',
          'code-slash', 'columns', 'columns-gutters', 'command', 'compass',
          'cone', 'cone-striped', 'controller', 'credit-card', 'cursor',
          'cursor-fill', 'dash', 'diamond', 'diamond-half', 'display',
          'display-fill', 'document', 'document-code', 'document-diff', 'document-richtext',
          'document-spreadsheet', 'document-text', 'documents', 'documents-alt', 'dot',
          'download', 'egg-fried', 'eject', 'eject-fill', 'envelope',
          'envelope-fill', 'envelope-open', 'envelope-open-fill', 'eye', 'eye-fill',
          'eye-slash', 'eye-slash-fill', 'filter', 'flag', 'flag-fill',
          'folder', 'folder-fill', 'folder-symlink', 'folder-symlink-fill', 'fonts',
          'forward', 'forward-fill', 'gear', 'gear-fill', 'gear-wide',
          'gear-wide-connected', 'geo', 'graph-down', 'graph-up', 'grid',
          'grid-fill', 'hammer', 'hash', 'heart', 'heart-fill',
          'house', 'house-fill', 'image', 'image-alt', 'image-fill',
          'images', 'inbox', 'inbox-fill', 'inboxes', 'inboxes-fill',
          'info', 'info-fill', 'info-square', 'info-square-fill', 'justify',
          'justify-left', 'justify-right', 'kanban', 'kanban-fill', 'laptop',
          'layout-sidebar', 'layout-sidebar-reverse', 'layout-split', 'list', 'list-check',
          'list-ol', 'list-task', 'list-ul', 'lock', 'lock-fill',
          'map', 'mic', 'moon', 'music-player', 'music-player-fill',
          'option', 'outlet', 'pause', 'pause-fill', 'pen',
          'pencil', 'people', 'people-fill', 'person', 'person-fill',
          'phone', 'phone-landscape', 'pie-chart', 'pie-chart-fill', 'play',
          'play-fill', 'plug', 'plus', 'power', 'question',
          'question-fill', 'question-square', 'question-square-fill', 'reply', 'reply-all',
          'reply-all-fill', 'reply-fill', 'screwdriver', 'search', 'shield',
          'shield-fill', 'shield-lock', 'shield-lock-fill', 'shield-shaded', 'shift',
          'shift-fill', 'skip-backward', 'skip-backward-fill', 'skip-end', 'skip-end-fill',
          'skip-forward', 'skip-forward-fill', 'skip-start', 'skip-start-fill', 'speaker',
          'square', 'square-fill', 'square-half', 'star', 'star-fill',
          'star-half', 'stop', 'stop-fill', 'stopwatch', 'stopwatch-fill',
          'sun', 'table', 'tablet', 'tablet-landscape', 'tag',
          'tag-fill', 'terminal', 'terminal-fill', 'text-center', 'text-indent-left',
          'text-indent-right', 'text-left', 'text-right', 'three-dots', 'three-dots-vertical',
          'toggle-off', 'toggle-on', 'toggles', 'tools', 'trash',
          'trash-fill', 'triangle', 'triangle-fill', 'triangle-half', 'trophy',
          'tv', 'tv-fill', 'type', 'type-bold', 'type-h1',
          'type-h2', 'type-h3', 'type-italic', 'type-strikethrough', 'type-underline',
          'unlock', 'unlock-fill', 'upload', 'volume-down', 'volume-down-fill',
          'volume-mute', 'volume-mute-fill', 'volume-up', 'volume-up-fill', 'wallet',
          'watch', 'wifi', 'window', 'wrench', 'x',
          'x-circle', 'x-circle-fill', 'x-octagon', 'x-octagon-fill', 'x-square',
          'x-square-fill'
          ]},
        {title : "Font Awesome, Solid", icons : fas},
        {title : "Font Awesome, Regular", icons : far},
        {title : "Font Awesome, Brands", icons : fab}
      ]
    }
  },
  created() {
  },
  mounted() {
  }
};
</script>

<style>
body {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
