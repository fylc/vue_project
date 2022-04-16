<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }"
				>首页</el-breadcrumb-item
			>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- el-card -->
		<el-card>
			<!-- 输入框 -->
			<el-row>
				<el-col :span="8">
					<el-input placeholder="请输入内容">
						<el-button
							slot="append"
							icon="el-icon-search"
						></el-button>
					</el-input>
				</el-col>
			</el-row>

			<!-- table表格渲染 -->
			<el-table :data="orderlist" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column
					label="订单编号"
					prop="order_number"
				></el-table-column>
				<el-table-column
					label="订单价格"
					prop="order_price"
				></el-table-column>
				<el-table-column label="是否付款" prop="pay_status">
					<template v-slot="scope">
						<el-tag type="success" v-if="scope.row.pay_status == 1"
							>已付款</el-tag
						>
						<el-tag type="danger" v-else>未付款</el-tag>
					</template>
				</el-table-column>
				<el-table-column
					label="是否发货"
					prop="is_send"
				></el-table-column>
				<el-table-column label="下单时间" prop="create_time">
					<template v-slot="scope">
						{{ scope.row.create_time | dateFormat }}
					</template>
				</el-table-column>
				<el-table-column label="操作" prop="create_time">
					<template v-slot="scope">
						<el-button
							type="primary"
							size="mini"
							class="el-icon-edit"
							@click="dialogVisible = true"
						></el-button>
						<el-button
							type="success"
							size="mini"
							class="el-icon-location"
							@click="showProgress"
						></el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页功能 -->
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum"
				:page-sizes="[5, 10, 15]"
				:page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</el-card>

		<!-- dialog 修改地址 -->
		<el-dialog
			title="修改地址"
			:visible.sync="dialogVisible"
			width="50%"
			:before-close="handleClose"
			@close="closeRest"
		>
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="省市区/县" prop="addr1">
					<el-cascader
						v-model="editForm.addr1"
						:options="citydata"
						:props="{ expandTrigger: 'hover' }"
						@change="handleChange"
					></el-cascader>
				</el-form-item>
				<el-form-item label="省市区/县" prop="addr2">
					<el-input v-model="editForm.addr2"></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogVisible = false"
					>确 定</el-button
				>
			</span>
		</el-dialog>

		<!-- 物流窗口 -->
		<el-dialog
			title="物流进度"
			:visible.sync="progressDialogVisible"
			width="50%"
			@close="progressCloseRest"
		>
			<!-- timeline -->
			<el-timeline>
				<el-timeline-item
					v-for="(activity, index) in wlData"
					:key="index"
					:timestamp="activity.ftime"
				>
					{{ activity.context }}
				</el-timeline-item>
			</el-timeline>

			<span slot="footer" class="dialog-footer">
				<el-button @click="progressDialogVisible = false"
					>取 消</el-button
				>
				<el-button type="primary" @click="dialogVisible = false"
					>确 定</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import citydata from './citydata.js';
import wlData from './wl.js';
export default {
	data() {
		return {
			queryInfo: {
				query: '',
				pagesize: 10, // 一页当中的数据
				pagenum: 1, // 当前页码
			},
			total: 0,
			orderlist: [],
			dialogVisible: false,
			editForm: {
				addr1: '',
				addr2: '',
			},
			editFormRules: {
				addr1: [
					{
						required: true,
						message: '请输入省市区/县',
						trigger: 'blur',
					},
				],
				addr2: [
					{
						required: true,
						message: '请输入详细地址',
						trigger: 'blur',
					},
				],
			},
			citydata,
			progressDialogVisible: false,
			// 物流信息
			wlData,
		};
	},
	created() {
		this.getOrderList();
	},
	methods: {
		async getOrderList() {
			const { data: res } = await this.$http.get('orders', {
				params: this.queryInfo,
			});
			if (res.meta.status !== 200)
				return this.$message.error('获取订单信息失败');
			// console.log(res.data);
			this.total = res.data.total;
			this.orderlist = res.data.goods;
		},
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize;
			this.getOrderList();
		},
		handleCurrentChange(newNum) {
			this.queryInfo.pagenum = newNum;
			this.getOrderList();
		},
		handleClose() {
			// console.log(123)
			this.dialogVisible = false;
		},
		handleChange() {},
		closeRest() {
			this.$refs.editFormRef.resetFields();
			this.dialogVisible = false;
		},
		// 关闭物流窗口
		progressCloseRest() {
			this.progressDialogVisible = false;
		},
		async showProgress() {
			// 应该请求物流信息，但是接口存在问题，先忽略..
			console.log(wlData);
			this.progressDialogVisible = true;
		},
	},
};
</script>

<style lang="less" scoped>
.el-cascader {
	width: 100%;
}
</style>
