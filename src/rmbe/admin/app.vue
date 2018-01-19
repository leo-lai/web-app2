<template>
	<transition name="fade" mode="out-in">
		<router-view></router-view>
	</transition>
</template>

<script>
export default {
	name: 'admin',
	mounted () {
		
	}
}

</script>
<style lang="less">
@import 'element-ui/lib/theme-chalk/index.css';
@import 'nprogress/nprogress.css';
@import '~assets/css/base.less';
@import '../assets/elementui.less';
</style>