<template>
	<div class="l-main-body">
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent>
  				<el-form-item prop="region" label="地区搜索">
				    <el-cascader ref="region" style="width:100%;" change-on-select filterable clearable v-model="list.filter.region" :options="regionData" :props="{label: 'text', value: 'value'}" @change="filterRegionChange"></el-cascader>
				  </el-form-item>
				  <el-form-item prop="dateRange" style="width:360px;">
				  	<el-date-picker style="width: 100%;" type="daterange" value-format="yyyy-MM-dd hh:mm:ss"
				  		range-separator="到" start-placeholder="开始时间" end-placeholder="结束时间"
				  		v-model="list.filter.dateRange" :picker-options="dateOptions" @change="filterDateChange"></el-date-picker>
				  </el-form-item>
				  <el-form-item style="width: 140px;" prop="tel" label="">
				    <el-input placeholder="商家手机号" v-model="list.filter.tel"></el-input>
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
	    <el-table-column label="商家手机号" prop="tel" min-width="150"></el-table-column>
	    <el-table-column label="店铺名称" prop="store_name" min-width="150"></el-table-column>
	    <el-table-column label="店铺地区" min-width="200">
	    	<template slot-scope="scope">
	    		{{scope.row.province + scope.row.city + scope.row.district}}
	    	</template>
	    </el-table-column>
	    <el-table-column class-name="l-fs-xs" label="详细地址" prop="detail_address" min-width="300"></el-table-column>
	    <el-table-column label="消费金额(元)" align="center" min-width="150">
	    	<template slot-scope="scope">
	    		{{(scope.row.amount ? (scope.row.amount / 100) : 0).toFixed(2) }}
	    	</template>
	    </el-table-column>
	    <el-table-column class-name="l-fs-xs" label="日期" prop="create_time" align="center" min-width="150"></el-table-column>
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
import regionData from 'assets/js/region.data'
export default {
	name: 'finance',
	data() {
		return {
			regionData,
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
					region: [],
					tel: '',
					region_id1: '',
					region_id2: ''
				},
				rules: {
					dateRange: [],
					start_date: [],
					end_date: [],
					region: [],
					region_id1: [],
					region_id1: []
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
		filterRegionChange(value) {
			this.list.filter.region_id1 = value[0] || ''
			this.list.filter.region_id2 = value[1] || ''
			this.list.filter.region_id3 = value[2] || ''
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
			this.$$api.finance.getList(this.list.filter, page, row)
			.then(({data}) => {
				this.list.total = data.count
        this.list.page = Number(data.page_number) + 1
        this.list.row = Number(data.per_page)
        this.list.data = data.list
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
			this.list.filter.start_date = ''
			this.list.filter.end_date = ''
			this.list.filter.region_id1 = ''
			this.list.filter.region_id2 = ''
			this.list.filter.region_id3 = ''
			this.getList()
		}
	},
	mounted() {
		this.getList()
	}
}
</script>
