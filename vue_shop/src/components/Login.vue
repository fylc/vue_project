<template>
	<div class="login_container">
		<div class="login_box">
			<!-- 头像区域 -->
			<div class="avatar_box">
				<img src="../assets/logo.png" alt="" />
			</div>

			<!-- 表单区域 -->
			<el-form
				label-width="0"
				:rules="loginFormRules"
				class="login_form"
				:model="loginForm"
				ref="loginFormRef"
			>
				<!-- 用户名 -->
				<el-form-item prop="username">
					<el-input v-model="loginForm.username"
						><i slot="prefix" class="iconfont icon-user"></i
					></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="password">
					<el-input type="password" v-model="loginForm.password"
						><i slot="prefix" class="iconfont icon-3702mima"></i
					></el-input>
				</el-form-item>
				<!-- 按钮区域 -->
				<el-form-item class="btns">
					<el-button type="primary" @click="handleLogin"
						>登录</el-button
					>
					<el-button type="info" @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		const verifyUsername = (rule, value, cb) => {
			const re = /^[A-Za-z]\w{2,11}$/g;
			const end = re.test(value);
			return end
				? cb()
				: cb('用户名格式不正确，应为3到12位，第一位应为英文字母');
		};
		return {
			loginForm: {
				username: 'admin',
				password: '123456',
			},
			loginFormRules: {
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
					{ validator: verifyUsername, trigger: 'blur' },
				],
				password: [
					{
						required: true,
						message: '请输入密码',
						trigger: 'blur',
					},
					{
						min: 5,
						max: 18,
						message: '长度在 5 到 18 个字符',
						trigger: 'blur',
					},
				],
			},
		};
	},
	methods: {
		handleReset() {
			// 点击按钮进行重置
			this.$refs.loginFormRef.resetFields();
		},
		handleLogin() {
			this.$refs.loginFormRef.validate(async (valid) => {
				if (!valid) return;
				const { data: result } = await this.$http.post(
					'login',
					this.loginForm
				);
				console.log(result);
				if (result.meta.status !== 200)
					return this.$message.error('登录失败');
				this.$message.success('登录成功');
        // 将传递回来的token存储到storage中
        window.sessionStorage.setItem('token', result.data.token);
        // 通过编程式导航跳转到后台主页，路由地址是 /home 
        this.$router.push('/home');
			});
		},
	},
};
</script>

<style lang="less" scoped>
.login_container {
	background-color: #2b4b6b;
	height: 100%;
}

.login_box {
	width: 450px;
	height: 300px;
	background-color: #fff;
	border-radius: 3px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);

	.avatar_box {
		height: 130px;
		width: 130px;
		border: 1px solid #eee;
		border-radius: 50%;
		padding: 10px;
		box-shadow: 0 0 10px #ddd;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background-color: #eee;
		}
	}
}

.login_form {
	position: absolute;
	bottom: 0;
	width: 100%;
	padding: 0 20px;
	box-sizing: border-box;
}

.btns {
	display: flex;
	justify-content: flex-end;
}
</style>
