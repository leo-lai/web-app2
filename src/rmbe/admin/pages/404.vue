<template>
	<div class="page-404">
		<p>404 page not found</p><br>
		<el-button type="primary" @click="$router.back()">返回上一页</el-button>
		<router-link class="l-margin-l" to="/"><el-button>首页</el-button></router-link>
	</div>
</template>
<style scoped lang="less">
.page-404 {
	padding: 4rem 0;
  font-size: 20px;
  text-align: center;
  color: rgb(192, 204, 218);
}
</style>