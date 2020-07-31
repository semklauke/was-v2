import Vue from 'vue';
import './plugins/bootstrap-vue'
import './plugins/vue-axios';
import App from './App.vue';
import router from './router';
import cookie from 'cookie';
import io from 'socket.io-client';


Vue.config.productionTip = false;

let vm = new Vue({
    data: {
        socket: null   
    },
    router,
    render: h => h(App),
}).$mount('#app');

//@ts-ignore
vm.axios.interceptors.request.use(function (config: any) {
    config.timeout = 1000;
    config.validateStatus = function (status: number) {
        return true
    };
    let sid: { [key: string] : string } = cookie.parse(document.cookie);
    if (sid['connect.id']) {
        config.headers.cookie += cookie.serialize('connect.id', sid['connect.id'], {
            secure: true,
        }) + ";";
    }
    return config;
}, function (error: any) {
    return Promise.reject(error);
});

//@ts-ignore
vm.socket = io({secure: true, reconnect: true});
