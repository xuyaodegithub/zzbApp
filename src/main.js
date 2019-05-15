// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import { Lazyload, Loading, Dialog, Toast } from 'vant';
import * as filters from 'utils/filter';
import 'sty/reset.css';
import 'sty/common.styl';
import 'sty/vant-reset.styl';
import 'font/iconfont.js';
import 'font/iconfont.css';
import axios from 'axios';
// import Vconsole from 'vconsole';

// FastClick
import FastClick from 'fastclickx';
FastClick.attach(document.body);

axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;

// const vConsole = new Vconsole(); .use(vConsole)

Vue.use(Lazyload).use(Loading).use(Dialog).use(Toast);

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
