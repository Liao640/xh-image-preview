import Vue from 'vue'
import App from './App.vue'
import xhImagePreview from '../dist/xh-image-preview'

Vue.use(xhImagePreview)

new Vue({
  el: '#app',
  render: h => h(App)
})
