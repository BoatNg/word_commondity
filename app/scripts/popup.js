
import Vue from 'vue'
import PopupApp from './components/PopupApp.vue'
import ElementUI from 'element-ui';
import jQuery from "jquery";
import uiInit from "./helpers/jquery-ui.min";
uiInit(jQuery);

Vue.use(ElementUI);
new Vue({
  el: '#app',
  render: h => h(PopupApp),
})
