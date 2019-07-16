// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import api from './utils/api'
import lrz from 'lrz'
import './assets/js/setWarp'//不同dpr手机兼容
import './assets/less/common.less'//公用样式
import common from './assets/js/common'
import 'font-awesome/css/font-awesome.css'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.config.productionTip = false;
Vue.use(preview);
Vue.use(api);
Vue.use(common);

Vue.prototype.lrz=lrz;
Vue.prototype.$newHttpsSrc = 'https://www.findif.cn/';//正式环境
// Vue.prototype.$newHttpsSrc = 'https://webapp.hiwan.net.cn/';//测试环境
Vue.prototype.jgAppKey = 'e247c401cfa87e24fd2ab961';//极光appkey

// 极光 即时通讯
require('./assets/js/Webim/jmessage-sdk-web.2.6.0.min');
// var JIM=new JMessage();
// Vue.prototype.JIM=JIM;
// JIM.onDisconnect(function(){
//   console.log('异常断线监听',"【disconnect】");
// }); //异常断线监听
import store from './store'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
