<template>
	<div>
		<el-row>
			<el-col :span="4">
				<el-button type="primary" @click="showDialogInfo('new')">新增订车单</el-button>
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
	    <el-table-column label="订车单号" prop="stockOrderCode" class-name="l-fs-xs" min-width="160"></el-table-column>
	    <el-table-column label="预定车型" prop="carsName" class-name="l-fs-xs" min-width="250">
	    	<template slot-scope="scope">
	    		<p>{{scope.row.carsName}}</p>
	    		<p>车身颜色：{{scope.row.colourName}} <span class="l-text-gray">|</span> 内饰颜色：{{scope.row.interiorName}}</p>
	    	</template>
	    </el-table-column>
	    <el-table-column label="官方指导价" prop="guidingPrice" align="center" width="110"></el-table-column>
	    <el-table-column label="订车数量" prop="stockOrderNumber" align="center" width="110"></el-table-column>
    	<el-table-column label="订单状态" prop="stockOrderState" class-name="l-fs-xs" align="center" width="120" >
	    	<template slot-scope="scope">
	    		<p>{{formatterState(null, null, scope.row.stockOrderState)}}</p>
	    	</template>
	    </el-table-column>
	    <el-table-column label="支付状态" prop="payBrief" class-name="l-fs-xs" align="center" min-width="180">
	    	<template slot-scope="scope">
	    		<p v-for="item in scope.row.payBrief.split('。')" :key="item">{{item}}</p>
	    	</template>
	    </el-table-column>
	    <el-table-column label="操作" header-align="center" align="right" min-width="160">
	    	<template slot-scope="scope">
	        <span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
	        	<el-button v-if="scope.row.stockOrderState < 5" class="l-text-default" type="text" size="small" @click="cancelOrder(scope.row)">取消</el-button>
						<el-button v-if="scope.row.paystate === 1" class="l-text-error" type="text" size="small" @click="showPayInfo(scope.row)">支付定金</el-button>
		        <el-button v-if="scope.row.paystate === 2" class="l-text-error" type="text" size="small" @click="showPayInfo(scope.row)">支付尾款</el-button>
		        <el-button v-if="scope.row.paystate === 3 && scope.row.stockOrderState === 9" class="l-text-link" type="text" size="small" @click="signOrder(scope.row)">签收入库</el-button>
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
			  	<el-select v-model="dialogInfo.data.colourId" placeholder="请选择" @change='getDepositPrice'>
				    <el-option v-for="color in dialogInfo.colorList" :key="color.carColourId" :label="color.carColourName" :value="color.carColourId"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="内饰颜色" prop="interiorId" >
			  	<el-select v-model="dialogInfo.data.interiorId" placeholder="请选择" @change='getDepositPrice'>
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
			  	<el-input disabled v-model="dialogInfo.info.depositPrice"></el-input>
			  </el-form-item>
			  <el-form-item label="采购数量" prop="stockOrderNumber" >
			  	<el-input v-model.number="dialogInfo.data.stockOrderNumber" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="备注" prop="stockOrderRemarks">
			  	<el-input type="textarea" v-model="dialogInfo.data.stockOrderRemarks" :maxlength="500"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="附件照片" prop="templateImage">
			  	<uploader ref="dialogInfoUpload" :file-list.sync="dialogInfo.uploadList"></uploader>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>

		<!-- 查看订车单 -->
		<el-dialog class="l-padding-t-0" title="查看订车单" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="viewInfo.visible" width="995px">
  		<table class="l-table-info">
  			<caption>订单基本信息</caption>
  			<tr>
  				<td class="_tit" width="120">车辆型号</td>
  				<td class="_cont">{{ viewInfo.data.carsName }}</td>
  				<td class="_tit" width="120">车身颜色</td>
  				<td class="_cont" align="center">{{ viewInfo.data.colourName }}</td>
  				<td class="_tit" width="120">内饰颜色</td>
  				<td class="_cont" align="center">{{ viewInfo.data.interiorName }}</td>
  			</tr>
  			<tr>
  				<td class="_tit" width="120">订单状态</td>
  				<td class="_cont">{{ formatterState(null, null, viewInfo.data.stockOrderState) }}</td>
  				<td class="_tit" width="120">定金</td>
  				<td class="_cont" align="center">{{ viewInfo.data.depositPrice }}</td>
  				<td class="_tit" width="120">数量</td>
  				<td class="_cont" align="center">{{ viewInfo.data.stockOrderNumber }}</td>
  			</tr>
  			<tr>
  				<td class="_tit" width="120">订单备注</td>
  				<td colspan="5" class="_cont">{{ viewInfo.data.remark }}</td>
  			</tr>
  			<tr>
  				<td class="_tit" width="120">附件照片</td>
  				<td colspan="5" class="_cont">
  					<div style="margin: -10px -10px 0 0;">
  						<img style="margin: 10px 10px 0 0; width: 60px; height:60px;" v-for="(item,index) in viewInfo.uploadList" :key="item" :src="item.thumb" @click="showCarImages(viewInfo.uploadList, index)">
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
			        <el-button :class="scope.row.imagesArr ? 'l-text-link' : 'l-text-gray'" type="text" size="small" @click="showCarImages(scope.row.imagesArr)">查看验车照片</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
		  </template>
		  <div class="l-block-tit">资源出库明细</div>
		  <table class="l-table-info">
  			<tr>
  				<td class="_tit" width="120">物流方式</td>
  				<td class="_cont">
  					<span v-if="viewInfo.data.logisticsMode">{{ viewInfo.data.logisticsMode === 1 ? '随车' : '物流' }}</span>
  				</td>
  				<td class="_tit" width="120">物流单号</td>
  				<td class="_cont">{{ viewInfo.data.logisticsOddNumber }}</td>
  			</tr>
  			<tr>
  				<td class="_tit">随车资料</td>
  				<td class="_cont" colspan="3">
  					<ul class="l-gou-list" v-if="viewInfo.data.followInformation">
	  					<li v-for="item in viewInfo.data.followInformation.split(',')" :key="item"><i>√</i>{{item}}</li>
  					</ul>
  				</td>
  			</tr>
  		</table>
		</el-dialog>

		<!-- 支付订车单 -->
		<el-dialog class="l-padding-t-0" title="支付定金" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="payInfo.visible" width="995px">
  		<table class="l-table-info">
  			<tr>
  				<td class="_tit" width="120">车辆型号</td>
  				<td class="_cont">{{ payInfo.data.carsName }}</td>
  				<td class="_tit" width="120">车身颜色</td>
  				<td class="_cont" align="center">{{ payInfo.data.colourName }}</td>
  				<td class="_tit" width="120">内饰颜色</td>
  				<td class="_cont" align="center">{{ payInfo.data.interiorName }}</td>
  			</tr>
  			<tr>
  				<td class="_tit" width="120">订单状态</td>
  				<td class="_cont">{{ formatterState(null, null, payInfo.data.stockOrderState) }}</td>
  				<td class="_tit" width="120">定金</td>
  				<td class="_cont" align="center">{{ payInfo.data.depositPrice }}</td>
  				<td class="_tit" width="120">数量</td>
  				<td class="_cont" align="center">{{ payInfo.data.stockOrderNumber }}</td>
  			</tr>
  			<tr>
  				<td class="_tit" width="120">订单备注</td>
  				<td colspan="5" class="_cont">{{ payInfo.data.remark }}</td>
  			</tr>
  			<tr>
  				<td class="_tit" width="120">门店地址</td>
  				<td colspan="5" class="_cont">{{ payInfo.data.address }}</td>
  			</tr>
  			<tr>
  				<td class="_tit" width="120">支付方式</td>
  				<td colspan="5" class="_cont">
  					<el-radio-group v-model="payInfo.payWay">
					    <el-radio :label="1" border>银联支付</el-radio>
					    <el-radio :label="2" border>POS机</el-radio>
					  </el-radio-group>
  				</td>
  			</tr>
  		</table>
  		<br>
  		<div class="l-text-center l-margin-t">
  			<b class="l-fs-s l-margin-r" v-if="payInfo.data.paystate === 1">需要支付定金：：￥{{payInfo.data.depositPrice}}</b>
  			<b class="l-fs-s l-margin-r" v-if="payInfo.data.paystate === 2">需要支付尾款：：￥{{payInfo.data.balancePrice}}</b>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<el-button type="primary" @click="payNow">立即支付</el-button>
  		</div>
  		<div class="l-hidden-box">
	  		<form ref="payForm" target="payWin" method='post' :action="$$config.pay.url">
	  			<table>
	  				<tr v-for="(value, name) in payInfo.formData" :key="value">
	  					<td>{{name}}</td>
	  					<td><input  type="text" :name="name" :value="value">	</td>
	  				</tr>
	  				<tr>
	  					<td></td>
	  					<td><input type="submit" value="提交支付"></td>
	  				</tr>
	  			</table>
	  		</form>	
  		</div>

  		<!-- 支付窗口 -->
			<el-dialog class="l-padding-t-0" :visible.sync="payInfo.innerVisible" :close-on-press-escape="false" width="1100px" append-to-body :before-close="closePayWin">
				<div>
					<iframe seamless id="payWin" name="payWin" style="width: 100%; height: 700px; border: none;"></iframe>
				</div>
			</el-dialog>
		</el-dialog>
		

		<!-- 二维码支付 -->
		<el-dialog title="支付二维码" align="center" width="300px" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="qrcode.visible">
			<div class="l-qrcode-img">
	   		<qrcanvas ref="qrcode" :options="qrcode.opts"></qrcanvas>
	   		<p class="l-margin"><b>本次支付金额：{{payInfo.data.stockOrderState === 1 ? payInfo.data.depositPrice : payInfo.data.balancePrice}}</b></p>
	    </div>
		</el-dialog>

		<viewer-images ref="viewer"></viewer-images>
	</div>
