import Vue from 'vue';
import * as VeeValidate from 'vee-validate';
import App from './App.vue';
import store from './store';
import router from './router';
import Layout from "@/components/layout.vue"; //สร้างโกลบอลไว้เรียกใช้สำหรับทุกหน้าได้เลย

import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'alertifyjs/build/css/alertify.css'
import 'alertifyjs/build/css/themes/default.css'
import './assets/styles.css';
import 'fullcalendar/dist/fullcalendar.css'


import * as jquery from 'jquery';
import * as alertify from  'alertifyjs'
import 'bootstrap/dist/js/bootstrap.js';
import 'fullcalendar'



Vue.config.productionTip = false
Vue.prototype.jquery = jquery;
Vue.prototype.alertify = alertify;
Vue.use(VeeValidate);
Vue.component('Layout',Layout)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
