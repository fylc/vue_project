<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }"
				>首页</el-breadcrumb-item
			>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- card 表格 -->
		<el-card>
			<el-button type="primary" size="mini" @click="showAddCateDialog"
				>添加分类</el-button
			>

			<!-- 表格区域 -->
			<tree-table
				class="treeTable"
				:data="cateList"
				:columns="columns"
				:selection-type="false"
				:expand-type="false"
				:show-index="true"
				index-text="#"
				border
				:show-row-hover="false"
			>
				<!-- 是否有效 -->
				<template slot="isOk" scope="slotProps">
					<i
						class="el-icon-success"
						v-if="slotProps.row.cat_deleted === false"
						style="color: lightgreen"
					></i>
					<i class="el-icon-error" v-else style="color: red"></i>
				</template>
				<!-- 排序 -->
				<template slot="order" scope="slotProps">
					<el-tag size="mini" v-if="slotProps.row.cat_level === 0"
						>一级</el-tag
					>
					<el-tag
						size="mini"
						type="success"
						v-else-if="slotProps.row.cat_level === 1"
						>二级</el-tag
					>
					<el-tag size="mini" type="warning" v-else>三级</el-tag>
				</template>

				<template slot="opt">
					<el-button type="primary" class="el-icon-edit" size="mini"
						>编辑</el-button
					>
					<el-button type="danger" icon="el-icon-delete" size="mini"
						>删除</el-button
					>
				</template>
			</tree-table>

			<!-- 分页区域 -->
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum"
				:page-sizes="[1, 2, 5, 10]"
				:page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
				<!-- layout中的total 表示分页组件显示 数据总条数 sizes 表示 一页显示数据的条数-->
			</el-pagination>
		</el-card>

		<!-- 添加分类的对话框 -->
		<el-dialog
			title="添加分类"
			:visible.sync="addCateDialogVisible"
			width="50%"
			@close="addCateDialogClosed"
		>
			<!-- 添加分类的表单信息 -->
			<el-form
				:model="addCateForm"
				:rules="addCateFormRules"
				ref="addCateFormRef"
				label-width="100px"
			>
				<el-form-item label="分类名称:" prop="cat_name">
					<el-input v-model="addCateForm.cat_name"></el-input>
				</el-form-item>

				<el-form-item label="父级分类:" style="position: relative">
					<!-- options 用来指定数据源 -->
					<!-- props 用来指定配置对象 -->
					<el-cascader
						v-model="selectedKeys"
						:options="parentCateList"
						:props="cascaderProps"
						@change="parentCateChanged"
						clearable
						:change-on-select="true"
					></el-cascader>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addCateDialogVisible = false"
					>取 消</el-button
				>
				<el-button type="primary" @click="addCate">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// 商品分类的数据列表，默认为空
			cateList: [],
			// 查询条件
			queryInfo: {
				type: 3,
				pagenum: 1,
				pagesize: 5,
			},
			total: 0,
			columns: [
				{
					label: '分类名称',
					prop: 'cat_name',
				},
				{
					label: '是否有效',
					// 表示，将当前列定义为模板列
					type: 'template',
					// 表示当前这一列使用的模板名称
					template: 'isOk',
				},
				{
					label: '排序',
					// 表示，将当前列定义为模板列
					type: 'template',
					// 表示当前这一列使用的模板名称
					template: 'order',
				},
				{
					label: '操作',
					// 表示，将当前列定义为模板列
					type: 'template',
					// 表示当前这一列使用的模板名称
					template: 'opt',
				},
			],
			// 添加分类对话框的显示与隐藏
			addCateDialogVisible: false,
			// 添加分类的表单信息
			addCateForm: {
				// 将要添加的分类名称
				cat_name: '',
				// 父级分类的id
				cat_pid: 0,
				// 分类等级，默认要添加的是1级分类
				cat_level: 0,
			},
			// 添加分类表单的验证规则
			addCateFormRules: {
				cate_name: [
					{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur',
					},
				],
			},
			// 父级分类的列表
			parentCateList: [],
			// 指定级联选择器的配置对象
			cascaderProps: {
				expandTrigger: 'hover',
				// 取消父子节点默认的关联，这样就能单独选择父节点, 如果值为false,就不能单独选择父节点
				checkStrictly: true,
				value: 'cat_id',
				label: 'cat_name',
				children: 'children',
			},
			// 当前选中的分类的id
			selectedKeys: [],
		};
	},
	created() {
		this.getCateList();
	},

	methods: {
		// 获取商品分类列表数据
		async getCateList() {
			const { data: res } = await this.$http.get('categories', {
				params: this.queryInfo,
			});
			if (res.meta.status !== 200)
				return this.$message.error('获取商品分类数据失败');
			console.log(res.data.result);
			// 把数据列表放到 cateList 中
			this.cateList = res.data.result;
			this.total = res.data.total;
		},
		// 监听pagesize改变的事件
		handleSizeChange(newPageSize) {
			// 获取到最新的pageSize之后，立即将这个值赋值给queryInfo中的pagesize
			this.queryInfo.pagesize = newPageSize;
			this.getCateList();
		},
		// 监听pagenum改变的事件
		handleCurrentChange(newPage) {
			// 监听到页码值得变化，立刻将这个值赋值给queryInfo中的pagenum
			this.queryInfo.pagenum = newPage;
			this.getCateList();
		},
		// 点击展示添加分类对话框
		showAddCateDialog() {
			// 先获取父级的分类的数据列表
			this.getParentCateList();
			// 再展示出对话框
			this.addCateDialogVisible = true;
		},
		// 获取父级分类的数据列表
		async getParentCateList() {
			const { data: result } = await this.$http.get('categories', {
				params: { type: 2 },
			});
			if (result.meta.status !== 200)
				return this.$message.error('获取父级分类数据失败');
			// console.log(result)
			this.parentCateList = result.data;
		},
		// 分类选择项发生变化触发这个函数
		parentCateChanged() {
			console.log(this.selectedKeys);
			// 如果selectedKeys数组的length大于0，证明选中了父级分类，
			// 反之，就说明没有选中任何的父级分类
			if (this.selectedKeys.length > 0) {
				this.addCateForm.cat_pid =
					this.selectedKeys[this.selectedKeys.length - 1];
				// 为当前分类的等级赋值
				this.addCateForm.cat_level = this.selectedKeys.length;
				return;
			} else {
				this.addCateForm.cat_pid = 0;
				this.addCateForm.cat_level = 0;
			}
		},
		// 点击按钮添加新的分类
		addCate() {
			console.log(this.addCateForm);
			this.$refs.addCateFormRef.validate(async (valid) => {
				if (!valid) return;
				const { data: res } = await this.$http.post(
					'categories',
					this.addCateForm
				);
				console.log(res);
				if (res.meta.status !== 201)
					return this.$message.error('添加分类失败');
				this.$message.success('添加分类成功');
				this.addCateDialogVisible = false;
				this.getCateList();
			});
		},
		// 关闭添加分类对话框,重置表单的数据
		addCateDialogClosed() {
			// 清空表单数据
			this.$refs.addCateFormRef.resetFields();
			// 清空级联选择器绑定的数组
			this.selectedKeys = [];
		},
	},
};
</script>

<style lang="less" scoped>
.treeTable {
	margin-top: 15px;
}

.el-cascader {
	width: 100%;
}
</style>