</template>
<script>
import Qrcanvas from 'qrcanvas-vue'
import viewerImages from 'components/viewer-images'
import uploader from 'components/uploader'
export default {
	name: 'stock-order',
	components: {
    Qrcanvas, viewerImages, uploader
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
		// 附件上传
		let validateUpload = function(rule, value, callback) {
			if(that.$refs.dialogInfoUpload.waiting > 0) {
				callback(new Error('图片正在上传中'))
			}else {
				that.dialogInfo.data.templateImage = that.dialogInfo.uploadList.map(item => item.src || item.url).join(',')
				callback()
			}
		}
		return {
			qrcode: {
				opts: {},
				visible: false
			},
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
				uploadList: [],
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
					],
					templateImage: [
						{ validator: validateUpload, trigger: 'change' },
					]
				},
				data: {
					carsId: '',
					colourId: '',
					interiorId: '',
					stockOrderNumber: '',
					stockOrderRemarks: '',
					certificateDate: '',
					templateImage: ''
				},
				info: {
					price: '',
					depositPrice: ''
				}
			},
			viewInfo: {
				visible: false,
				uploadList: {},
				data: {}
			},
			payInfo: {
				visible: false,
				innerVisible: false,
				payWay: 1,
				data: {},
				formData: {}
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

			this.dialogInfo.data.carsId = valArr[2]
			this.dialogInfo.data.colourId = ''
			this.dialogInfo.data.interiorId = ''
			this.dialogInfo.info.depositPrice = ''

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
		// 获取车辆定金
		getDepositPrice() {
			if(!(this.dialogInfo.data.carsId 
				&& this.dialogInfo.data.colourId && this.dialogInfo.data.interiorId)) return

    	this.$$api.car.getDepositPrice({
    		carsId: this.dialogInfo.data.carsId,
    		colourId: this.dialogInfo.data.colourId,
    		interiorId: this.dialogInfo.data.interiorId
    	}).then(({data}) => {
    		this.dialogInfo.info.depositPrice = data.depositPrice || 0
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
				this.resetDialogInfo()
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
			this.dialogInfo.uploadList = []
			this.resetDialogInfo()
		},
		resetDialogInfo() {
			this.$refs.infoForm && this.$refs.infoForm.resetFields()
			this.cascader.value = []
			this.dialogInfo.info.price = ''
			this.dialogInfo.info.depositPrice = ''
			this.$$utils.copyObj(this.dialogInfo.data, '')
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
				this.viewInfo.data.list = data.list ? data.list.map(item => {
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
		showCarImages(imagesArr = [], index = 0) { // 查看验车图片
			if(imagesArr && imagesArr.length > 0) {
				this.$refs.viewer.show(index, imagesArr)
			}else{
				this.$message.info('没有可查看图片')
			}
		},
		showPayInfo(row) { // 订车单付款(定金/尾款)
			const loading = this.$loading()
			this.$$api.stock.getOrderInfo(row.stockOrderId).then(({data}) => {
				data.isDeposit = Number(data.paystate === 1)
				this.payInfo.data = data
				this.payInfo.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		payNow() { // 立即支付
			const loading = this.$loading()
			this.$$api.pay.orderPay({
				payWay: this.payInfo.payWay,
				stockOrderId: this.payInfo.data.stockOrderId,
				isDeposit: this.payInfo.data.isDeposit,
				pickupUrl: location.href
			}).then(({data}) => {
				this.payInfo.formData = data
				if(this.payInfo.payWay == 1) {
					this.payInfo.innerVisible = true
					setTimeout(_cont => {
						this.$$payWin = document.querySelector('#payWin')
						this.$$payWin.loadtimes = 0
						this.$$payWin.onload = () => {
							if(++this.$$payWin.loadtimes >= 2) {
								this.closePayWin()
							}
						}
						this.$refs.payForm.submit()
					}, 50)
				}else {
					this.qrcode.visible = true
					this.qrcode.opts = Object.assign({}, this.$$config.qrcodeOption, { data: this.payInfo.formData.chooseId })
				}
			}).finally(_ => {
				loading.close()
			})
		},
		closePayWin(done) {
			if(done) {
				done()
			}else {
				this.payInfo.innerVisible = false
				this.payInfo.visible = false

				const h = this.$createElement;
        this.$msgbox({
          title: '支付提示',
          message: h('div', null, [
            h('p', null, '请您在新打开的页面上完成支付。'),
            h('p', { style: 'color: #ccc; font-size: 12px;' }, '支付完成后，根据您的情况点击下面按钮。')
          ]),
          showCancelButton: true,
          confirmButtonText: '支付成功',
          cancelButtonText: '支付失败',
          type: 'warning'
        }).then(_ => {
          this.refreshList()
        })
			}
			this.$$payWin = null
		}
	},
	mounted() {
		this.$$event.$on('stock:tab', (activeName, that) => {
			if(activeName === 'order' && this.list.data.length === 0) {
				this.$$parent = that
				this.getList()
			}
		})
	}
}
</script>