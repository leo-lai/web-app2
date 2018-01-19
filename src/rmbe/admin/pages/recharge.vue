<template>
	<div class="l-main-body">
		<el-tabs v-model="tabActive" @tab-click="tabClick" type="border-card" style="width: 700px;">
		  <el-tab-pane label="" name="price">
				<div style="min-width: 100px; text-align:center;" slot="label">单价</div>
				<div class="l-padding">
					<el-form inline>
						<el-form-item label="单价（元）">
					    <el-input v-model="price.money" :maxlength="50"></el-input>
					  </el-form-item>
					  <el-form-item>
					  	<el-button :loading="price.loading" type="primary" @click="setPrice">确定</el-button>	
					  </el-form-item>
					</el-form>
				</div>
		  </el-tab-pane>
		  <el-tab-pane label="" name="coupon">
				<div style="min-width: 100px; text-align:center;" slot="label">优惠</div>
				<div class="l-margin-b l-text-right">
					<el-button type="primary" @click="showDialogCoupon('new')">添加新优惠</el-button>
				</div>
				<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" :data="couponList.data" v-loading="couponList.loading">
			    <el-table-column label="基础（次）" prop="base_count" align="center"></el-table-column>
			    <el-table-column label="赠送（次）" prop="give_count" align="center"></el-table-column>
			    <el-table-column label="操作" align="center">
			    	<template slot-scope="scope">
					    <span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
			        <span v-show="!scope.row.doing">
			        	<el-button class="l-text-link" type="text" size="small" @click="deleteCoupon(scope.row)">删除</el-button>
			        </span>
			      </template>
			    </el-table-column>
			  </el-table>
		  </el-tab-pane>
		  <el-tab-pane label="" name="tmpl">
				<div style="min-width: 100px; text-align:center;" slot="label">
					模板
					<span v-show="tmpl.loading" class="l-text-warn">
						<i class="el-icon-loading"></i>&nbsp;操作中
					</span>
				</div>
				<div class="l-tmpl l-padding">
					<el-tag :key="item.id" v-for="item in tmpl.list" type="info" closable :disable-transitions="false" @close="closeTmpl(item.id)">{{item.name}}</el-tag>
					<el-input v-if="tmpl.visible" ref="newTagItem" class="input-new-tag" size="small"
						v-model="tmpl.newValue" @keyup.enter.native="saveNewTmpl" @blur="saveNewTmpl">
					</el-input>
					<el-button v-else class="button-new-tag" type="primary" size="small" @click="showNewTmpl">增加模板 +</el-button>
				</div>
		  </el-tab-pane>
		</el-tabs>

		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogCoupon"
			:title="dialogCoupon.title" :visible.sync="dialogCoupon.visible" width="480px">
  		<el-form ref="couponForm" label-width="90px" style="width: 432px;"
  			:model="dialogCoupon.data" :rules="dialogCoupon.rules" @keyup.enter.native="submitCoupon">
			  <el-form-item label="基础次数" prop="base_count">
			    <el-input v-model="dialogCoupon.data.base_count" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item label="赠送次数" prop="give_count">
			    <el-input v-model="dialogCoupon.data.give_count" :maxlength="10"></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogCoupon()">取消</el-button>
		    <el-button type="primary" :loading="dialogCoupon.loading" @click="submitCoupon">确定提交</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>

