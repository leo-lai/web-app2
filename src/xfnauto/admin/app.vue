<template>
	<transition name="fade" mode="out-in">
		<!-- <keep-alive> -->
			<router-view></router-view>
		<!-- </keep-alive> -->
	</transition>
</template>

<script>
export default {
	name: 'admin',
	data() {
		return {
			
		}
	},
	mounted() {

	}
}

</script>
<style lang="less">
@import 'element-ui/lib/theme-chalk/index.css';
@import 'nprogress/nprogress.css';
@import 'quill/dist/quill.core.css';
@import 'quill/dist/quill.snow.css';
@import 'quill/dist/quill.bubble.css';
@import '~assets/css/base.less';
@import './assets/elementui.less';
.quill-editor:not(.bubble) .ql-container, .quill-editor:not(.bubble) .ql-container .ql-editor{
	  height: 10rem; padding-bottom: 1rem;
}
</style>