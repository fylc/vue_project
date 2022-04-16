<template>
	<el-container class="home_container">
		<!-- 头部区域 -->
		<el-header>
			<div>
				<img src="../assets/heima.png" alt="" />
				<span>电商后台管理系统</span>
			</div>
			<el-button type="info" @click="handleClick">退出</el-button>
		</el-header>
		<!-- 主体区域 -->
		<el-container>
			<!-- 侧边栏 -->
			<el-aside :width="isCollapse ? '64px' : '200px'">
				<div class="toggle-button" @click="toggleCollapse">|||</div>
				<!-- 侧边栏菜单 -->
				<el-menu
					background-color="#333744"
					text-color="#fff"
					active-text-color="#409eff"
					:unique-opened="true"
					:collapse="isCollapse"
					:collapse-transition="false"
          :router="true"
					:default-active="index"
				>
					<!-- 一级菜单 -->
					<el-submenu
						:index="item.id + ''"
						v-for="item of menuList"
						:key="item.id"
					>
						<!-- 一级菜单的模板区域 -->
						<template slot="title">
							<!-- 一级菜单的图标 -->
							<i :class="iconsObj[item.id]"></i>
							<!-- 一级菜单的文本 -->
							<span>{{ item.authName }}</span>
						</template>
						<!-- 二级菜单 -->
						<el-menu-item
							:index="'/' + subItem.path"
							v-for="subItem of item.children"
							:key="subItem.id"
							@click="saveNavState('/' + subItem.path)"
						>
							<template slot="title">
								<!-- 二级菜单的图标 -->
								<i class="el-icon-menu"></i>
								<!-- 二级菜单的文本 -->
								<span>{{ subItem.authName }}</span>
							</template>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<!-- 右侧内容主体 -->
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			menuList: [],
			iconsObj: {
				125: 'iconfont icon-user',
				103: 'iconfont icon-tijikongjian',
				101: 'iconfont icon-shangpin',
				102: 'iconfont icon-danju',
				145: 'iconfont icon-baobiao',
			},
			// 默认情况下不折叠
			isCollapse: false,
			index: ''
		};
	},
	created() {
		this.getMenuList();
		// 组件初始化后直接对index进行赋值
		this.index = window.sessionStorage.getItem('activePath')
	},
	methods: {
		handleClick() {
			// 点击退出之后，直接清空sessionStorage中的数据
			window.sessionStorage.clear();
			// 跳回登录页
			this.$router.push('/login');
		},
		// 获取所有的菜单
		async getMenuList() {
			const { data: result } = await this.$http.get('menus');
			// 如果失败直接消息提示
			if (result.meta.status !== 200)
				return this.$message.error(result.meta.msg);
			// 如果成功直接将菜单数据赋值给menuList
			this.menuList = result.data;
			console.log(result);
		},
		// 点击菜单按钮的折叠和展开
		toggleCollapse() {
			this.isCollapse = !this.isCollapse;
		},
		// 点击二级菜单之后，将index值存储到sessionStorage中
		saveNavState(index) {
			window.sessionStorage.setItem('activePath', index)
			this.index = index
		}
	},
};
</script>

<style lang="less" scoped>
// 每一个element的组件，标签名就是类名
.home_container {
	height: 100%;
}

.el-header {
	background-color: #373d41;
	display: flex;
	justify-content: space-between;
	padding-left: 0;
	align-items: center;
	color: #fff;
	font-size: 20px;

	> div {
		display: flex;
		align-items: center;
		> span {
			margin-left: 15px;
		}
	}
}

.el-aside {
	background-color: #333744;
}

.el-main {
	background-color: #eaedf1;
}

.el-menu {
	border-right: none;
}
.iconfont {
	margin-right: 10px;
}

.toggle-button {
	background-color: #4a5064;
	font-size: 10px;
	line-height: 24px;
	color: #fff;
	text-align: center;
	letter-spacing: 0.2em;
	cursor: pointer;
}
</style>
