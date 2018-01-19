<template>
  <f7-page name="car-men" no-navbar>
    <!-- <f7-navbar title="车小秘" sliding></f7-navbar> -->
    <div class="l-text-center">
      <img src="../images/20180119001.jpg" alt="">
    </div>
    <div class="l-car-men" v-for="(item, index) in menList" :key="item.name">
      <div class="l-flex-hc">
        <img class="l-avatar l-margin-r-m" :src="menImages[index]" alt="">
        <div>
          <h3>{{item.name}}</h3>
          <p class="l-text-gray l-fs-s">{{item.pos || '销售员'}}</p>
        </div>
        <div class="l-rest">
          <span class="_tag">{{item.title}}</span>
        </div>
        <a class="external" style="color:#08b604; text-align:center;font-size: 0.6rem; margin-left: 0.5rem;" @click="copyWeiXin(item.tel)">
          <img width="30" height="30" src="../images/20180119_weixin.jpg" alt="">
          <p style="margin-top: 0.25rem;">添加微信</p>
        </a>
        <a class="external" style="color:#f87338; text-align:center;font-size: 0.6rem; margin-left: 0.5rem;" :href="'tel:' + item.tel">
          <img width="30" height="30" src="../images/20180119_phone.jpg" alt="">
          <p style="margin-top: 0.25rem;">一键拨打</p>
        </a>
      </div>
      <div class="_desc l-border-t l-text-justify">简介：{{item.desc}}</div>
    </div>
  </f7-page>
</template>

<script>
export default {
  name: "car-men",
  data() {
    return {
      menImages: [
        require('../images/20180119002.jpg'),
        require('../images/20180119003.jpg'),
        require('../images/20180119004.jpg'),
        require('../images/20180119005.jpg'),
        require('../images/20180119006.jpg'),
        require('../images/20180119007.jpg')
      ],
      menList: [{
        title: '选车老司机',
        name: '易文开',
        pos: '销售主管',
        tel: '13828029223',
        desc: '从事汽车销售行业超10年，现任淘车网销售主管，精通各品牌车型优劣并有自己独特的见解，选车经验无人能敌！'
      }, {
        title: '汽车百事通',
        name: '罗志平',
        tel: '15819924161',
        desc: '从事汽车销售行业超5年，热爱研究新车资讯，掌握时下最流行的新车趋势，想找最IN最潮的车，就找他！'
      }, {
        title: '挑车细节控',
        name: '欧婷婷',
        pos: '销售主管',
        tel: '15992100650',
        desc: '从事汽车销售行业超5年，为人完美挑剔，擅长根据客户要求挑出最适合客户的车型，比客户的要求还要高！'
      }, {
        title: '汽车小江湖',
        name: '黄文坚',
        tel: '13422789520',
        desc: '从事汽车销售行业超5年，汽车世家出身，从小玩车，江湖百晓生，传闻没有什么汽车的问题是他不会的，大家可以问问看！'
      }, {
        title: '资深车达人',
        name: '梁建斌',
        tel: '13025840255',
        desc: '从事汽车销售行业超5年，常年混迹于各大汽车论坛，对用车选车养车有丰富的知识储备以及实战经验！'
      }, {
        title: '贴心车小秘',
        name: '邓小容',
        tel: '13760518910',
        desc: '从事汽车销售行业超5年，以女性独特的细心服务获得客户大力认可。买车最怕烦，有了她，您绝对可以高枕无忧好车到手！'
      }]
    }
  },
  methods: {
    copyWeiXin(text = '') {
      this.$copyText(text).then(_ => {
        this.$f7.toast('已复制微信号', '<i class="f7-icons">check</i>', { duration: 2000 }).show()
      }, _ => {
        this.$f7.alert('长按复制微信号：' + text)
      })
    }
  },
  mounted() {
    this.$nextTick(_ => {
      this.$$utils.setTitle('车小秘')
    })
  }
};
</script>
<style lang="less" scoped>
.l-car-men {
  background-color: #fff;
  padding: 0.5rem;
  margin: 0.5rem 0;
  ._desc {
    margin-top: 0.5rem;
    padding: 0.5rem 0 0 0.75rem;
    position: relative;
  }
  ._desc::after {
    content: "";
    border-left: 0.15rem solid #f87338;
    height: 0.8rem;
    position: absolute;
    top: 0.65rem;
    left: 0;
    width: 0;
  }
  ._tag {
    background: url(../images/20180119_tag.jpg) no-repeat center center;
    background-size: contain;
    color: #fff;
    padding: 0 1rem;
    font-size: 0.5rem;
    display: inline-block;
    position: relative;
    top: -0.5rem;
  }
}
</style>
