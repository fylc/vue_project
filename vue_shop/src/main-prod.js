// import Vue from 'vue';
import App from './App.vue';
import router from './router/index-prod.js';
// import './plugins/element.js';
import './assets/css/global.css';
// import * as NProgress from 'nprogress';
// import 'nprogress/nprogress.css';

// editor 编辑插件
import VueQuillEditor from 'vue-quill-editor';

import 'quill/dist/quill.core.css'; // import styles
import 'quill/dist/quill.snow.css'; // for snow theme
import 'quill/dist/quill.bubble.css'; // for bubble theme

Vue.use(VueQuillEditor /* { default global options } */);

// 导入树形table表格插件
import TreeTable from 'vue-table-with-tree-grid';

Vue.config.productionTip = false;
// 导入字体图标
import './assets/fonts/iconfont.css';

// 引入axios, 并且将axios挂载到原型上
// import axios from 'axios';
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 设置请求拦截器
// 在request进度条中展示进度条
axios.interceptors.request.use((config) => {
	// console.log(config);
	NProgress.start();
	// 将会话存储中的token数据取出，挂载到请求头中的Authorization上，目的是为了进行权限的验证
	config.headers.Authorization = window.sessionStorage.getItem('token');
	return config;
});

// 在response中隐藏进度条
axios.interceptors.response.use((config) => {
	NProgress.done();

	return config;
});
Vue.prototype.$http = axios;

// 将TreeTable组件进行全局注册
Vue.component('tree-table', TreeTable);

// 注册一个全局的过滤器
Vue.filter('dateFormat', function (originVal) {
	const dt = new Date(originVal);
	const y = dt.getFullYear();
	const m = (dt.getMonth() + 1 + '').padStart(2, '0');
	const d = (dt.getDate() + '').padStart(2, '0');
	const hh = (dt.getHours() + '').padStart(2, '0');
	const mm = (dt.getMinutes() + '').padStart(2, '0');
	const ss = (dt.getSeconds() + '').padStart(2, '0');
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
	router,
	render: (h) => h(App),
}).$mount('#app');
