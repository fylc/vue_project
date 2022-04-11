<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }"
				>首页</el-breadcrumb-item
			>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- card卡片 -->
		<el-card>
			<!-- 添加角色按钮区域 -->
			<el-row>
				<el-col>
					<el-button type="primary">添加角色</el-button>
				</el-col>
			</el-row>
			<!-- 角色列表 -->
			<el-table border stripe :data="roleList">
				<!-- 展开列 -->
				<el-table-column type="expand">
					<template v-slot="slotProps">
						<el-row
							:class="[
								'bdbottom',
								i1 === 0 ? 'bdtop' : '',
								'vcenter',
							]"
							v-for="(item1, i1) in slotProps.row.children"
							:key="item1.id"
						>
							<!-- 渲染一级权限 -->
							<el-col :span="5">
								<el-tag
									@close="
										removeRightById(slotProps.row, item1.id)
									"
									closable
									>{{ item1.authName }}</el-tag
								>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!-- 渲染二级和三级权限 -->
							<el-col :span="19">
								<!-- 通过for循环嵌套渲染二级权限 -->
								<el-row
									:class="[
										i2 === 0 ? '' : 'bdtop',
										'vcenter',
									]"
									v-for="(item2, i2) in item1.children"
									:key="item2.id"
								>
									<!-- 二级权限 -->
									<el-col :span="6">
										<el-tag
											type="success"
											@close="
												removeRightById(
													slotProps.row,
													item2.id
												)
											"
											closable
											>{{ item2.authName }}</el-tag
										>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<!-- 三级权限 -->
									<el-col :span="18">
										<el-tag
											closable
											type="warning"
											v-for="(
												item3, i3
											) in item2.children"
											:key="item3.id"
											@close="
												removeRightById(
													slotProps.row,
													item3.id
												)
											"
											>{{ item3.authName }}</el-tag
										>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
						<!-- <pre>
              {{slotProps.row}}
            </pre> -->
					</template>
				</el-table-column>
				<!-- 索引列 -->
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column
					prop="roleName"
					label="角色名称"
				></el-table-column>
				<el-table-column
					prop="roleDesc"
					label="角色描述"
				></el-table-column>
				<el-table-column label="操作" width="300px">
					<template v-slot="slotProps">
						<el-button
							type="primary"
							icon="el-icon-edit"
							size="mini"
							>编辑</el-button
						>
						<el-button
							type="danger"
							icon="el-icon-delete"
							size="mini"
							>删除</el-button
						>
						<el-button
							type="warning"
							icon="el-icon-setting"
							size="mini"
							>分配权限</el-button
						>
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
			// 所有角色的列表数据
			roleList: [],
		};
	},
	created() {
		this.getRoleList();
	},
	methods: {
		// 获取角色列表数据
		async getRoleList() {
			const { data: result } = await this.$http.get('roles');
			// console.log(result);
			if (result.meta.status !== 200)
				return this.$message.error('获取角色列表失败');
			this.roleList = result.data;
		},
		// 监听三级权限点击 叉号 时触发的关闭事件
		removeRightById(role, rightId) {
			// console.log(id)
			// 弹框提示用户是否删除
			this.$confirm('确定要删除此选项吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					// 当用户点击确定按钮后,发起删除请求
					const { data: result } = await this.$http.delete(
						`roles/${role.id}/rights/${rightId}`
					);
					if (result.meta.status !== 200)
						return this.$message.error('删除权限失败');
					// 调用接口后会返回当前用户最新的权限，直接将最新的权限赋值给当前角色
					role.children = result.data;
					// 如果调用getRoleList() 会带来整个组件的数据重新渲染
					// this.getRoleList();
					this.$message({
						type: 'success',
						message: '删除成功!',
					});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
	},
};
</script>

<style lang="less" scoped>
.el-tag {
	margin: 7px;
}

.bdtop {
	border-top: 1px solid #eee;
}

.bdbottom {
	border-bottom: 1px solid #eee;
}

.vcenter {
	display: flex;
	align-items: center;
}
</style>
