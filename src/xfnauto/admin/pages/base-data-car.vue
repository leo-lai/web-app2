<template>
	<div>
		<el-row>
  		<el-col :span="8">
  			<el-button type="primary" @click="showDialogInfo('new')">新增</el-button>
  		</el-col>
  		<el-col :span="16" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item prop="carsName">
				    <el-input placeholder="请输入车型名称" auto-complete="on" v-model="list.filter.carsName"></el-input>
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
	    <el-table-column label="车型名称" prop="carsName" min-width="300"></el-table-column>
	    <el-table-column label="裸车价" prop="bareCarPrice"></el-table-column>
	    <el-table-column label="官方指导价" prop="price"></el-table-column>
	    <el-table-column label="操作">
	    	<template slot-scope="scope">
	        <span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
	        	<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">编辑</el-button>
	        	<el-button class="l-text-ok" type="text" size="small" @click="showDialogCheshen(scope.row)">图片配置</el-button>
	        	<el-button class="l-text-error" type="text" size="small" @click="deleteInfo(scope.row)">删除</el-button>
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

	  <!-- 新增/编辑车型 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="995px">
  		<el-form class="l-form1" ref="infoForm" label-width="100px" inline :model="dialogInfo.data" :rules="dialogInfo.rules">
  			<el-form-item class="_flex" label="车辆型号" prop="carModel" style="width: 622px;">
			    <el-cascader style="width: 100%;" @active-item-change="cascaderChange"
			    	v-model="cascader.value" :options="cascader.data" :props="cascader.props"></el-cascader>
			  </el-form-item>
			  <el-form-item label="车辆级别" prop="vehicleName" >
			    <el-select v-model="dialogInfo.data.vehicleName" placeholder="请选择">
				    <el-option value="SUV"></el-option>
				    <el-option value="桥车"></el-option>
				  </el-select>
			  </el-form-item>	
  			<el-form-item label="变速箱类型" prop="gearboxName" >
  				<el-select v-model="dialogInfo.data.gearboxName" placeholder="请选择">
				    <el-option value="手动"></el-option>
				    <el-option value="自动"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="排量" prop="pl" >
			    <el-input placeholder="如：1.8L" class="l-text-upper" v-model="dialogInfo.data.pl" :maxlength="20"></el-input>
			  </el-form-item>
			  <el-form-item label="综合油耗" prop="oilConsumption" >
			    <el-input placeholder="单位：L/100km" v-model="dialogInfo.data.oilConsumption" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="座位数" prop="seat" >
			    <el-input v-model="dialogInfo.data.seat" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="年款" prop="yearPattern" >
			  	<el-select v-model="dialogInfo.data.yearPattern" placeholder="请选择">
				    <el-option v-for="year in yearList" :key="year" :value="year"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="上市时间" prop="marketDate" >
			  	<el-date-picker type="date" value-format="yyyy-MM-dd" :editable="false" v-model="dialogInfo.data.marketDate" :picker-options="dateOptions"></el-date-picker>
			  </el-form-item>
			  <el-form-item label="裸车价" prop="bareCarPrice" >
			    <el-input v-model="dialogInfo.data.bareCarPrice" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="指导价" prop="price" >
			    <el-input v-model="dialogInfo.data.price" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="车辆介绍" prop="introduce">
			 		<quill-editor ref="dialogInfoEditor" class="l-text-editor" v-model="dialogInfo.data.introduce"></quill-editor>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>

		<!-- 车身颜色图片配置管理 -->
		<el-dialog :close-on-press-escape="false" title="车身颜色图片配置" :visible.sync="dialogCheshen.visible" width="600px">
			<div style="margin: -20px 0 10px;">
				<span>当前车辆型号：</span>
				<span class="l-text-gray">{{dialogCheshen.carsName}}</span>
			</div>
			<div ref="cheshenScroll" class="l-scroll" style="max-height: 400px;">
	  		<el-table class="l-table-hdbg" :data="dialogCheshen.list">
			    <el-table-column label="车身颜色" prop="carColourName"></el-table-column>
			    <el-table-column label="操作" align="center">
			    	<template slot-scope="scope">
			        <el-button class="l-text-link" type="text" size="small" @click="dialogCheshenImages(scope.row)">编辑图片</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
		  </div>

		  <!-- 车身颜色图片编辑 -->
		  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" append-to-body width="600px"
		  	:title="dialogCheshen.title" :visible.sync="dialogCheshen.innerVisible" :before-close="closeCheshenImages">
		  	<el-form inline class="l-form1" ref="cheshenColorForm" label-width="90px" style="width: 552px;"
	  			:model="dialogCheshen.data" :rules="dialogCheshen.rules" @keyup.enter.native="submitCheshenImages">
				  <el-form-item label="车身颜色" prop="carColourName">
				    <el-input readonly :value="dialogCheshen.data.carColourName"></el-input>
				  </el-form-item>
				  <el-form-item class="_flex" label="车身照片" prop="imageUpload">
				  	<uploader ref="dialogCheshenUpload" :file-list.sync="dialogCheshen.uploadList"></uploader>
				  </el-form-item>
				</el-form>
				<span slot="footer" class="l-margin-r-m">
					<el-button @click="closeCheshenImages()">返回</el-button>
			    <el-button type="primary" :loading="dialogCheshen.loading" @click="submitCheshenImages">确定提交</el-button>
			  </span>
		  </el-dialog>
		</el-dialog>
	</div>
