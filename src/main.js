import Vue from 'vue'
import App from './App.vue'
import xhImagePreview from '../dist/xh-image-preview'
// import xhImagePreview from './lib/image-preview/index.js'

Vue.use(xhImagePreview)

new Vue({
  el: '#app',
  render: h => h(App)
})
