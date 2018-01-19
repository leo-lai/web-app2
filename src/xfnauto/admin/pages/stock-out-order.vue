<template>
	<div>
		<el-row>
			<el-col :span="4">
				<el-button type="primary" style="visibility:hidden;">新增出库订单</el-button>
			</el-col>
  		<el-col :span="20" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
  				<el-form-item prop="stockOrderState">
  					<el-select v-model="list.filter.stockOrderState" placeholder="订单状态" @change="search()">
				      <el-option v-for="item in list.state" :key="item.value" :label="item.label" :value="item.value"></el-option>
				    </el-select>
  				</el-form-item>
				  <el-form-item style="width: 160px;" prop="carsName">
				  	<el-input v-model="list.filter.carsName" placeholder="车辆型号"></el-input>
				  </el-form-item>
				  <el-form-item style="width: 160px;" prop="stockOrderCode">
				  	<el-input v-model="list.filter.stockOrderCode" placeholder="订单号"></el-input>
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
	    <el-table-column label="订车单号" prop="stockOrderCode" class-name="l-fs-xs" min-width="180"></el-table-column>
	    <el-table-column label="预定车型" prop="carsName" class-name="l-fs-xs" min-width="200">
	    	<template slot-scope="scope">
	    		<p>{{scope.row.carsName}}</p>
	    		<p>车身：{{scope.row.colourName}} | 内饰：{{scope.row.interiorName}}</p>
	    	</template>
	    </el-table-column>
	    <el-table-column label="订车门店" prop="buyOrgName" class-name="l-fs-xs"></el-table-column>
	    <el-table-column label="下单时间" prop="createDate" class-name="l-fs-xs"  align="center"></el-table-column>
	    <el-table-column label="官方指导价" prop="guidingPrice" align="center"></el-table-column>
	    <el-table-column label="订车数量" prop="stockOrderNumber" align="center"></el-table-column>
	    <el-table-column label="订单状态" prop="stockOrderState" class-name="l-fs-xs" align="center">
	    	<template slot-scope="scope">
	    		<p>{{formatterState(null, null, scope.row.stockOrderState)}}</p>
	    		<p class="l-text-error" v-if="scope.row.stockOrderState === 5">（尾款金额：{{scope.row.balancePrice}}）</p>
	    	</template>
	    </el-table-column>
	    <el-table-column class-name="l-fs-xs" label="支付状态" prop="payBrief" min-width="120" align="center">
	    	<template slot-scope="scope">
	    		<p v-for="item in scope.row.payBrief.split('。')">{{item}}</p>
	    	</template>
	    </el-table-column>
	    <el-table-column label="操作" header-align="center" align="center" min-width="120">
	    	<template slot-scope="scope">
	        <span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
	        	<el-button v-if="scope.row.stockOrderState < 5" class="l-text-ok" type="text" size="small" @click="showNoticeInfo(scope.row)">通知有车</el-button>
		        <el-button v-if="scope.row.stockOrderState === 5" class="l-text-warn" type="text" size="small" @click="showOutStockInfo(scope.row)">出库车辆</el-button>
		        <!-- <el-button v-if="scope.row.stockOrderState === 11" class="l-text-link" type="text" size="small">打印单据</el-button> -->
		        <el-button class="l-text-link" type="text" size="small" @click="showViewInfo(scope.row)">查看明细</el-button>
	        </span>
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

	  <!-- 新增/编辑订车单 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="995px">
  		<el-form ref="infoForm" inline class="l-form1" label-width="100px" 
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
			  <el-form-item class="_flex" label="车辆型号" prop="carsId" style="width: 622px;">
			    <el-cascader style="width: 100%;" :show-all-levels="false" @active-item-change="cascaderItemChange" @change="cascaderChange"
			    	v-model="cascader.value" :options="cascader.data" :props="cascader.props"></el-cascader>
			  </el-form-item>
			  <el-form-item label="车身颜色" prop="colourId" >
			  	<el-select v-model="dialogInfo.data.colourId" placeholder="请选择">
				    <el-option v-for="color in dialogInfo.colorList" :key="color.carColourId" :label="color.carColourName" :value="color.carColourId"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="内饰颜色" prop="interiorId" >
			  	<el-select v-model="dialogInfo.data.interiorId" placeholder="请选择">
				    <el-option v-for="neishi in dialogInfo.neishiList" :key="neishi.interiorId" :label="neishi.interiorName" :value="neishi.interiorId"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="合格证时间" prop="certificateDate" >
			  	<el-select v-model="dialogInfo.data.certificateDate" placeholder="请选择">
				    <el-option v-for="(item, index) in $$config.baseData.carTime" :key="index" :label="item" :value="index+1"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="指导价" >
			  	<el-input disabled v-model="dialogInfo.info.price"></el-input>
			  </el-form-item>
			  <el-form-item label="定金/辆" >
			  	<el-input disabled v-model="dialogInfo.info.deposit"></el-input>
			  </el-form-item>
			  <el-form-item label="采购数量" prop="stockOrderNumber" >
			  	<el-input v-model.number="dialogInfo.data.stockOrderNumber" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="备注" prop="stockOrderRemarks">
			  	<el-input type="textarea" v-model="dialogInfo.data.stockOrderRemarks" :maxlength="500"></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>

		<!-- 查看订车单 -->
		<el-dialog class="l-padding-t-0" title="查看订车单" :visible.sync="viewInfo.visible" width="995px">
  		<table class="l-table-info">
  			<caption>订单基本信息</caption>
  			<tr>
  				<td class="_tit">车辆型号</td>
  				<td class="_cont">{{ viewInfo.data.carsName }}</td>
  				<td class="_tit">车身颜色</td>
  				<td class="_cont" align="center">{{ viewInfo.data.colourName }}</td>
  				<td class="_tit">内饰颜色</td>
  				<td class="_cont" align="center">{{ viewInfo.data.interiorName }}</td>
  			</tr>
  			<tr>
  				<td class="_tit">订单状态</td>
  				<td class="_cont">{{ formatterState(null, null, viewInfo.data.stockOrderState) }}</td>
  				<td class="_tit">定金</td>
  				<td class="_cont" align="center">{{ viewInfo.data.depositPrice }}</td>
  				<td class="_tit">需要出库量</td>
  				<td class="_cont" align="center">{{ viewInfo.data.stockOrderNumber }}</td>
  			</tr>
  			<tr>
  				<td class="_tit">订单备注</td>
  				<td colspan="5" class="_cont">{{ viewInfo.data.remark }}</td>
  			</tr>
  			<tr>
  				<td class="_tit" width="120">附件照片</td>
  				<td colspan="5" class="_cont">
  					<div style="margin: -10px -10px 0 0;">
  						<img style="margin: 10px 10px 0 0; width: 60px; height:60px;" v-for="(item,index) in viewInfo.uploadList" :src="item.thumb" @click="showCarImages(viewInfo.uploadList, index)">
  					</div>
  				</td>
  			</tr>
  		</table>
  		<template v-if="viewInfo.data.list && viewInfo.data.list.length > 0">
	  		<div class="l-block-tit">资源到货明细</div>
	  		<el-table class="l-table-hdbg" stripe :data="viewInfo.data.list">
			    <el-table-column label="车架号" prop="frameNumber"></el-table-column>
			    <el-table-column label="发动机号" prop="engineNumber"></el-table-column>
			    <el-table-column label="票证号" prop="certificateNumber"></el-table-column>
			    <el-table-column label="仓位" prop="warehouseName"></el-table-column>
			    <el-table-column label="入库时间" prop="createDate"  class-name="l-fs-xs"></el-table-column>
			    <el-table-column label="操作">
			    	<template slot-scope="scope">
			        <el-button class="l-text-link" type="text" size="small">查看验车照片</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
		  </template>

		  <div class="l-block-tit">资源出库明细</div>
		  <table class="l-table-info">
  			<tr>
  				<td class="_tit" width="80">物流方式</td>
  				<td class="_cont">
  					<span v-if="viewInfo.data.logisticsMode">{{ viewInfo.data.logisticsMode === 1 ? '随车' : '物流' }}</span>
  				</td>
  				<td class="_tit" width="80">物流单号</td>
  				<td class="_cont">{{ viewInfo.data.logisticsOddNumber }}</td>
  			</tr>
  			<tr>
  				<td class="_tit">随车资料</td>
  				<td class="_cont" colspan="3">
  					<ul class="l-gou-list" v-if="viewInfo.data.followInformation">
	  					<li v-for="item in viewInfo.data.followInformation.split(',')"><i>√</i>{{item}}</li>
  					</ul>
  				</td>
  			</tr>
  		</table>
		</el-dialog>

		<!-- 通知有车 -->
		<el-dialog class="l-padding-t-0" title="通知有车" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="noticeInfo.visible" width="995px">
  		<table class="l-table-info">
  			<caption>订单基本信息</caption>
  			<tr>
  				<td class="_tit" width="50">车辆型号</td>
  				<td class="_cont" width="350">{{ noticeInfo.data.carsName }}</td>
  				<td class="_tit" width="50">车身颜色</td>
  				<td class="_cont" width="50" align="center">{{ noticeInfo.data.colourName }}</td>
  				<td class="_tit" width="50">内饰颜色</td>
  				<td class="_cont" width="70" align="center">{{ noticeInfo.data.interiorName }}</td>
  			</tr>
  			<tr>
  				<td class="_tit">订单备注</td>
  				<td class="_cont" width="200">{{ noticeInfo.data.remark }}</td>
  				<td class="_tit">出库数量</td>
  				<td class="_cont" align="center">{{ noticeInfo.data.stockOrderNumber }}</td>
  				<td class="_tit">支付尾款</td>
  				<td class="_cont" align="center">
  					<input class="_ipt" type="text" v-model="noticeInfo.formData.balancePrice" maxlength="10">
  				</td>
  			</tr>
  		</table>
  		<div class="l-block-tit">现有库存</div>
  		<el-table class="l-table-hdbg" stripe :data="noticeInfo.data.list">
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
		  	<el-button style="width: 200px;" type="primary" :loading="noticeInfo.loading" @click="notice()">通知有车</el-button>
		  </div>
		</el-dialog>

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
  				<td class="_cont" align="center">{{ outStockInfo.data.stockOrderNumber }}</td>
  			</tr>
  			<tr>
  				<td class="_tit">随车资料</td>
  				<td class="_cont" colspan="5">
  					<el-checkbox-group class="l-car-spec" v-model="outStockInfo.carSpecs">
					    <el-checkbox v-for="(item,index) in $$config.baseData.carSpec" :key="index" :label="item"></el-checkbox>
					  </el-checkbox-group>
  				</td>
  			</tr>
  			<tr>
  				<td class="_tit">票证物流方式</td>
  				<td class="_cont" colspan="5">
  					<el-radio-group v-model="outStockInfo.formData.logisticsMode">
					    <el-radio :label="1">随车</el-radio>
					    <el-radio :label="2">物流</el-radio>
					  </el-radio-group>
					  <el-input :disabled="outStockInfo.formData.logisticsMode === 1" v-model="outStockInfo.formData.logisticsOddNumber" style="width: 150px; margin-left: 15px;" placeholder="请填写物流单号"></el-input>
  				</td>
  			</tr>
  		</table>
  		<div class="l-block-tit">现有库存</div>
  		<el-table class="l-table-hdbg" stripe :data="outStockInfo.data.list" @selection-change="outStockSlted">
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
	name: 'stock-out-order',
	components: {
    viewerImages
  },
	data() {
		let that = this
		let validateCarModel = function(rule, value, callback) {
			if (that.cascader.value.length === 0){
        callback(new Error('必填项'))
      }else{
      	that.dialogInfo.data.carsId = that.cascader.value[2] || ''
        callback()
      }
		}
		return {
			cascader: {
				value: [],
				data: [],
        props: {
        	label: 'name',
          value: 'id',
          children: 'children'
        }
			},
			list: {
				state: [
					{
						value: 1,
						label: '待寻车'
					},
					// {
					// 	value: 3,
					// 	label: '已支付定金，待处理'
					// },
					{
						value: 5,
						label: '已寻车，待出库'
					},
					// {
					// 	value: 7,
					// 	label: '已支付尾款，待资源出库'
					// },
					{
						value: 9,
						label: '已出库，待签收'
					},
					{
						value: 11,
						label: '已签收入库'
					},
					{
						value: 0,
						label: '已取消'
					}
				],
				filter: {
					stockOrderState: '',
					stockOrderCode: '',
					carsName: ''
				},
				rules: {
					stockOrderState: [],
					stockOrderCode: [],
					carsName: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '新增订车单',
				visible: false,
				loading: false,
				colorList: [],
				neishiList: [],
				rules: {
					carsId: [
						{ required: true, validator: validateCarModel, trigger: 'change' }
					],
					colourId: [
						{ required: true, type: 'number', message: '必填项', trigger: 'change' }
					],
					interiorId: [
						{ required: true, type: 'number', message: '必填项', trigger: 'change' }
					],
					certificateDate: [
						{ required: true, type: 'number', message: '必填项', trigger: 'change' }
					],
					stockOrderNumber: [
						{ required: true, type: 'number', message: '必填项', trigger: 'blur' }
					]
				},
				data: {
					carsId: '',
					colourId: '',
					interiorId: '',
					stockOrderNumber: '',
					stockOrderRemarks: '',
					certificateDate: ''
				},
				info: {
					price: '',
					deposit: 3000
				}
			},
			viewInfo: {
				visible: false,
				data: {}
			},
			noticeInfo: {
				loading: false,
				visible: false,
				formData: { 
					stockOrderId: '', 
					balancePrice: ''
				},
				data: {}
			},
			outStockInfo: {
				loading: false,
				visible: false,
				stockCarIdArr: [],
				carSpecs: [],
				formData: { 
					stockOrderId: '', 
					stockCarIds: '',
					logisticsMode: 1,
					logisticsOddNumber: '',
					followInformation: ''
				},
				data: {}
			}
		}
	},
	methods: {
		formatterState(row, column, cellValue) {
			return cellValue === undefined ? '' : (this.list.state.filter(item => item.value === cellValue)[0] || {}).label
		},
		cascaderItemChange(valArr) {
			let promise = Promise.resolve()
			let currentBrand = this.cascader.data.filter(brand => brand.id === valArr[0])[0]
      if(valArr.length === 1) { // 获取车系(by brandId)
      	if(currentBrand && currentBrand.children && currentBrand.children.length === 0) {
	      	promise = this.$$api.car.getFamilyList(valArr[0]).then(({data}) => {
	      		let familyList = data.map(family => {
	      			family.children = []
	      			return family
	      		})
	      		currentBrand.children = familyList.length > 0 ? familyList : null
	      		return data
	      	})	
      	}
      }else if(valArr.length === 2) { // 获取车型号
      	let currentFamily = currentBrand.children.filter(family => family.id === valArr[1])[0]
      	if(currentFamily && currentFamily.children && currentFamily.children.length === 0) {
	      	promise = this.$$api.car.getCarsList(valArr[1]).then(({data}) => {
	      		currentFamily.children = data
	      		return data
	      	})	
      	}
      }
      return promise
		},
		cascaderChange(valArr) {
			if(!valArr || valArr.length < 2) return
				
			this.dialogInfo.data.colourId = ''
			this.dialogInfo.data.interiorId = ''

			// 获取车身颜色和内饰颜色
			this.$$api.color.getCheshenList(valArr[1]).then(({data}) => {
    		this.dialogInfo.colorList = data
    	})
    	this.$$api.color.getNeishiList(valArr[1]).then(({data}) => {
    		this.dialogInfo.neishiList = data
    	})
    	// 获取指导价等信息
    	this.$$api.car.getCarsInfo(valArr[2]).then(({data}) => {
    		this.dialogInfo.info.price = data.price
    	})
		},
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			this.list.filter.isSellList = 1
			this.$$api.stock.getOrderList(this.list.filter, page, rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list.map(item => {
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
		showDialogInfo(type = 'new', row) { // 新增订车单
			let brandPromise = this.$$api.car.getBrandList().then(({data}) => {
				this.cascader.data = data.map(item => {
					item.children = []
					return item
				})
				return data
			})
			this.dialogInfo.type = type
			if(type === 'new') {
				this.dialogInfo.title = '新增订车单'
				this.cascader.value = []
				this.$$utils.copyObj(this.dialogInfo.data, '')
			}

			const loading = this.$loading()
			Promise.all([brandPromise]).then(dataArr =>　{
				this.dialogInfo.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		closeDialogInfo(done) {
			if(done) {
				done()
			}else{
				this.dialogInfo.visible = false	
			}
			this.$$utils.copyObj(this.dialogInfo.data, '')
			this.$refs.infoForm.resetFields()
		},
		submitDialogInfo() { // 提交订车单
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.stock.addOrder(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '订车单成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }else {
        	this.$message({
						type: 'error',
						message: '请完善表单信息'
					})
        }
      })
		},
		cancelOrder(row) { // 取消订单
			this.$confirm('是否确定取消该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.stock.cancelOrder(row.stockOrderId).then(_ => {
					this.$message({
						type: 'success',
						message: '取消订单成功'
					})
					this.refreshList()
				}).finally(_ => {
					row.doing = false
				})
      })
		},
		signOrder(row) { // 签收订单
			this.$confirm('是否确定签收该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.stock.signOrder(row.stockOrderId).then(_ => {
					this.$message({
						type: 'success',
						message: '签收订单成功'
					})
					this.refreshList()
				}).finally(_ => {
					row.doing = false
				})
      })
		},
		showViewInfo(row) { // 查看订车单
			const loading = this.$loading()
			this.$$api.stock.getOrderInfo(row.stockOrderId).then(({data}) => {
				this.viewInfo.data = data
				this.viewInfo.uploadList = data.templateImage ? data.templateImage.split(',').map(img => {
					return {
						url: this.$$utils.image.thumb(img, 150), 
						thumb: this.$$utils.image.thumb(img, 150), 
						src: img, 
						name: img, 
						status: 'success'
					}
				}) : []
				this.viewInfo.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		showPayInfo(row) { // 支付订车单定金
			const loading = this.$loading()
			this.$$api.stock.getOrderInfo(row.stockOrderId).then(({data}) => {
				this.payInfo.data = data
				this.payInfo.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		showNoticeInfo(row) { // 通知有车
			const loading = this.$loading()
			this.$$api.stock.noticeBefore(row.stockOrderId).then(({data}) => {
				this.noticeInfo.formData.stockOrderId = row.stockOrderId
				this.noticeInfo.formData.balancePrice = data.balancePrice
				this.noticeInfo.data = data
				this.noticeInfo.data.list = data.list ? data.list.map(item => {
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
				this.noticeInfo.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		notice() { // 通知有车
			if(!this.noticeInfo.formData.balancePrice) {
				this.$message.error('请输入支付尾款')
				return
			}
			if(!/^\d{1,9}(\.\d{1,2})?$/.test(this.noticeInfo.formData.balancePrice)) {
				this.$message.error('请正确输入尾款金额')
				return
			}

			this.noticeInfo.loading = true
			this.$$api.stock.notice(this.noticeInfo.formData).then(_ => {
				this.$message.success('通知成功')
				this.noticeInfo.visible = false
				this.refreshList()
			}).finally(_ => {
				this.noticeInfo.loading = false
			})
		},
		showOutStockInfo(row) { // 出库车辆
			const loading = this.$loading()
			this.$$api.stock.outStockBefor(row.stockOrderId).then(({data}) => {
				this.outStockInfo.formData.stockOrderId = row.stockOrderId
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
			if(!this.outStockInfo.formData.stockCarIds) {
				this.$message.error('请选择出库车辆')
				return
			}
			if(this.outStockInfo.formData.logisticsMode === 2 && !this.outStockInfo.formData.logisticsOddNumber){
				this.$message.error('请填写物流单号')
				return	
			}
			this.outStockInfo.formData.followInformation = this.outStockInfo.carSpecs.join(',')

			this.outStockInfo.loading = true
			this.$$api.stock.outStock(this.outStockInfo.formData).then(_ => {
				this.$message.success('出库车辆成功')
				this.outStockInfo.visible = false
				this.refreshList()
			}).finally(_ => {
				this.outStockInfo.loading = false
			})
		},
		outStockSlted(valArr) {
			this.outStockInfo.stockCarIdArr = valArr.map(item => item.stockCarId)
			this.outStockInfo.formData.stockCarIds = this.outStockInfo.stockCarIdArr.join(',')
		},
		outStockSltable(row, index) {
			if(this.outStockInfo.stockCarIdArr.includes(row.stockCarId)) {
				return true
			}else{
				return this.outStockInfo.stockCarIdArr.length < this.outStockInfo.data.stockOrderNumber	
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
			if(activeName === 'out-order' && this.list.data.length === 0) {
				this.getList()
			}
		})
	}
}
</script>