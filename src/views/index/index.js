// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './index.vue'
import router from '../../router'
import axiosRequest from '../../service/axios'

import '../../config/rem.js'
import '../../styles/index.scss'
Vue.config.productionTip = false

//fastclick
import FastClick from 'fastclick'
FastClick.attach(document.body);
//axios请求引入
Vue.use(axiosRequest)
/* eslint-disable no-new */

//vux
import  { LoadingPlugin } from 'vux'
Vue.use(LoadingPlugin)
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
