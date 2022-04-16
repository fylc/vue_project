<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }"
				>首页</el-breadcrumb-item
			>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- el-card -->
		<el-card>
			<!-- 消息提示框 -->
			<el-alert
				title="添加商品信息"
				center
				type="info"
				show-icon
				:closable="false"
			>
			</el-alert>

			<!-- 步骤条 -->
			<el-steps
				:space="200"
				:active="activeIndex - 0"
				finish-status="success"
				align-center
			>
				<el-step title="基本信息"></el-step>
				<el-step title="商品参数"></el-step>
				<el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>

			<el-form
				:model="addForm"
				:rules="addFormRules"
				ref="addFormRef"
				label-width="100px"
				label-position="top"
			>
				<!-- tab栏区域 -->
				<el-tabs
					:tab-position="'left'"
					v-model="activeIndex"
					:before-leave="handleActiveTab"
					@tab-click="tabClicked"
				>
					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="addForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
							<el-input
								v-model="addForm.goods_price"
								type="number"
							></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
							<el-input
								v-model="addForm.goods_weight"
								type="number"
							></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
							<el-input
								v-model="addForm.goods_number"
								type="number"
							></el-input>
						</el-form-item>

						<el-form-item label="商品分类">
							<el-cascader
								v-model="addForm.goods_cat"
								:options="cateList"
								:props="cateProps"
								@change="handleChange"
							></el-cascader>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name="1">
						<el-form-item
							v-for="item in manyTableData"
							:label="item.attr_name"
							:key="item.attr_id"
						>
							<!-- 复选框组 -->
							<el-checkbox-group v-model="item.attr_vals">
								<el-checkbox
									border
									v-for="(cb, i) in item.attr_vals"
									:key="i"
									:label="cb"
								></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品属性" name="2">
						<el-form-item
							:label="item.attr_name"
							v-for="item in onlyTableData"
							:key="item.attr_id"
						>
							<el-input v-model="item.attr_vals"></el-input>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品图片" name="3">
						<!-- 上传图片 -->
						<el-upload
							class="upload-demo"
							:action="actionUploadUrl"
							:on-preview="handlePreview"
							:on-remove="handleRemove"
							list-type="picture"
							:headers="headerObj"
							:on-success="handleSuccess"
						>
							<el-button size="small" type="primary"
								>点击上传</el-button
							>
						</el-upload>
					</el-tab-pane>
					<el-tab-pane label="商品内容" name="4">
						<!--富文本编辑器  -->
						<quill-editor
							v-model="addForm.goods_introduce"
						></quill-editor>

						<!-- 点击添加商品按钮 -->
						<el-button
							type="primary"
							@click="addGoods"
							class="addGoods"
							>添加商品</el-button
						>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>

		<!-- 图片预览使用的dialog -->
		<el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
			<img :src="previewUrl" alt="图片预览" class="preiewClass" />
		</el-dialog>
	</div>
</template>

