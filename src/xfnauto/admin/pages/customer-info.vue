<template>
	<div class="l-flex-v" style="height: 100%;">
		<div class="l-rest l-scroll">
			<table class="l-table-info">
	  		<caption>基本信息</caption>
				<tr>
					<td class="_tit">姓名</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.customerUsersName" placeholder="请填写">
					</td>
					<td class="_tit">手机号码</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="11" v-model="data.phoneNumber" placeholder="请填写">
					</td>
				</tr>
				<tr>
					<td class="_tit">性别</td>
					<td class="_cont">
						<el-radio-group class="_radio" v-model="data.agentGender">
					    <el-radio :label="1">男</el-radio>
					    <el-radio :label="2">女</el-radio>
					  </el-radio-group>
					</td>
					<td class="_tit">年收入(万元)</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.annualIncome" placeholder="请填写">
					</td>
				</tr>
				<tr>
					<td class="_tit">身份证号</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="18" v-model="data.cardNo" placeholder="请填写">
					</td>
					<td class="_tit">收入来源</td>
					<td class="_cont">
						<el-select v-model="data.incomeSource" placeholder="请选择">
					    <el-option value="工资"></el-option>
					    <el-option value="金融理财"></el-option>
					    <el-option value="个体经营"></el-option>
					    <el-option value="其他"></el-option>
					  </el-select>
					</td>
				</tr>
				<tr>
					<td class="_tit">婚姻状况</td>
					<td class="_cont">
						<el-radio-group class="_radio" v-model="data.maritalStatus">
					    <el-radio :label="1">未婚</el-radio>
					    <el-radio :label="2">已婚</el-radio>
					  </el-radio-group>
					</td>
					<td class="_tit">现住房来源</td>
					<td class="_cont">
						<el-select v-model="data.housingSource" placeholder="请选择">
					    <el-option value="租借"></el-option>
					    <el-option value="按揭"></el-option>
					    <el-option value="自有"></el-option>
					    <el-option value="父母"></el-option>
					  </el-select>
					</td>
				</tr>
				<tr>
					<td class="_tit">驾驶证</td>
					<td class="_cont">
						<el-radio-group class="_radio" v-model="data.isHasDriversLicense">
					    <el-radio :label="1">有</el-radio>
					    <el-radio :label="0">无</el-radio>
					  </el-radio-group>
					</td>
					<td class="_tit">邮箱</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="150" v-model="data.email" placeholder="请填写">
					</td>
				</tr>
				<tr>
					<td class="_tit">学历</td>
					<td class="_cont">
						<el-select v-model="data.education" placeholder="请选择">
					    <el-option v-for="item in $$config.baseData.edu" :key="item" :value="item"></el-option>
					  </el-select>
					</td>
					<td class="_tit">家庭住址</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="150" v-model="data.address" placeholder="请填写">
					</td>
				</tr>
			</table>
			<table class="l-table-info l-margin-t">
	  		<caption>紧急联系人</caption>
				<tr>
					<td class="_tit">紧急联系人A</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="150" v-model="data.emergencyAContact" placeholder="请填写">
					</td>
					<td class="_tit">紧急联系人B</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="150" v-model="data.emergencyBContact" placeholder="请填写">
					</td>
				</tr>
				<tr>
					<td class="_tit">与车主关系</td>
					<td class="_cont">
						<el-select v-model="data.emergencyARelationship" placeholder="请选择">
					    <el-option value="家人"></el-option>
					    <el-option value="亲戚"></el-option>
					    <el-option value="朋友"></el-option>
					    <el-option value="同事"></el-option>
					  </el-select>
					</td>
					<td class="_tit">与车主关系</td>
					<td class="_cont">
						<el-select v-model="data.emergencyBRelationship" placeholder="请选择">
					    <el-option value="家人"></el-option>
					    <el-option value="亲戚"></el-option>
					    <el-option value="朋友"></el-option>
					    <el-option value="同事"></el-option>
					  </el-select>
					</td>
				</tr>
				<tr>
					<td class="_tit">联系电话</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="11" v-model="data.emergencyAPhone" placeholder="请填写">
					</td>
					<td class="_tit">联系电话</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="11" v-model="data.emergencyBPhone" placeholder="请填写">
					</td>
				</tr>
			</table>
			<table class="l-table-info l-margin-t">
	  		<caption>工作信息</caption>
				<tr>
					<td class="_tit">单位名称</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="150" v-model="data.workUnit" placeholder="请填写">
					</td>
					<td class="_tit">税后年收入(万元)</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="150" v-model="data.annualIncomeAfterTax" placeholder="请填写">
					</td>
				</tr>
				<tr>
					<td class="_tit">工作地点</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="150" v-model="data.workingPlace" placeholder="请填写">
					</td>
					<td class="_tit">入职时间</td>
					<td class="_cont">
						<el-date-picker style="width: auto;" type="date" value-format="yyyy-MM-dd" :editable="false" v-model="data.entryTime"></el-date-picker>
					</td>
				</tr>
				<tr>
					<td class="_tit">公司职位</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="150" v-model="data.position" placeholder="请填写">
					</td>
					<td class="_tit">公司电话</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="12" v-model="data.companyTelephone" placeholder="请填写">
					</td>
				</tr>
			</table>
		</div>
		<div class="l-text-right l-margin-t">
			<el-button type="primary" :loading="loading" @click="submit">{{loading ? '保存中...' : '保存修改'}}</el-button>
		</div>
	</div>
</template>
<script>
export default {
	name: 'customer-info',
	props: {
		data: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		return {
			loading: false
		}
	},
	methods: {
		submit() {
			this.loading = true
			this.$$api.customer.saveUserInfo(this.data).then(_ => {
				this.$message.success('保存个人资料成功')
			}).finally(_ => {
				this.loading = false
			})
		}
	}
}
</script>