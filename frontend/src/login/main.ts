import Vue from 'vue';
import './../plugins/bootstrap-vue'
import Login from './Login.vue';

Vue.config.productionTip = false;

let vm = new Vue({
  render: h => h(Login),
}).$mount('#app');