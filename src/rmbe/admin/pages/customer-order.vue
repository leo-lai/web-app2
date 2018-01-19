<template>
	<div class="l-main-body">
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent>
  				<el-form-item prop="dateRange" style="width:360px;">
				  	<el-date-picker style="width: 100%;" type="daterange" value-format="yyyy-MM-dd hh:mm:ss"
				  		range-separator="到" start-placeholder="开始时间" end-placeholder="结束时间"
				  		v-model="list.filter.dateRange" :picker-options="dateOptions" @change="filterDateChange"></el-date-picker>
				  </el-form-item>
  				<el-form-item style="width: 120px;" prop="name" lalel="">
				    <el-input placeholder="商家姓名" v-model="list.filter.name"></el-input>
				  </el-form-item>
				  <el-form-item style="width: 120px;" prop="tel" lalel="">
				    <el-input placeholder="商家手机号" v-model="list.filter.tel"></el-input>
				  </el-form-item>
				  <el-form-item style="width: 120px;" prop="store_name" lalel="">
				    <el-input placeholder="店铺名称" v-model="list.filter.store_name"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
		<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" :data="list.data" v-loading="list.loading">
	    <el-table-column class-name="l-fs-xs" label="订单号" prop="order_id" fixed width="230"></el-table-column>
	    <el-table-column label="头像" prop="c_thumb" align="center" width="70">
	    	<template slot-scope="scope">
	    		<img width="50" height="50" :src="scope.row.c_thumb" alt="">
	    	</template>
	    </el-table-column>
	    <el-table-column label="昵称" prop="c_nickname" align="center" width="150"></el-table-column>
	    <el-table-column label="启动设备号" prop="pay_data" align="center" width="120"></el-table-column>
	    <el-table-column label="商家姓名" prop="s_name" align="center" width="120"></el-table-column>
	    <el-table-column label="商家手机号" prop="s_tel" align="center" width="120"></el-table-column>
	    <el-table-column label="店铺名称" prop="store_name" align="center" width="200"></el-table-column>
	    <el-table-column label="店铺地区" width="200">
	    	<template slot-scope="scope">
	    		<p>{{scope.row.s_province + scope.row.s_city + scope.row.s_district}}</p>
	    	</template>
	    </el-table-column>
	    <el-table-column class-name="l-fs-xs" label="详细地址" prop="detail_address" width="300"></el-table-column>
	    <el-table-column label="消费金额(元)" prop="amountStr" align="center" fixed="right" width="120"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="消费时间" prop="create_time" align="center" width="150" fixed="right"></el-table-column>
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
	name: 'customer-order',
	data() {
		return {
			dateOptions: {
				shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
			},
			list: {
				filter: {
					dateRange: [],
					start_date: '',
					end_date: '',
					tel: '',
					name: '',
					store_name: ''
				},
				rules: {
					dateRange: [],
					start_date: [],
					end_date: [],
					tel: [],
					name: [],
					store_name: []
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
		filterDateChange(value) {
			if(value) {
				this.list.filter.start_date = value[0] || ''
				this.list.filter.end_date = value[1] || ''
			} else {
				this.list.filter.start_date = ''
				this.list.filter.end_date = ''
			}
			this.search()
		},
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, row) {
			this.list.loading = true
			this.$$api.customer.getOrderList(this.list.filter, page, row)
			.then(({data}) => {
				this.list.total = data.count
        this.list.page = Number(data.page_number) + 1
        this.list.row = Number(data.per_page)
        this.list.data = data.list.map(item => {
        	item.amountStr = (item.amount / 100).toFixed(2)
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
