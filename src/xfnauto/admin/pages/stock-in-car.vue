<template>
	<div>
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" 
			title="车辆列表" width="995px" :visible.sync="dialogList.visible">
			<el-form size="mini" style="margin-top: -20px;" class="l-form1" inline label-width="100px" label-position="left">
				<el-form-item label="入库单号">
					<span class="l-text-gray">{{ dialogList.info.storageCode }}</span>
				</el-form-item>
				<el-form-item label="合同号">
					<span class="l-text-gray">{{ dialogList.info.contractNumber }}</span>
				</el-form-item>
				<el-form-item label="合同扫描件">
					<span :class="dialogList.info.imagesArr ? 'l-text-link' : 'l-text-gary'" @click="showImages(dialogList.info.imagesArr)">查看</span>
				</el-form-item>
				<el-form-item class="_flex" label="备注">
					<span class="l-text-gray">{{ dialogList.info.remark }}</span>
				</el-form-item>
			</el-form>
	  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
	  		:data="list.data" v-loading="list.loading" height="400">
		    <el-table-column label="车辆型号" prop="carsName" min-width="140"></el-table-column>
		    <el-table-column label="车身颜色" prop="colourName" align="center"></el-table-column>
		    <el-table-column label="内饰颜色" prop="interiorName" align="center"></el-table-column>
		    <el-table-column label="发动机号" prop="engineNumber" align="center"></el-table-column>
		    <el-table-column label="车架号" prop="frameNumber" align="center"></el-table-column>
		    <el-table-column label="票证号" prop="certificateNumber" align="center"></el-table-column>
		    <el-table-column label="验车照片" prop="stockCarImages" align="center">
		    	<template slot-scope="scope">
		    		<el-button :class="scope.row.imagesArr ? 'l-text-link' : 'l-text-gary'" type="text" size="small" @click="showImages(scope.row.imagesArr)">查看</el-button>
		      </template>
		    </el-table-column>
		    <el-table-column label="入库仓位" prop="warehouseName" align="center"></el-table-column>
		    <el-table-column label="操作" align="center">
		    	<template slot-scope="scope">
		    		<!-- <el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">编辑</el-button> -->
		        <el-button class="l-text-error" type="text" size="small" @click="deleteInfo(scope.row)">删除</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		  <el-row class="l-margin-t">
		  	<el-col :span="20">
			  	<el-pagination layout="total, sizes, prev, pager, next, jumper"
			  	 	@size-change="sizeChange" 
			  	 	@current-change="pageChange" 
			  	 	:page-sizes="$$api.pageSizes"
			  	 	:page-size="list.rows"
			  	 	:current-page="list.page"
			  	 	:total="list.total">
					</el-pagination>	
		  	</el-col>
		  	<el-col :span="4" class="l-text-right">
		  		<el-button type="primary" @click="showDialogInfo('new')">添加车辆</el-button>	
		  	</el-col>
		  </el-row>
		</el-dialog>

		<!-- 新增/编辑车辆 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="995px">
  		<el-form ref="infoForm" inline class="l-form1" label-width="100px" 
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
  			<div class="l-flex-hc">
				  <el-form-item class="_flex" label="车辆型号" prop="carsId" style="width: 622px;">
				    <el-cascader style="width: 100%;" :show-all-levels="false" @active-item-change="cascaderItemChange" @change="cascaderChange"
				    	v-model="cascader.value" :options="cascader.data" :props="cascader.props"></el-cascader>
				  </el-form-item>
				  <el-form-item label="仓位" prop="warehouseId" >
				  	<el-select v-model="dialogInfo.data.warehouseId" placeholder="请选择">
					    <el-option v-for="item in dialogInfo.cangList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
					  </el-select>
				  </el-form-item>
			  </div>
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
			  <el-form-item label="单价" prop="unitPrice" >
			  	<el-input v-model="dialogInfo.data.unitPrice" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item label="车架号" prop="frameNumber" >
			  	<el-input v-model="dialogInfo.data.frameNumber" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item label="发动机号" prop="engineNumber" >
			  	<el-input v-model="dialogInfo.data.engineNumber" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item label="票证号" prop="certificateNumber" >
			  	<el-input v-model="dialogInfo.data.certificateNumber" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="验车照片" prop="upload">
			  	<uploader ref="dialogInfoUpload" :file-list.sync="dialogInfo.uploadList"></uploader>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>

		<viewer-images ref="viewer"></viewer-images>
	</div>
