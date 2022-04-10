<template>
	<div>
		home 组件
		<el-button type="info" @click="handleClick">退出</el-button>
	</div>
</template>

<script>
export default {
	methods: {
		handleClick() {
			// 点击退出之后，直接清空sessionStorage中的数据
			window.sessionStorage.clear();
			// 跳回登录页
			this.$router.push('/login');
		},
	},
};
</script>

<style lang="less" scoped></style>
