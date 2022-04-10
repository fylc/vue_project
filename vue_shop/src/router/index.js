import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';

Vue.use(VueRouter);

const routes = [
	{ path: '/', redirect: '/login' },
	{ path: '/login', component: Login },
	{ path: '/home', component: Home },
];

const router = new VueRouter({
	routes,
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
	// 如果是要去login，直接放行
	if (to.path === '/login') next();
	// 如果不是，则检查是否存在token
	const tokenStr = window.sessionStorage.getItem('token');
	// 如果不存在token，直接跳转到登录页
	if (!tokenStr) next('/login');
	// 如果存在token，直接放行
	next();
});

export default router;
