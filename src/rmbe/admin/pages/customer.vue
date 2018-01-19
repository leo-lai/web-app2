<template>
	<div class="l-main-body">
		<!-- <el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent>
  				<el-form-item style="width: 140px;" prop="nickname" lalel="">
				    <el-input placeholder="昵称" v-model="list.filter.nickname"></el-input>
				  </el-form-item>
				  <el-form-item style="width: 140px;" prop="name" lalel="">
				    <el-input placeholder="姓名" v-model="list.filter.name"></el-input>
				  </el-form-item>
				  <el-form-item style="width: 140px;" prop="tel" lalel="">
				    <el-input placeholder="手机号码" v-model="list.filter.tel"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row> -->
		<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <!-- <el-table-column label="账号" prop="username"></el-table-column> -->
	    <el-table-column type="index" width="50"></el-table-column>
	    <el-table-column label="头像" prop="thumb" align="center">
	    	<template slot-scope="scope">
	    		<img width="50" height="50" :src="scope.row.thumb" alt="">
	    	</template>
	    </el-table-column>
	    <el-table-column label="昵称" prop="nickname" align="center"></el-table-column>
	    <!-- <el-table-column label="姓名" prop="name" align="center"></el-table-column> -->
	    <!-- <el-table-column label="手机号码" prop="tel" align="center"></el-table-column> -->
	    <!-- <el-table-column label="性别" prop="gender" align="center">
	    	<template slot-scope="scope">
	    		<span v-if="scope.row.gender === 'male'">男</span>
	    		<span v-if="scope.row.gender === 'famale'">女</span>
	    	</template>
	    </el-table-column> -->
	    <el-table-column label="累计消费次数" prop="order_count" align="center"></el-table-column>
	    <el-table-column label="累计消费金额(元)" prop="order_sum_str" align="center"></el-table-column>
	  </el-table>
	  <el-row class="l-text-center l-margin-t">
	  	<el-pagination layout="total, sizes, prev, pager, next, jumper"
	  	 	@size-change="sizeChange" 
	  	 	@current-change="pageChange" 
	  	 	:page-sizes="$$api.pageSizes"
	  	 	:page-size="list.row"
	  	 	:current-page="list.page"
	  	 	:total="list.total">
			</el-pagination>
	  </el-row>
	</div>
</template>
<script>
export default {
	name: 'customer',
	data() {
		return {
			list: {
				filter: {
					tel: '',
					name: '',
					nickname: ''
				},
				rules: {
					tel: [],
					name: [],
					nickname: []
				},
				loading: false,
				page: 1,
				row: 100,
				total: 0,
				data: []
			}
		}
	},
	methods: {
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, row) {
			this.list.loading = true
			this.$$api.customer.getList(this.list.filter, page, row)
			.then(({data}) => {
				this.list.total = data.count
        this.list.page = Number(data.page_number) + 1
        this.list.row = Number(data.per_page)
        this.list.data = data.list.map(item => {
        	item.order_sum_str = (item.order_sum / 100).toFixed(2)
        	return item
        })
			}).finally(_ => {
				this.list.loading = false
			})
		},
		refreshList() {
			this.getList(this.list.page)
		},
		search() {
			this.getList()
		},
		clear() {
			this.$refs.listFilter && this.$refs.listFilter.resetFields()
			this.getList()
		}
	},
	mounted() {
		this.getList()
	}
}
</script>
