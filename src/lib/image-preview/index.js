import XhImagePreview from './src/index.vue';

//注册组件
XhImagePreview.install = Vue => Vue.component(XhImagePreview.name, XhImagePreview);

/* 支持使用标签的方式引入 Vue是全局变量时，自动install */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(XhImagePreview.name, XhImagePreview);
}
export default XhImagePreview;