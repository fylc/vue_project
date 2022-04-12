import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import './assets/css/global.css';
// 导入树形table表格插件
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false;
// 导入字体图标
import './assets/fonts/iconfont.css';

// 引入axios, 并且将axios挂载到原型上
import axios from 'axios';
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 设置请求拦截器
axios.interceptors.request.use(config => {
	// console.log(config);
	// 将会话存储中的token数据取出，挂载到请求头中的Authorization上，目的是为了进行权限的验证
	config.headers.Authorization = window.sessionStorage.getItem('token');
	return config;
})
Vue.prototype.$http = axios;

// 将TreeTable组件进行全局注册
Vue.component('tree-table', TreeTable)

new Vue({
	router,
	render: (h) => h(App),
}).$mount('#app');