export default {
	name: 'recharge',
	data() {
		return {
			tabActive: 'price',
			price: {
				loading: false,
				money: ''
			},
			couponList: {
				loading: false,
				data: []
			},
			tmpl: {
				loading: false,
				visible: false,
				newValue: '',
				list: []
			},
			dialogCoupon: {
				type: 'new',
				title: '添加新优惠',
				visible: false,
				loading: false,
				rules: {
					base_count: [
						{ required: true, message: '必填项', trigger: 'blur' },
						{ pattern: /^\d{1,9}$/, message: '必须是整数', trigger: 'blur' }
					],
					give_count: [
						{ required: true, message: '必填项', trigger: 'blur' },
						{ pattern: /^\d{1,9}$/, message: '必须是整数', trigger: 'blur' }
					]
				},
				data: {
					base_count: '',
					give_count: ''
				}
			}
		}
	},
	methods: {
		tabClick() {
			if(this.tabActive === 'coupon'){
				this.getCouponList()
			}else if(this.tabActive === 'tmpl') {
				this.getTmplList()
			}
		},
		getCouponList() {
			this.couponList.loading = true
			this.$$api.recharge.getCouponList().then(({data}) => {
				this.couponList.data = data.list.map(item => {
					item.doing = false
					return item
				})
			}).finally(_ => {
				this.couponList.loading = false
			})
		},
		showDialogCoupon(type = 'new', row) { // 新增优惠
			this.dialogCoupon.type = type
			let promiseInfo = Promise.resolve()
			
			const loading = this.$loading()
			promiseInfo.finally(_ => {
				setTimeout(_ => {
					loading.close()
					this.dialogCoupon.visible = true
				}, 50)
			})
		},
		closeDialogCoupon(done) {
			if(done) {
				done()
			}else{
				this.dialogCoupon.visible = false	
			}
			this.$refs.couponForm.resetFields()
			this.$$utils.copyObj(this.dialogCoupon.data, '')
		},
		submitCoupon() { // 提交优惠信息
			this.$refs.couponForm.validate(valid => {
        if (valid) {
          this.dialogCoupon.loading = true
          this.$$api.recharge.addCoupon(this.dialogCoupon.data).then(_ => {
            this.closeDialogCoupon()
            this.$message.success('添加优惠成功')
            this.getCouponList()
          }).finally(()=>{
            this.dialogCoupon.loading = false
          })  
        }
      })
		},
		deleteCoupon(row) { // 删除优惠
			this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.recharge.delCoupon(row.id).then(_ => {
					this.$message.success('删除成功')
					this.getCouponList()
				}).finally(_ => {
					row.doing = false
				})
      })
		},
		setPrice() {
			if(!this.price.money) {
				this.$message.error('请输入单价')
				return
			}
			if(!/^\d{1,9}(\.\d{1,2})?$/.test(this.price.money)) {
				this.$message.error('请输入正确的价格')
				return
			}

			this.price.loading = true
			this.$$api.recharge.setPrice(this.price.money).then(_ => {
				this.$message.success('设置单价成功')
			}).finally(_ => {
				this.price.loading = false
			})
		},
		getTmplList() { // 获取模板列表
			this.tmpl.loading = true
			this.$$api.recharge.getTmplList().then(({data}) => {
				this.tmpl.list = data.list.map(item => {
					item.doing = false
					return item
				})
			}).finally(_ => {
				this.tmpl.loading = false
			})
		},
		closeTmpl(tmplId) {
			this.tmpl.loading = true
			this.$$api.recharge.delTmpl(tmplId).then(_ => {
				this.tmpl.list.splice(this.tmpl.list.findIndex(item => item.id === tmplId), 1)
			}).finally(_ => {
				this.tmpl.loading = false
			})
		},
		showNewTmpl() {
			this.tmpl.visible = true
      this.$nextTick(_ => {
        this.$refs.newTagItem.$refs.input.focus()
      })
		},
		saveNewTmpl() {
      if (this.tmpl.visible) {
      	if(!this.tmpl.newValue) {
      		this.tmpl.visible = false
					return
				}

				if(!/^\d{1,9}(\.\d{1,2})?$/.test(this.tmpl.newValue)) {
					this.$message.error('请输入整数')
					this.$refs.newTagItem.$refs.input.focus()
					return
				}

				this.tmpl.loading = true
				this.$$api.recharge.addTmpl(this.tmpl.newValue).then(({data}) => {
					this.tmpl.list.push(data)
				}).finally(_ => {
					this.tmpl.loading = false
					this.tmpl.visible = false
      		this.tmpl.newValue = ''
				})
      }
		}
	},
	mounted() {
		this.$$api.recharge.getPrice().then(money => {
			this.price.money = money
		})
	}
}
</script>
<style lang="less">
.l-tmpl{
	.el-tag{
	  margin:0 10px 15px 0;
	}
	.button-new-tag {
	  margin:0 10px 15px 0;
	  height: 32px;
	  line-height: 30px;
	  padding-top: 0;
	  padding-bottom: 0;
	}
	.input-new-tag {
	  width: 90px;
	  margin:0 10px 10px 0;
	  vertical-align: bottom;
	}	
}

</style>