</template>
<script>
import uploader from 'components/uploader'
export default {
	name: 'base-data-car',
	components: {
		uploader
	},
	data() {
		let that = this
		// 车辆型号选择
		let validateCarModel = function(rule, value, callback) {
			if (that.cascader.value.length === 0){
        callback(new Error('必填项'))
      }else{
      	that.dialogInfo.data.brandId = that.cascader.value[0] || ''
      	that.dialogInfo.data.familyId = that.cascader.value[1] || ''
      	that.dialogInfo.data.styleId = that.cascader.value[2] || ''
        callback()
      }
		}

		// 富文本编辑器图片上传
		let validateEditor = function(rule, value, callback) {
			if(that.dialogInfo.data.introduce && 
				that.$refs.dialogInfoEditor.$el.querySelectorAll('.l-convert-doing').length > 0) {
				that.$message.error('等待图片上传完毕')
				// callback(new Error(''))
			}else {
				callback()
			}
		}

		// 图片配置上传
		let validateUpload = function(rule, value, callback) {
			if(that.$refs.dialogCheshenUpload.waiting > 0) {
				callback(new Error('图片正在上传中'))
			}else {
				that.dialogCheshen.data.imagePath = that.dialogCheshen.uploadList.map(item => item.src || item.url).join(',')
				callback()
			}
		}

		return {
			yearList: [],
			dateOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
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
				filter: {
					carsName: ''
				},
				rules: {
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
				title: '新增车型资料',
				visible: false,
				loading: false,
				rules: {
					carModel: [
						{ required: true, validator: validateCarModel, trigger: 'change' }
					],
					vehicleName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					gearboxName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					pl: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					oilConsumption: [
						{ required: true, pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '必填项，正确格式(如：10.24)', trigger: 'blur' }
					],
					seat: [
						{ required: true, pattern: /^\d{1,9}$/, message: '请输入正确数字', trigger: 'blur' }
					],
					yearPattern: [
						{ required: true, type: 'number', message: '必填项', trigger: 'blur' }
					],
					marketDate: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					bareCarPrice: [
						{ required: true, pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '必填项，正确格式(如：10.24)', trigger: 'blur' }
					],
					price: [
						{ required: true, pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '必填项，正确格式(如：10.24)', trigger: 'blur' }
					],
					introduce: [
						{ validator: validateEditor, trigger: 'change' }
					]
				},
				data: {
					carId: '',
					brandId: '',
					familyId: '',
					styleId: '',
					vehicleName: '',
					gearboxName: '',
					pl: '',
					oilConsumption: '',
					seat: '',
					yearPattern: '',
					marketDate: '',
					bareCarPrice: '',
					price: '',
					introduce: ''
				}
			},
			dialogCheshen: {
				visible: false,
				loading: false,
				carsId: '',
				familyId: '',
				carsName: '',
				list: [],

				title: '编辑车身颜色图片',
				innerVisible: false,
				uploadList: [],
				rules: {
					imageUpload: [
						{ validator: validateUpload, trigger: 'change' },
					]
				},
				data: {
					carsId: '',
					carColourId: '',
					carColourImageId: '',
					carColourName: '',
					imagePath: ''
				}
			}
		}
	},
	methods: {
		cascaderChange(valArr) {
			let promise = null
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
      }else if(valArr.length === 2) { // 获取车等级(by familyId)
      	let currentFamily = currentBrand.children.filter(family => family.id === valArr[1])[0]
      	if(currentFamily && currentFamily.children && currentFamily.children.length === 0) {
	      	promise = this.$$api.car.getStyleList(valArr[1]).then(({data}) => {
	      		currentFamily.children = data
	      		return data
	      	})	
      	}
      }else {
      	promise = Promise.resolve()
      }
      return promise
		},
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			this.$$api.car.getList(this.list.filter, page, rows)
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
		showDialogInfo(type = 'new', row) { // 新增/修改车型弹出信息
			let brandPromise = this.$$api.car.getBrandList().then(({data}) => {
				this.cascader.data = data.map(item => {
					item.children = []
					return item
				})
			})
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改车型资料'
				this.$$utils.copyObj(this.dialogInfo.data, row)
				this.cascader.value = [row.brandId, row.familyId, row.styleId]

				if(row.brandId) {
					brandPromise.then(data => {
						this.cascaderChange([row.brandId]).then(_ => {
							if(row.familyId) {
								this.cascaderChange([row.brandId, row.familyId])
							}		
						})
					})
				}
			} else {
				this.dialogInfo.title = '新增车型资料'
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

			this.$refs.dialogInfoEditor.quill.root.click()
			this.resetDialogInfo()
		},
		resetDialogInfo() {
			this.$refs.infoForm && this.$refs.infoForm.resetFields()
			this.cascader.value = []
			this.$$utils.copyObj(this.dialogInfo.data, '')
		},
		submitDialogInfo() { // 提交车型资料
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.dialogInfo.data.pl = this.dialogInfo.data.pl.toUpperCase()
          this.$$api.car.add(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '车型资料成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }else {
        	this.$message.error('请完善表单信息')
        }
      })
		},
		deleteInfo(row) { // 删除车型资料
			this.$confirm('是否确定删除该车型资料?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.car.del(row.carId).then(_ => {
					this.$message({
						type: 'success',
						message: '删除车型资料成功'
					})
					this.refreshList()
				}).finally(_ => {
					row.doing = false
				})
      })
		},
		getCheshenColors(carFamilyId = '') { // 获取车身颜色列表
			return this.$$api.color.getCheshenList(carFamilyId).then(({data}) => {
				this.dialogCheshen.list = data.map(item => {
        	item.loading = false
        	item.editing = false
        	return item
        })
        return data
			})
		},
		showDialogCheshen(row) { // 车身颜色图片弹窗管理
			const loading = this.$loading()
			this.dialogCheshen.carsId = row.carsId
			this.dialogCheshen.carsName = row.carsName
			this.dialogCheshen.familyId = row.familyId
			this.getCheshenColors(row.familyId).then(_ => {
        this.dialogCheshen.visible = true	
			}).finally(_ => {
				loading.close()
			})
		},
		dialogCheshenImages(row) { // 编辑车身颜色图片
			this.dialogCheshen.data.carsId = this.dialogCheshen.carsId
			this.dialogCheshen.data.carColourId = row.carColourId
			this.dialogCheshen.data.carColourName = row.carColourName

			const loading = this.$loading()
			this.$$api.color.getImages(this.dialogCheshen.carsId, row.carColourId)
			.then(({data}) => {
				if(data) {
					this.dialogCheshen.data.carColourImageId = data.carColourImageId
					this.dialogCheshen.uploadList = data.imagePath ? data.imagePath.split(',').map(img => {
						return {
							url: this.$$utils.image.thumb(img, 150), 
							thumb: this.$$utils.image.thumb(img, 150), 
							src: img, 
							name: img, 
							status: 'success'
						}
					}) : []
				}else {
					this.dialogCheshen.data.carColourImageId = ''
					this.dialogCheshen.uploadList = []
				}
			}).finally(_ => {
				loading.close()
				this.dialogCheshen.innerVisible = true
			})
		},
		closeCheshenImages(done) {
			if(done) {
				done()
			}else{
				this.dialogCheshen.innerVisible = false	
			}
			this.dialogCheshen.uploadList = []
		},
		submitCheshenImages() { // 提交车身颜色图片
			this.$refs.cheshenColorForm.validate(valid => {
        if (valid) {
          this.dialogCheshen.loading = true
          this.$$api.color.addImages(this.dialogCheshen.data).then(_ => {
          	this.$message({
							type: 'success',
							message: '上传车身颜色图片成功'
						})
          }).finally(()=>{
            this.dialogCheshen.loading = false
            this.dialogCheshen.innerVisible = false
          })
        }
      })
		}
	},
	mounted() {
		let year = 2010
		while(year <= 2025) {
			this.yearList.push(year++)
		}

		this.$$event.$on('base-data:tab', activeName => {
			if(activeName === 'car' && this.list.data.length === 0) {
				this.getList()
			}
		})
	}
}
</script>