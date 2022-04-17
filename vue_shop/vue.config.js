const { defineConfig } = require('@vue/cli-service');
const path = require('path');
// module.exports = defineConfig({
// 	transpileDependencies: true,
//   // ./ 是使用相对路径加载公共资源文件  /dist/ 是说项目放在dist目录下
// 	publicPath: '/dist/',
// });

module.exports = {
	// publicPath: '/dist/',
	chainWebpack: (config) => {
		config.when(process.env.NODE_ENV === 'production', (config) => {
			// console.log('@',config.output.publicPath);
			// config.output.publicPath('/dist/');
			config.entry('app').clear().add('./src/main-prod.js');

			config.set('externals', {
				vue: 'Vue',
				'vue-router': 'VueRouter',
				axios: 'axios',
				lodash: '_',
				echarts: 'echarts',
				nprogress: 'NProgress',
			});
		});
		config.when(process.env.NODE_ENV === 'development', (config) => {
			config.entry('app').clear().add('./src/main-dev.js');
		});
	},
};
