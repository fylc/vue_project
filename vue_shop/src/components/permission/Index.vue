<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }"
				>首页</el-breadcrumb-item
			>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图 -->
		<el-card>
			<el-table :data="rightsList" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column
					prop="authName"
					label="权限名称"
				></el-table-column>
				<el-table-column prop="path" label="路径"></el-table-column>
				<el-table-column
					prop="level"
					label="权限等级"
				>
          <template v-slot="scopeProps">
            <el-tag v-if="scopeProps.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scopeProps.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			rightsList: [],
		};
	},
	created() {
		// 发起请求，获取权限列表数据;
		this.getRightsList();
	},
	methods: {
		// 获取权限列表
		async getRightsList() {
			const { data: result } = await this.$http.get('rights/list');
			if (result.meta.status !== 200)
				return this.$message.error('获取权限列表失败');
			this.rightsList = result.data;
		},
	},
};
</script>

<style lang="less" scoped></style>
