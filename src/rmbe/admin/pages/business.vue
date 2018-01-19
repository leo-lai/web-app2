<template>
	<div class="l-main-body">
		<el-row>
  		<el-col :span="4">
  			<el-button type="primary" @click="showDialogInfo('new')">录入商家</el-button>
  		</el-col>
  		<el-col :span="20" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent>
  				<el-form-item style="width: 140px;" prop="name" lalel="">
				    <el-input placeholder="商家姓名" v-model="list.filter.name"></el-input>
				  </el-form-item>
				  <el-form-item style="width: 140px;" prop="tel" lalel="">
				    <el-input placeholder="手机号码" v-model="list.filter.tel"></el-input>
				  </el-form-item>
				  <el-form-item style="width: 140px;" prop="related" label="">
				  	<el-select v-model="list.filter.related" placeholder="是否有设备" @change="search()">
				      <el-option label="是" :value="1"></el-option>
				      <el-option label="否" :value="0"></el-option>
				    </el-select>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
		<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" :data="list.data" v-loading="list.loading">
	    <el-table-column label="商家姓名" prop="name" min-width="120"></el-table-column>
	    <el-table-column label="商家地区" min-width="150">
	    	<template slot-scope="scope">
	    		<p>{{scope.row.province + scope.row.city + scope.row.district}}</p>
	    	</template>
	    </el-table-column>
	    
	    <el-table-column label="拥有设备数量" prop="own_device_count" align="center" min-width="150"></el-table-column>
	    <el-table-column label="启动失败次数" prop="device_failed_count" align="center" min-width="150">
	    	<template slot-scope="scope">
	    		<p :class="scope.row.device_failed_count >= 10 ? 'l-text-error' : ''">{{scope.row.device_failed_count}}</p>
	    	</template>
	    </el-table-column>
	    <el-table-column label="累计使用次数" prop="device_used_count" align="center" min-width="150"></el-table-column>
	    <el-table-column label="剩余使用次数" prop="rest_device_count" align="center" min-width="150"></el-table-column>
	    <el-table-column label="手机号码" prop="tel" align="center" min-width="150"></el-table-column>
	    <el-table-column fixed="right"label="状态" prop="status" align="center" min-width="150">
	    	<template slot-scope="scope">
	    		<el-switch v-model="scope.row.status" @change="disable(scope.row)" :active-value="1" active-text="启用" :inactive-value="0" inactive-text="禁用"></el-switch>
	      </template>
	    </el-table-column>
	    <el-table-column fixed="right" label="操作" align="center" min-width="100">
	    	<template slot-scope="scope">
	    		<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">编辑</el-button>
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

	  <!-- 录入/编辑角色 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="653px">
  		<el-form inline ref="infoForm" class="l-form1" label-width="90px"
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitInfo">
			  <el-form-item label="账号" prop="username">
			    <el-input v-model="dialogInfo.data.username" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="密码" prop="password">
			    <el-input v-model="dialogInfo.data.password" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="姓名" prop="name">
			    <el-input v-model="dialogInfo.data.name" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="手机号码" prop="tel">
			    <el-input v-model="dialogInfo.data.tel" :maxlength="11"></el-input>
			  </el-form-item>
			  <el-form-item label="店铺名称" prop="store_name">
			    <el-input v-model="dialogInfo.data.store_name" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="身份证号" prop="id_number">
			    <el-input v-model="dialogInfo.data.id_number" :maxlength="18"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="店铺地址" prop="region" @click.native="amapOpts.visible = true">
			  	<el-input readonly placeholder="请选择" :value="amapAddress"></el-input>
			  </el-form-item>
			  <el-form-item label="商家银行ID" prop="bank_id">
			    <el-input v-model="dialogInfo.data.bank_id" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="终端ID" prop="terminal_id">
			    <el-input v-model="dialogInfo.data.terminal_id" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item prop="access_token">
			  	<span slot="label" style="font-size:12px;">Access Token</span>
			    <el-input v-model="dialogInfo.data.access_token" :maxlength="50"></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitInfo">确定提交</el-button>
		  </span>
		</el-dialog>

		<!-- 地图选择 -->
		<amap-selector :visible.sync="amapOpts.visible" :options="amapOpts"></amap-selector>
	</div>
</template>
<script>
import AmapSelector from 'components/amap-selector'
import { getValueByText } from 'assets/js/region.data'

