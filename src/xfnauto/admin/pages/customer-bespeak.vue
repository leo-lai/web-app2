<template>
	<div>
		<el-row>
			<el-col :span="6">
				<el-button type="primary" @click="showDialogInfo('new')">新增预约客户</el-button>
			</el-col>
  		<el-col :span="18" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
  				<el-form-item>
  					<el-select v-model="list.filter.orgId" placeholder="请选择公司/门店" @change="search()">
				      <el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
				    </el-select>
  				</el-form-item>
				  <el-form-item prop="dateRange" style="width:360px;">
				  	<el-date-picker style="width: 100%;" type="datetimerange"
				  		range-separator="到" start-placeholder="从预约时间" end-placeholder="预约时间"
				  		v-model="list.filter.dateRange" :picker-options="dateOptions" @change="filterDateChange"></el-date-picker>
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
	    <el-table-column label="客户姓名" prop="customerUsersName"></el-table-column>
	    <el-table-column label="客户手机号" prop="phoneNumber"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="预约车型" prop="intentionCarInfo" min-width="150"></el-table-column>
	    <el-table-column label="预约门店" prop="orgShortName" align="center"></el-table-column>
	    <el-table-column class-name="l-fs-xs" label="预约到店时间" align="center" min-width="140">
	    	<template slot-scope="scope">
	    		<span style="display:inline-block;">{{scope.row.appointmentDate}}</span>
	    		<span style="display:inline-block; margin-left: 0.125rem;">{{scope.row.timeOfAppointment}}</span>
	    	</template>
	    </el-table-column>
	    <el-table-column label="打算购车时间" align="center">
	    	<template slot-scope="scope">
	    		{{$$config.baseData.buyTime[scope.row.carPurchaseIntention - 1]}}
	    	</template>
	    </el-table-column>
	    <el-table-column label="操作" min-width="150" align="center">
	    	<template slot-scope="scope">
	    		<span v-show="!scope.row.doing">
	    			<el-button type="text" size="mini" @click="showDialogInfo('edit', scope.row)">编辑</el-button>
		        <el-button type="text" size="mini" @click="showDialogTrack(scope.row)">分配销售顾问</el-button>
		        <el-button type="text" size="mini" @click="notBuy(scope.row)">标记不购车</el-button>
	        </span>
	        <span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
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

	  <!-- 新增预约客户 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="713px">
  		<el-form ref="infoForm" inline class="l-form1" label-width="120px" 
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
			  <el-form-item label="客户姓名" prop="customerUsersName" >
			    <el-input v-model="dialogInfo.data.customerUsersName" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="客户电话" prop="phoneNumber" >
			    <el-input v-model="dialogInfo.data.phoneNumber" :maxlength="11"></el-input>
			  </el-form-item>
			  <el-form-item label="预约到店日期" prop="appointmentDate" >
					<el-date-picker type="date" value-format="yyyy-MM-dd" :editable="false" :clearable="false" placeholder="选择日期" 
						v-model="dialogInfo.data.appointmentDate" :picker-options="dateOptions"></el-date-picker>
			  </el-form-item>
			  <el-form-item label="时间段" prop="timeOfAppointment">
			  	<el-time-picker is-range format="HH:mm" value-format="HH:mm" :editable="false" :clearable="false"
			  		start-placeholder="开始时间" end-placeholder="结束时间" 
			  		v-model="dialogInfo.timeOfAppointment" :picker-options="timeOptions"></el-time-picker>
			  </el-form-item>
			  <el-form-item label="打算购车时间" prop="carPurchaseIntention" >
			  	<el-select v-model="dialogInfo.data.carPurchaseIntention" placeholder="请选择">
				    <el-option v-for="(name, index) in $$config.baseData.buyTime" :key="index" :label="name" :value="index + 1"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="打算购车方案" prop="expectWayId">
			  	<el-select v-model="dialogInfo.data.expectWayId" placeholder="请选择">
			  		<el-option v-for="(name, index) in $$config.baseData.buyWay" :key="index" :label="name" :value="index + 1"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item class="_flex" label="意向车辆" prop="carsId" >
			  	<el-cascader id="d_carsName" ref="r_carsName" style="width: 100%;" :show-all-levels="false" @active-item-change="cascaderChange"
			    	v-model="cascader.value" :options="cascader.data" :props="cascader.props"></el-cascader>
			  </el-form-item>
			  <el-form-item label="销售顾问" prop="systemUserId" >
			  	<el-select filterable v-model="dialogInfo.data.systemUserId" placeholder="请选择">
				    <el-option v-for="user in salesList" :key="user.systemUserId" :label="user.systemUserName" :value="user.systemUserId"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item class="_flex" label="备注" prop="remark">
			  	<el-input type="textarea" v-model="dialogInfo.data.remark" :maxlength="500"></el-input>
			  </el-form-item>
			  
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>

		<el-dialog title="分配销售顾问" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogTrack.visible" width="400px">
			<!-- <p class="l-margin-b">此操作将自动转为跟踪客户，请在“跟踪客户”中查看</p> -->
			<p class="l-margin-b">请选择销售顾问</p>
			<el-select filterable v-model="dialogTrack.data.systemUserId" placeholder="请选择销售顾问">
		    <el-option v-for="user in salesList" :key="user.systemUserId" :label="user.systemUserName" :value="user.systemUserId"></el-option>
		  </el-select>
		  <span slot="footer" class="l-margin-r-m">
				<el-button @click="dialogTrack.visible = false">取消</el-button>
		    <el-button type="primary" :loading="dialogTrack.loading" @click="submitDialogTrack">确定提交</el-button>
		  </span>
		</el-dialog>

	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'customer-bespeak',
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
		let validateTimeRang = function(rule, value, callback) {
			if (that.dialogInfo.timeOfAppointment.length === 0){
        callback(new Error('必填项'))
      }else{
      	that.dialogInfo.data.timeOfAppointment = that.dialogInfo.timeOfAppointment.join('-')
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
			dateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '明天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      timeOptions: {
      	selectableRange: ['08:00:00 - 19:00:00', '09:00:00 - 20:00:00']
      },
			list: {
				filter: {
					dateRange: [],
					startDate: '',
					endDate: '',
					orgId: ''
				},
				rules: {
					dateRange: [],
					startDate: [],
					endDate: [],
					orgId: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			salesList: [],
			dialogInfo: {
				title: '新增预约客户',
				visible: false,
				loading: false,
				timeOfAppointment: ['08:00','20:00'],
				rules: {
					customerUsersName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					phoneNumber: [
						{ required: true, message: '必填项', trigger: 'blur' },
						{ pattern: /^1\d{10}$/, message: '请输入正确的手机号码', trigger: 'blur' }
					],
					carPurchaseIntention: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					],
					carsId: [
						{ required: true, validator: validateCarModel, trigger: 'change' }
					],
					expectWayId: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					],
					appointmentDate: [
						{ required: true, message: '必填项', trigger: 'change' }
					],
					timeOfAppointment: [
						{ required: true, validator: validateTimeRang, message: '必填项', trigger: 'change' }
					],
					systemUserId: [
						{ required: true, type:'number', message: '必填项', trigger: 'change' }
					]
				},
				data: {
					customerUsersOrgId: '',
					customerUsersName: '',
					phoneNumber: '',
					appointmentDate: '',
					timeOfAppointment: '',
					expectWayId: '',
					carPurchaseIntention: '',
					carsId: '',
					systemUserId: '',
					remarks: ''
				}
			},
			dialogTrack: {
				visible: false,
				data: {
					customerUsersOrgId: '',
					systemUserId: ''
				}
			}
		}
	},
	computed: {
		...mapGetters([
  		'zuzhiList',
  		'userInfo'
    ])
	},
	methods: {
		filterDateChange(value) {
			if(value && value.length >= 2) {
				this.list.filter.startDate = value[0]
				this.list.filter.endDate = value[1]
				this.search()	
			}
		},
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			this.$$api.customer.getBespeakList(this.list.filter, page, rows)
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
		cascaderChange(valArr) { // 意向车型
			let promise = null
			let currentBrand = this.cascader.data.filter(brand => brand.id === valArr[0])[0]
      if(valArr.length === 1) { // 获取车系(by brandId)
      	if(currentBrand && currentBrand.children && currentBrand.children.length === 0) {
	      	promise = this.$$api.car.getFamilyList(valArr[0]).then(({data}) => {
	      		let familyList = data.map(family => {
	      			family.children = []
	      			return family
	      		})
	      		currentBrand.children = familyList
	      		return data
	      	})	
      	}
      }else if(valArr.length === 2) { // 获取车大类
      	let currentFamily = currentBrand.children.filter(family => family.id === valArr[1])[0]
      	if(currentFamily && currentFamily.children && currentFamily.children.length === 0) {
	      	promise = this.$$api.car.getCarsList(valArr[1]).then(({data}) => {
	      		currentFamily.children = data
	      		return data
	      	})	
      	}
      }else {
      	promise = Promise.resolve()
      }
      return promise
		},
		showDialogInfo(type = 'new', row) { // 新增预约客户
			this.resetDialogInfo()

			let brandPromise = this.$$api.car.getBrandList().then(({data}) => {
				this.cascader.data = data.map(item => {
					item.children = []
					return item
				})
			})

			let salesPromise = this.$$api.user.getSalesList().then(({data}) => {
				this.salesList = data
				return data
			})

			this.dialogInfo.type = type
			if(type === 'edit'){
				this.dialogInfo.title = '修改预约信息'
				this.$$utils.copyObj(this.dialogInfo.data, row)
				this.dialogInfo.timeOfAppointment = this.dialogInfo.data.timeOfAppointment ? this.dialogInfo.data.timeOfAppointment.split('-') : []
				this.cascader.value = [row.brandId, row.familyId, row.intentionCarId]
				if(row.brandId) {
					brandPromise.then(data => {
						this.cascaderChange([row.brandId]).then(_ => {
							if(row.familyId) {
								this.cascaderChange([row.brandId, row.familyId])
							}		
						})
					})
				}

			}else {
				this.dialogInfo.title = '新增预约信息'
				// this.dialogInfo.data.systemUserId = this.userInfo.userId
				this.resetDialogInfo()
			}
			const loading = this.$loading()
			Promise.all([brandPromise, salesPromise]).then(dataArr =>　{
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
			// this.dialogInfo.timeOfAppointment = []
			this.$$utils.copyObj(this.dialogInfo.data, '')
		},
		submitDialogInfo() { // 提交客户
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.dialogInfo.data.timeOfAppointment = this.dialogInfo.timeOfAppointment.join('-')
          this.$$api.customer.add(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: '新增预约客户成功'
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
		notBuy(row) { // 不购买
			this.$confirm('此操作将不再显示该条预约信息，客户状态也将变更为不买车，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.customer.notBuy(row.customerUsersOrgId).then(_ => {
					this.$message.success('标记成功')
					this.refreshList()
				}).finally(_ => {
					row.doing = false
				})
      })
		},
		showDialogTrack(row) {
			const loading = this.$loading()
			this.$$api.user.getSalesList().then(({data}) => {
				this.salesList = data
				this.$$utils.copyObj(this.dialogTrack.data, row)
				this.dialogTrack.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		submitDialogTrack() {
			if(this.dialogTrack.data.systemUserId) {
				this.dialogTrack.loading = true
				this.$$api.customer.track(this.dialogTrack.data).then(_ => {
	        this.dialogTrack.visible = false
	        this.$message.success('分配成功')
	        this.refreshList()
	      }).finally(()=>{
	        this.dialogTrack.loading = false
	      })
	    }else {
	    	this.$message.error('请选择销售顾问')
	    }
		}
	},
	mounted() {
		this.$$event.$on('customer:tab', (activeName, that) => {
			this.$$parent = that
			if(activeName === 'bespeak' && this.list.data.length === 0) {
				this.getList()
				this.$store.dispatch('getZuzhiList')
			}
		})
	},
	beforeDestroy() {
		this.$$event.$off('customer:tab')
	}
}
</script>