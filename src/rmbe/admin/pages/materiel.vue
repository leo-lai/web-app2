<template>
	<div class="l-main-body">
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent>
  				<el-form-item prop="number" lalel="">
				    <el-input placeholder="设备编号" v-model="list.filter.number"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
		<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column label="设备编号" prop="number" min-width="150"></el-table-column>
	    <el-table-column label="商家手机号" prop="tel" min-width="150"></el-table-column>
	    <el-table-column label="店铺名称" prop="store_name" min-width="150"></el-table-column>
	    <el-table-column label="店铺地址" prop="address" min-width="200"></el-table-column>
	    <el-table-column label="剩余使用次数" prop="remain_count" align="center" min-width="150"></el-table-column>
	    <el-table-column label="操作" align="center" min-width="150">
	    	<template slot-scope="scope">
	    		<span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
		    		<el-button type="primary" size="small" @click="supply(scope.row)">确认补货</el-button>
	        </span>
	      </template>
	    </el-table-column>
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
	name: 'materiel',
	data() {

		return {
			list: {
				filter: {
					tel: '',
					numnber: '',
					related: ''
				},
				rules: {
					tel: [],
					numnber: [],
					related: []
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
			this.$$api.device.getRemindList(this.list.filter, page, row)
			.then(({data}) => {
				this.list.total = data.count
        this.list.page = Number(data.page_number) + 1
        this.list.row = Number(data.per_page)
        this.list.data = data.list.map(item => {
        	item.address = (item.province || '') + (item.city || '') + (item.district || '') + (item.detail_address || '')
        	item.doing = false
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
		},
		supply(row) {
			row.doing = true
			this.$$api.device.supply(row.number).then(_ => {
				this.$message.success('补货成功')
				this.refreshList()
			}).finally(_ => {
				row.doing = false
			})
		}
	},
	mounted() {
		this.getList()
	}
}
</script>