</template>
<script>
import uploader from 'components/uploader'
import viewerImages from 'components/viewer-images'
export default {
	name: 'stock-in-car',
	components: {
		uploader, viewerImages
  },
	data() {
		let that = this
		let validateUpload = function(rule, value, callback) {
			if(that.$refs.dialogInfoUpload.waiting > 0) {
				callback(new Error('图片正在上传中'))
			}else if(that.dialogInfo.uploadList.length === 0) {
				callback(new Error('请上传照片'))
			}else {
				that.dialogInfo.data.stockCarImages = that.dialogInfo.uploadList.map(item => item.src || item.url).join(',')
				callback()
			}
		}

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
			dialogList: {
				info: {},
				visible: false
			},
			list: {
				filter: {
					carsId: '',
					interiorId: '',
					colourId: ''
				},
				rules: {
					carsId: [],
					interiorId: [],
					colourId: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '添加车辆信息',
				visible: false,
				loading: false,
				uploadList: [],
				colorList: [],
				neishiList: [],
				cangList: [],
				rules: {
					carsId: [
						{ required: true, validator: validateCarModel, trigger: 'change' }
					],
					colourId: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					],
					interiorId: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					],
					warehouseId: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					],
					unitPrice: [
						{ required: true, pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '必填项，正确格式(如：10.24)', trigger: 'blur' }
					],
					frameNumber: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					engineNumber: [
						{ required: false, message: '必填项', trigger: 'blur' }
					],
					upload: [
						{ required: true, validator: validateUpload, trigger: 'change' },
					]
				},
				data: {
					stockCarId: '',
					storageId: '',
					carsId: '',
					colourId: '',
					interiorId: '',
					unitPrice: '',
					frameNumber: '',
					engineNumber: '',
					certificateNumber: '',
					warehouseId: '',
					stockCarImages: ''
				}
			}
		}
	},
	methods: {
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
		},
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			if(!this.list.filter.storageId) return
			this.list.loading = true
			this.$$api.stock.getInCarList(this.list.filter, page, rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list.map(item => {
        	item.doing = false
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
			this.list.filter.startDate = ''
			this.list.filter.endDate = ''
			this.getList()
		},
		showDialogInfo(type = 'new', row) { // 新增/修改车辆信息
			row = row || this.stockRow
			let brandPromise = this.$$api.car.getBrandList().then(({data}) => {
				this.cascader.data = data.map(item => {
					item.children = []
					return item
				})
				return data
			})

			let cangPromise = this.$$api.zuzhi.getCangList().then(({data}) => {
				this.dialogInfo.cangList = data
				return data
			})

			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改车辆信息'
				this.$$utils.copyObj(this.dialogInfo.data, row)
				this.cascader.value = [row.brandId, row.familyId, row.carsId]

				this.dialogInfo.uploadList = row.stockCarImages ? row.stockCarImages.split(',').map(img => {
					return {
						url: this.$$utils.image.thumb(img, 150), 
						thumb: this.$$utils.image.thumb(img, 150), 
						src: img, 
						name: img, 
						status: 'success'
					}
				}) : []

				if(row.brandId) {
					brandPromise.then(data => {
						this.cascaderItemChange([row.brandId]).then(_ => {
							if(row.familyId) {
								this.cascaderItemChange([row.brandId, row.familyId])
							}
						})
						return data
					})
				}
			} else {
				this.dialogInfo.title = '新增车辆信息'
				this.resetDialogInfo()
				this.dialogInfo.data.storageId = row.storageId
			}

			const loading = this.$loading()
			Promise.all([brandPromise, cangPromise]).then(dataArr =>　{
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
			this.resetDialogInfo()
		},
		resetDialogInfo() {
			this.$refs.infoForm && this.$refs.infoForm.resetFields()
			this.cascader.value = []
			this.dialogInfo.uploadList = []
			this.$$utils.copyObj(this.dialogInfo.data, '')
		},
		submitDialogInfo() { // 提交车辆信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.stock.addInCar(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '车辆信息成功'
						})

						this.$$parent && this.$$parent.refreshList()
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
		deleteInfo(row) { // 删除车辆
			this.$confirm('是否确定删除该车辆?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.stock.delIn(row.stockCarId).then(_ => {
					this.$message({
						type: 'success',
						message: '删除车辆成功'
					})
					this.refreshList()
				}).finally(_ => {
					row.doing = false
				})
      })
		},
		showImages(imagesArr = []) { // 查看图片
			if(imagesArr && imagesArr.length > 0) {
				this.$refs.viewer.show(0, imagesArr)
			}else{
				this.$message.info('没有可查看图片')
			}
		}
	},
	mounted() {
		this.$$event.$on('stock:car-list', (row, that) => {
			this.$$parent = that
			this.stockRow = row
			this.list.filter.storageId = row.storageId
			this.dialogList.info = row
			if(row.contractImage) {
				this.dialogList.info.imagesArr = row.contractImage.split(',').map(img => {
					return {
						url: this.$$utils.image.thumb(img, 150), 
						thumb: this.$$utils.image.thumb(img, 150), 
						src: img, 
						name: img, 
						status: 'success'
					}
				})
			}
			this.dialogList.visible = true
			this.getList()
		})
		
		this.$$event.$on('stock:car-add', (row, that) => {
			this.$$parent = that
			this.stockRow = row
			this.showDialogInfo('new', row)
		})
	}
}
</script>