import Vue from 'vue'
import Vuex from "vuex"

Vue.use(Vuex);


const appOptions = require('./main.vue');
window.addEventListener("load", ()=>new Vue(appOptions).$mount('#app-entrypoint'), false);
