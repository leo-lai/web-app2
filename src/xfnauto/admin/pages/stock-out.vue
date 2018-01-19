<template>
	<div>
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item prop="dateRange">
				  	<el-input placeholder="请输入订单号" v-model="list.filter.customerOrderCode"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button type="danger" @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column class-name="l-fs-xs" label="订单号" prop="customerOrderCode" min-width="120"></el-table-column>
	    <el-table-column label="落定客户" prop="customerName" align="center"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="下单时间" prop="createDate" min-width="120"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="预定车辆" prop="carsName" min-width="150"></el-table-column>
	    <el-table-column label="车身颜色" prop="colourName" align="center"></el-table-column>
	    <el-table-column label="内饰颜色" prop="interiorName" align="center"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="订单状态" prop="customerOrderState" align="center" min-width="120">
	    	<template slot-scope="scope">
	    		<p :class="{'l-text-error': scope.row.customerOrderState === 5}">{{formatterState(null, null, scope.row.customerOrderState)}}</p>
	    	</template>
	    </el-table-column>
	    <el-table-column label="操作" align="center">
	    	<template slot-scope="scope">
	    		<el-button v-if="scope.row.customerOrderState === 5" class="l-text-link" type="text" size="small" @click="showOutStockInfo(scope.row)">出库车辆</el-button>
	        <!-- <el-button class="l-text-link" type="text" size="small">打印单据</el-button> -->
	      </template>
	    </el-table-column>
	  </el-table>
	  <el-row class="l-text-center l-margin-t">
	  	<el-pagination layout="total, sizes, prev, pager, next, jumper"
	  	 	@size-change="sizeChange" 
	  	 	@current-change="pageChange" 
	  	 	:page-sizes="$$api.pageSizes"
	  	 	:page-size="list.rows"
	  	 	:current-page="list.page"
	  	 	:total="list.total">
			</el-pagination>
	  </el-row>

	  <!-- 出库车辆 -->
		<el-dialog class="l-padding-t-0" title="出库车辆" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="outStockInfo.visible" width="995px">
  		<table class="l-table-info">
  			<caption>订单基本信息</caption>
  			<tr>
  				<td class="_tit" width="50">车辆型号</td>
  				<td class="_cont" width="350">{{ outStockInfo.data.carsName }}</td>
  				<td class="_tit" width="50">车身颜色</td>
  				<td class="_cont" width="50" align="center">{{ outStockInfo.data.colourName }}</td>
  				<td class="_tit" width="50">内饰颜色</td>
  				<td class="_cont" width="70" align="center">{{ outStockInfo.data.interiorName }}</td>
  			</tr>
  			<tr>
  				<td class="_tit">订单备注</td>
  				<td class="_cont" colspan="3">{{ outStockInfo.data.remark }}</td>
  				<td class="_tit">出库数量</td>
  				<td class="_cont" align="center">{{ outStockInfo.data.orderNumber }}</td>
  			</tr>
  		</table>
  		<div class="l-block-tit">现有库存</div>
  		<el-table class="l-table-hdbg" stripe :data="outStockInfo.data.list" @selection-change="outStockSlted" 
  			empty-text="无该车型库存，请在前往“库存管理”-“订车列表”模块订车">
  			<el-table-column type="selection" width="55" :selectable="outStockSltable"></el-table-column>
		    <el-table-column label="车架号" prop="frameNumber"></el-table-column>
		    <el-table-column label="发动机号" prop="engineNumber"></el-table-column>
		    <el-table-column label="票证号" prop="certificateNumber"></el-table-column>
		    <el-table-column label="仓位" prop="warehouseName"></el-table-column>
		    <el-table-column label="入库时间" prop="createDate"  class-name="l-fs-xs"></el-table-column>
		    <el-table-column label="操作" align="center">
		    	<template slot-scope="scope">
		        <el-button :class="scope.row.imagesArr ? 'l-text-link' : 'l-text-gary'" type="text" size="small" @click="showCarImages(scope.row.imagesArr)">查看验车照片</el-button>
		      </template>
		    </el-table-column>
		  </el-table>

		  <div class="l-margin-t l-text-center">
		  	<el-button style="width: 200px;" type="primary" :loading="outStockInfo.loading" @click="outStock()">出库车辆</el-button>
		  </div>
		</el-dialog>

		<viewer-images ref="viewer"></viewer-images>
	</div>
