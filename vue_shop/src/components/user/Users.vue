<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }"
				>首页</el-breadcrumb-item
			>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
			<!-- 搜索与添加区域 -->
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input
						placeholder="请输入内容"
						v-model="queryInfo.query"
						clearable
						@clear="clearInfo"
					>
						<el-button
							slot="append"
							icon="el-icon-search"
							@click="getUserList"
						></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true"
						>添加用户</el-button
					>
				</el-col>
			</el-row>

			<!-- 用户列表区域 -->
			<el-table :data="userlist" border stripe>
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column label="姓名" prop="username"></el-table-column>
				<el-table-column label="邮箱" prop="email"></el-table-column>
				<el-table-column label="电话" prop="mobile"></el-table-column>
				<el-table-column
					label="角色"
					prop="role_name"
				></el-table-column>
				<el-table-column label="状态">
					<template v-slot:default="scopeProps">
						<!-- scopeProps.row 表示的是就是这一行对应的数据 -->
						<!-- {{ scopeProps.row }} -->

						<el-switch
							v-model="scopeProps.row.mg_state"
							@change="changeState(scopeProps.row)"
						>
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180px">
					<template v-slot="slotProps">
						<!-- {{slotProps.row}} -->
						<!-- 修改按钮 -->
						<el-button
							type="primary"
							icon="el-icon-edit"
							size="mini"
							@click="showEditDialog(slotProps.row)"
						></el-button>
						<!-- 删除按钮 -->
						<el-button
							type="danger"
							icon="el-icon-delete"
							size="mini"
							@click="removeUserById(slotProps.row.id)"
						></el-button>
						<!-- 分配角色按钮 -->
						<el-tooltip
							class="item"
							effect="dark"
							content="分配角色"
							placement="top"
							:enterable="false"
						>
							<el-button
								type="warning"
								icon="el-icon-setting"
								size="mini"
							></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>

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

		<!-- 添加用户 dialog对话框 -->
		<el-dialog
			title="添加用户"
			:visible.sync="addDialogVisible"
			width="50%"
			@close="addDialogClosed"
		>
			<!-- 内容主体区域 -->
			<!-- 添加用户表单 -->
			<el-form
				:model="addForm"
				:rules="addFormRules"
				ref="addFormRef"
				label-width="70px"
			>
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input
						v-model="addForm.password"
						type="password"
					></el-input>
				</el-form-item>

				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email" type="email"></el-input>
				</el-form-item>

				<el-form-item label="手机" prop="mobile">
					<el-input v-model="addForm.mobile" type="phone"></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部区域 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 修改用户dialog -->
		<el-dialog
			title="修改用户信息"
			:visible.sync="updateDialogVisible"
			width="50%"
			@close="updateDialogClosed"
		>
			<!-- 内容主体区域 -->
			<!-- 添加用户表单 -->
			<el-form
				:model="updateForm"
				:rules="addFormRules"
				ref="updateFormRef"
				label-width="70px"
			>
				<el-form-item label="用户名">
					<el-input v-model="updateForm.username" disabled></el-input>
				</el-form-item>

				<el-form-item label="邮箱" prop="email">
					<el-input
						v-model="updateForm.email"
						type="email"
					></el-input>
				</el-form-item>

				<el-form-item label="手机" prop="mobile">
					<el-input
						v-model="updateForm.mobile"
						type="phone"
					></el-input>
				</el-form-item>
			</el-form>
			<!-- 底部区域 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="updateDialogVisible = false"
					>取 消</el-button
				>
				<el-button type="primary" @click="updateUser">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		// 自定义验证邮箱
		const verifyEmail = (rule, value, cb) => {
			const re =
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!value) return cb(new Error('邮箱不能为空'));
			if (re.test(value)) {
				cb();
			} else {
				cb(new Error('邮箱格式不正确'));
			}
		};

		// 自定义验证手机号
		const verifyPhone = (rule, value, cb) => {
			const re =
				/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;

			if (!value) return cb(new Error('手机号不能为空'));
			if (re.test(value)) {
				cb();
			} else {
				cb(new Error('手机号格式不正确'));
			}
		};
		return {
			// 获取用户列表的参数对象
			queryInfo: {
				query: '',
				// 当前的页数
				pagenum: 1,
				// 当前每页显示多少条数据
				pagesize: 2,
			},
			userlist: [],
			total: 0,
			// 控制添加用户对话框的显示与隐藏
			addDialogVisible: false,
			// 添加用户绑定的表单
			addForm: {
				username: '',
				password: '',
				email: '',
				mobile: '',
			},
			// 添加表单的验证规则对象
			addFormRules: {
				username: [
					{
						required: true,
						message: '请输入用户名',
						trigger: 'blur',
					},
					{
						min: 3,
						max: 12,
						message: '长度在 3 到 12 个字符',
						trigger: 'blur',
					},
				],
				password: [
					{
						required: true,
						message: '请输入密码',
						trigger: 'blur',
					},
					{
						min: 6,
						max: 15,
						message: '长度在 6 到 15 个字符',
						trigger: 'blur',
					},
				],
				email: [
					{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur',
					},
					{
						required: true,
						validator: verifyEmail,
						trigger: 'blur',
					},
				],
				mobile: [
					{
						required: true,
						message: '请输入手机',
						trigger: 'blur',
					},
					{
						required: true,
						validator: verifyPhone,
						trigger: 'blur',
					},
				],
			},
			// 修改用户信息的表单
			updateForm: {},
			updateDialogVisible: false,
			// updateFormRules: {
			// 	email: [
			//     {
			// 			required: true,
			// 			message: '请输入邮箱',
			// 			trigger: 'blur',
			// 		},
			// 		{
			// 			required: true,
			// 			validator: verifyEmail,
			// 			trigger: 'blur',
			// 		},
			//   ],
			// 	mobile: [
			//     {
			// 			required: true,
			// 			message: '请输入手机',
			// 			trigger: 'blur',
			// 		},
			// 		{
			// 			required: true,
			// 			validator: verifyPhone,
			// 			trigger: 'blur',
			// 		},
			//   ],
			// },
		};
	},

	created() {
		// 在页面创建期间发起数据请求
		this.getUserList();
	},

	methods: {
		async getUserList() {
			const { data: result } = await this.$http.get('users', {
				params: this.queryInfo,
			});
			// console.log(result)
			if (result.meta.status !== 200)
				return this.$message.error('获取用户列表失败');
			this.userlist = result.data.users;
			this.total = result.data.total;
		},
		// 监听pageSize 改变的事件 -- 也就是一页当中放多少条数据
		handleSizeChange(newSize) {
			// console.log(newSize)
			this.queryInfo.pagesize = newSize;
		},
		// 监听当前页码的变化 pageIndex 就是当前页数
		handleCurrentChange(pageIndex) {
			console.log(pageIndex);
			this.queryInfo.pagenum = pageIndex;
		},
		// 监听用户状态的改变  state 参数表示新的状态的值
		async changeState({ id, mg_state: state }) {
			// console.log(id, state)
			// 获取了id和新的state之后，重新请求数据
			const { data: result } = await this.$http.put(
				`users/${id}/state/${state}`
			);
			// console.log(result);
			if (result.meta.status !== 200) {
				// 既然修改状态失败，应该把页面中的状态给重置回去
				state = !state;
				return this.$message.error('修改状态失败,请重试');
			}
			this.$message.success('状态修改成功');
		},
		// 监听clear事件，点击之后清空搜索
		clearInfo() {
			// 重新请求数据
			this.getUserList();
		},
		// 监听添加用户的dialog窗口关闭
		addDialogClosed() {
			// addFormRef
			// 通过ref 找到对话框表单，调用resetFields()方法实现重置
			this.$refs.addFormRef.resetFields();
		},
		// dialog点击确定按钮，进行用户的添加
		addUser() {
			// 在添加用户之前，对表单进行预校验
			this.$refs.addFormRef.validate(async (valid) => {
				// console.log(valid)
				if (!valid)
					return this.$message.error('数据校验未通过，请重新输入');
				// 校验通过之后直接进行数据的添加操作
				const { data: result } = await this.$http.post(
					'users',
					this.addForm
				);
				if (result.meta.status !== 201) {
					// 添加用户失败
					this.$message.error('添加用户失败,请重新添加');
				}
				this.$message.success('添加用户成功');
				// 添加用户成功之后，将dialog关闭并且表单清空
				this.addDialogVisible = false;
				this.$refs.addFormRef.resetFields();
				// console.log(result)
				this.getUserList();
			});
		},
		// 修改用户信息的对画框  id参数表示要修改的用户数据的id
		showEditDialog({ id, username, email, mobile }) {
			this.updateForm = { id, username, email, mobile };
			this.updateDialogVisible = true;
		},
		// 修改用户信息关闭dialog窗口
		updateDialogClosed() {
			this.$refs.updateFormRef.resetFields();
		},
		// 修改用户dialog窗口里面的确认按钮
		updateUser() {
			// console.log(123)
			this.$refs.updateFormRef.validate(async (valid) => {
				if (!valid)
					return this.$message.error('数据格式不正确，请重新输入');
				// 如果数据格式验证通过，直接修改用户数据
				const { data: result } = await this.$http.put(
					`users/${this.updateForm.id}`,
					{
						email: this.updateForm.email,
						mobile: this.updateForm.mobile,
					}
				);
				// console.log(result);
				if (result.meta.status !== 200)
					return this.$message.error('修改用户数据失败，请重试');
				// 关闭窗口 更新数据
				this.updateDialogVisible = false;
				this.getUserList();
				this.$message.success('修改用户数据成功');
			});
		},
		// 点击删除用户按钮触发事件  id参数为要删除的用户的id
		removeUserById(id) {
			// 拿到id之后，弹出弹窗
			this.$confirm('您将删除该用户,是否确认?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					// 当点击确认删除按钮的时候，直接在这里发送数据
					const { data: result } = await this.$http.delete(
						`users/${id}`
					);
					if (result.meta.status !== 200)
						return this.$message.error('删除失败');
					this.$message({
						type: 'success',
						message: '删除成功!',
					});
					this.getUserList();
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
	},

	watch: {
		// 监听queryInfo中的pagesize属性，一旦发生变化，就重新发起请求
		'queryInfo.pagesize'() {
			this.getUserList();
		},
		// 监听queryInfo中的pagenum属性，一旦当前页码发生变化，就重新请求数据
		'queryInfo.pagenum'() {
			this.getUserList();
		},
	},
};
</script>

<style lang="less" scoped></style>
