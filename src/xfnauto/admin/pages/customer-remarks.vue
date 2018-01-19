<template>
	<div class="l-flex-v" style="height: 100%;">
		<div class="l-rest l-scroll">
			<div class="l-padding">
				<div class="l-flex-h l-margin-b" v-for="item in data.list" :key="item.systemUserId">
					<div class="l-text-gray" style="width: 180px; font-size:12px;">{{item.createDate}}</div>
					<div class="l-text-gray" style="width: 100px; font-size:12px;">{{item.systemUserName}}</div>
					<div>{{item.remarksContent}}</div>
				</div>
			</div>
		</div>
		<div class="l-text-right l-margin-t">
			<el-button type="primary" @click="dialogRemark.visible = true">新增备注</el-button>
		</div>
		<el-dialog class="l-padding-t-0" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" title="新增备注" :visible.sync="dialogRemark.visible" width="500px">
			<el-input type="textarea" v-model="dialogRemark.data.remarksContent" placeholder="请输入备注内容"></el-input>
			<div class="l-padding l-text-center">
				<el-button style="width: 120px;" type="primary" :loading="dialogRemark.loading" @click="submit">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
export default {
	name: 'customer-remarks',
	props: {
		data: {
			type: Object,
			default() {
				return {}
			}
		},
		parent: {
			type: Object
		}
	},
	data() {
		return {
			loading: false,
			dialogRemark: {
				loading: false,
				visible: false,
				data: {
					customerUsersId: '',
					remarksContent: ''
				}
			}
		}
	},
	methods: {
		submit() {
			if(!this.dialogRemark.data.remarksContent) {
				this.$message.error('请输入备注内容')
				return
			}

			this.dialogRemark.loading = true
			this.dialogRemark.data.customerUsersId = this.data.customerUsersId
			this.$$api.customer.saveRemark(this.dialogRemark.data).then(({data}) => {
				this.dialogRemark.visible = false
				this.dialogRemark.data.remarksContent = ''
				this.$message.success('保存备注成功')
				if(data) {
					this.data.list.push(data)
				}else{
					this.parent && this.parent.getInfo()
				}
			}).finally(_ => {
				this.dialogRemark.loading = false
			})
		}
	}
}
</script>