<script>
import _ from 'lodash';
export default {
	data() {
		return {
			// 进度条
			activeIndex: '0',
			// 添加商品信息表单
			addForm: {
				goods_name: '', // 商品名称
				goods_price: 0, // 商品价格
				goods_weight: 0, // 商品重量
				goods_number: 0, // 商品数量
				goods_cat: [], // 商品分类
				pics: [], // 上传图片的列表
				goods_introduce: '', // 富文本编辑器内容
				attrs: [], // 包含动态参数和静态属性的数组
			},
			// 添加商品信息表单验证规则
			addFormRules: {
				goods_name: [
					{
						required: true,
						message: '请输入商品名称',
						trigger: 'blur',
					},
				],
				goods_price: [
					{
						required: true,
						message: '请输入商品价格',
						trigger: 'blur',
					},
				],
				goods_weight: [
					{
						required: true,
						message: '请输入商品重量',
						trigger: 'blur',
					},
				],
				goods_number: [
					{
						required: true,
						message: '请输入商品数量',
						trigger: 'blur',
					},
				],
			},
			// 分类列表
			cateList: [],
			cateProps: {
				expandTrigger: 'hover', // 触发方式
				label: 'cat_name', // 级联选择器显示的字段
				value: 'cat_id', // 级联选择器的值
				children: 'children',
			},
			// 动态参数列表数据
			manyTableData: [],
			// 静态属性列表数据
			onlyTableData: [],
			// 上传图片的地址
			actionUploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
			headerObj: {
				Authorization: window.sessionStorage.getItem('token'),
			},
			// 预览图片的地址
			previewUrl: '',
			// 是否显示预览图片的窗口
			previewVisible: false,
		};
	},
	created() {
		this.getCateList();
	},
	methods: {
		async getCateList() {
			const { data: res } = await this.$http.get('categories');
			if (res.meta.status !== 200)
				return this.$message.error('获取分类列表失败');

			this.cateList = res.data;
			console.log(this.cateList);
		},
		// 级联选择器发生改变
		handleChange() {
			if (this.addForm.goods_cat.length !== 3) {
				this.addForm.goods_cat = [];
			}
		},
		// 切换左侧tab选项
		handleActiveTab(activeName, oldName) {
			// console.log(activeName, oldName);
			if (oldName == '0' && this.addForm.goods_cat.length !== 3) {
				this.$message.error('请选择商品分类，切换失败');
				return false;
			}
		},
		// 切换tab选项卡时触发
		async tabClicked() {
			// console.log(this.activeIndex);
			// 当切换到商品参数选项时
			if (this.activeIndex === '1') {
				// 请求参数
				const { data: res } = await this.$http.get(
					`categories/${this.cateId}/attributes`,
					{
						params: {
							sel: 'many',
						},
					}
				);
				if (res.meta.status !== 200)
					return this.$message.error('获取商品参数失败');
				// console.log(res.data)
				// 处理res.data中的attr_vals属性
				res.data.forEach((item) => {
					// 判断item.attr_vals是否为空
					item.attr_vals =
						item.attr_vals.length === 0
							? []
							: item.attr_vals.split(' ');
				});
				// console.log(res.data)

				this.manyTableData = res.data;
			} else if (this.activeIndex === '2') {
				// 商品属性
				const { data: res } = await this.$http.get(
					`categories/${this.cateId}/attributes`,
					{
						params: {
							sel: 'only',
						},
					}
				);
				if (res.meta.status !== 200)
					return this.$message.error('获取商品属性失败');
				this.onlyTableData = res.data;
				console.log(this.onlyTableData);
			}
		},
		// 点击已经上传的图片时
		handlePreview(file) {
			const url = file.response.data.url;
			// console.log(url);
			this.previewUrl = url;
			this.previewVisible = true;
		},
		// 移除图片
		handleRemove(file) {
			// console.log(file);
			const removeFilePath = file.response.data.tmp_path;
			this.addForm.pics = this.addForm.pics.filter(
				(item) => item.pic !== removeFilePath
			);
			// console.log(this.addForm.pics)
		},
		// 图片上传成功的钩子
		handleSuccess(response) {
			// console.log(response);
			const url = response.data.tmp_path;
			const upload = { pic: url };
			// 将对象压入到数组中
			this.addForm.pics.push(upload);
			// console.log(this.addForm.pics);
		},

		// 点击添加商品
		addGoods() {
			// console.log(this.addForm);
			// 点击添加商品按钮，进行表单验证
			this.$refs.addFormRef.validate(async valid => {
				if (!valid) return this.$message.error('请完善表单信息');
				// 如果表单验证通过，则发送请求
				// console.log('通过验证')
				const form = _.cloneDeep(this.addForm);
				form.goods_cat = form.goods_cat.join(',');
				this.manyTableData.forEach((item) => {
					const obj = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') };
					this.addForm.attrs.push(obj);
				});
				this.onlyTableData.forEach((item) => {
					const obj = { attr_id: item.attr_id, attr_value: item.attr_vals };
					this.addForm.attrs.push(obj);
				});
				form.attrs = this.addForm.attrs;
				// 发送请求，添加商品
				const { data: res} = await this.$http.post('goods', form);
				if (res.meta.status !== 201) return this.$message.error('添加商品失败');
				this.$message.success('添加商品成功');
				this.$router.push('/goods')
				console.log(form);
			});
		},
	},

	computed: {
		cateId() {
			return this.addForm.goods_cat[this.addForm.goods_cat.length - 1];
		},
	},
};
</script>

<style lang="less" scoped>
.el-checkbox {
	margin: 0 5px 0 0 !important;
}

.preiewClass {
	width: 100%;
}

.addGoods {
	margin-top: 15px;
}
</style>