export default {
	name: 'business',
	components: {
		AmapSelector
	},
	data() {
		let that = this
		let validateRegion = function(rule, value, callback) {
      if (!(that.dialogInfo.data.region_id1 && that.dialogInfo.data.region_id2 
      	&& that.dialogInfo.data.region_id3 && that.dialogInfo.data.detail_address)){
        callback(new Error('请选择地址'))
      } else if(!that.dialogInfo.data.longitude || !that.dialogInfo.data.latitude){
        callback(new Error('经纬度不正确'))
      }else{
        callback()
      }
		}

		return {
			amapOpts: {
				visible: false,
				province: '',
        city: '',
        area: '',
        address: '',
        longitude: '',
        latitude: '',
				onSelected(addressObj) {
					let regionValue = getValueByText(addressObj.province, addressObj.city, addressObj.area)
					that.dialogInfo.data.region_id1 = regionValue[0] || ''
					that.dialogInfo.data.region_id2 = regionValue[1] || ''
					that.dialogInfo.data.region_id3 = regionValue[2] || ''
					
					that.dialogInfo.data.province = addressObj.province
					that.dialogInfo.data.city = addressObj.city
					that.dialogInfo.data.district = addressObj.area
					that.dialogInfo.data.detail_address = addressObj.address
					that.dialogInfo.data.longitude = addressObj.longitude
					that.dialogInfo.data.latitude = addressObj.latitude
				}
			},
			list: {
				filter: {
					tel: '',
					name: '',
					related: ''
				},
				rules: {
					tel: [],
					name: [],
					related: []
				},
				loading: false,
				page: 1,
				row: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '录入商家',
				visible: false,
				loading: false,
				rules: {
					username: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					name: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					tel: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					id_number: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					store_name: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					region: [
						{ required: true, validator: validateRegion, trigger: 'change' },
					]
				},
				data: {
					username: '',
					password: '',
					name: '',
					tel: '',
					id_number: '',
					store_name: '',
					region_id1: '',
					region_id2: '',
					region_id3: '',
					longitude: '',
					latitude: '',
					province: '',
					city: '',
					district: '',
					bank_id: '',
					detail_address: ''
				}
			}
		}
	},
	computed: {
		amapAddress() {
			let address = this.amapOpts.city + this.amapOpts.area + this.dialogInfo.data.detail_address
			if(this.amapOpts.province !== this.amapOpts.city) {
				address = this.amapOpts.province + address 
			}
			return address || ''
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
			this.$$api.business.getList(this.list.filter, page, row)
			.then(({data}) => {
				this.list.total = data.count
        this.list.page = Number(data.page_number) + 1
        this.list.row = Number(data.per_page)
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
		showDialogInfo(type = 'new', row) { // 录入/更新商家
			this.dialogInfo.type = type
			let promiseInfo = Promise.resolve()
			if(type === 'edit') {
				this.dialogInfo.title = '更新商家'
				this.$$utils.copyObj(this.dialogInfo.data, row)
				this.dialogInfo.data.seller_id = row.seller_id ? row.seller_id : row.id
				promiseInfo = this.$$api.business.getInfo({
					seller_id: this.dialogInfo.data.seller_id
				}).then(({data}) => {
					this.$$utils.copyObj(this.dialogInfo.data, data)
					this.$$utils.copyObj(this.amapOpts, data)
					this.amapOpts.area = data.district
					this.amapOpts.address = data.detail_address
				})
			} else {
				this.dialogInfo.title = '录入商家'
				this.$$utils.copyObj(this.dialogInfo.data, '')
			}

			const loading = this.$loading()
			promiseInfo.finally(_ => {
				setTimeout(_ => {
					loading.close()
					this.dialogInfo.visible = true
				}, 50)
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
		disable(row) {
			let formData = {
				seller_id: row.id,
				status: row.status
			}
			row.doing = true
			this.$$api.business.add(formData).then(_ => {
        this.$message.success(formData.status === 1 ? '启用成功' : '禁用成功')
      }).finally(_ => {
      	row.doing = false
      })
		},
		submitInfo() { // 提交商家信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.business.add(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '录入' : '更新') + '商家信息成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          }) 
        }
      })
		}
	},
	mounted() {
		this.getList()
	}
}
</script>