</template>
<script>
import viewerImages from 'components/viewer-images'
export default {
	name: 'customer-out',
	components: {
    viewerImages
  },
	data() {
		return {
			list: {
				state: [
				{
					value: 1,
					label: '待交定金'
				},
				{
					value: 3,
					label: '等待银行审核'
				},
				{
					value: 4,
					label: '银行审核不通过'
				},
				{
					value: 5,
					label: '等待车辆出库'
				},
				{
					value: 7,
					label: '等待加装精品'
				},
				{
					value: 9,
					label: '等待上牌'
				},
				{
					value: 11,
					label: '等待贴膜'
				},
				{
					value: 13,
					label: '等待交付车辆'
				},
				{
					value: 15,
					label: '等待支付尾款'
				},
				{
					value: 17,
					label: '订单完成'
				}
			],
				filter: {
					customerOrderCode: ''
				},
				rules: {
					customerOrderCode: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			outStockInfo: {
				loading: false,
				visible: false,
				stockCarIdArr: [],
				carSpecs: [],
				formData: { 
					customerOrderId: '', 
					stockCarId: ''
				},
				data: {}
			}
		}
	},
	methods: {
		formatterState(row, column, cellValue) {
			return cellValue === undefined ? '' : (this.list.state.filter(item => item.value === cellValue)[0] || {}).label
		},
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			this.$$api.stock.getOrderList2(this.list.filter, page, rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list.map(item => {
        	item.deling = false
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
		showOutStockInfo(row) { // 出库车辆
			const loading = this.$loading()
			this.$$api.stock.outStockBefor2(row.customerOrderId).then(({data}) => {
				this.outStockInfo.formData.customerOrderId = row.customerOrderId
				this.outStockInfo.data = data
				this.outStockInfo.data.list = data.list ? data.list.map(item => {
					if(item.stockCarImages) {
						item.imagesArr = item.stockCarImages.split(',').map(img => {
							return {
								url: this.$$utils.image.thumb(img, 150), 
								thumb: this.$$utils.image.thumb(img, 150), 
								src: img, 
								name: img, 
								status: 'success'
							}
						})
					}
					return item
				}) : []
				this.outStockInfo.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		outStock() { // 出库车辆
			if(!this.outStockInfo.formData.stockCarId) {
				this.$message.error('请选择出库车辆')
				return
			}

			if(this.outStockInfo.stockCarIdArr.length > this.outStockInfo.data.orderNumber){
				this.$message.error('出库车辆大于订车数量')
				return	
			}

			this.outStockInfo.loading = true
			this.$$api.stock.outStock2(this.outStockInfo.formData).then(_ => {
				this.$message.success('出库车辆成功')
				this.outStockInfo.visible = false
				this.refreshList()
			}).finally(_ => {
				this.outStockInfo.loading = false
			})
		},
		outStockSlted(valArr) {
			this.outStockInfo.stockCarIdArr = valArr.map(item => item.stockCarId)
			this.outStockInfo.formData.stockCarId = this.outStockInfo.stockCarIdArr.join(',')
		},
		outStockSltable(row, index) {
			if(this.outStockInfo.stockCarIdArr.includes(row.stockCarId)) {
				return true
			}else{
				return this.outStockInfo.stockCarIdArr.length < this.outStockInfo.data.orderNumber	
			}
		},
		showCarImages(imagesArr = []) { // 查看验车图片
			if(imagesArr && imagesArr.length > 0) {
				this.$refs.viewer.show(0, imagesArr)
			}else{
				this.$message.info('没有可查看图片')
			}
		}
	},
	mounted() {
		this.$$event.$on('stock:tab', activeName => {
			if(activeName === 'out' && this.list.data.length === 0) {
				this.getList()
			}
		})
	}
}
</script>