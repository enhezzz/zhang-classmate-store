<template>
  <div class="about">
    <div class="seller">
      <div class="seller-name">店铺：张同学 专注正品</div>
      <div class="seller-name">掌柜：在巴黎街道上许你一世容颜</div>
    </div>
    <div class="store">
      <div class="cert"></div>
      <div class="desc">
        <div>开店时间</div>
        <div>2017-01-23</div>
      </div>
    </div>
    <div class="contact">
      <div class="tag" @click="toTip"></div>
      <!--<img class="arCode" src="/static/assets/zhang.png"/>-->
    </div>
    <van-toast id="van-toast" />
    <!--<div class="radio">-->
      <!--店铺动态评分与同行业相比-->
      <!--描述相符4.8  高于8.94%-->
      <!--服务态度4.9  高于40.36%-->
      <!--物流服务4.8  高于32.51%-->
    <!--</div>-->


    <!--该店铺已签署消费者保障协议  //img.alicdn.com/tps/TB1QVvGKXXXXXcZXpXXXXXXXXXX-1500-130.png-->
    <!--已缴纳5000 元保证金       background-position: -1081px -23px;-->

    <!--该店铺中实物商品交易-->
    <!--由保险公司保障交易钱款安全  //img.alicdn.com/tps/TB1QVvGKXXXXXcZXpXXXXXXXXXX-1500-130.png      width: 24px;-->
    <!--height: 24px;  background-position: -290px -21px;-->

    <!--上升arrow  //gtms01.alicdn.com/tps/i1/T10UoUFmdeXXXZNWvV-828-130.png   height: 14px;-->
    <!--width: 9px;   background-position: -796px -53px;-->

    <!--和我联系  //img.alicdn.com/tps/i4/T1Rsz7FPJaXXbZhKn7-520-240.gif-->
  </div>
</template>
<script>
  import Toast from '../../../static/vant/toast/toast.js';
  export default {
    methods: {
      toTip() {
        console.log(1)
        wx.previewImage({
                 // current: src, // 当前显示图片的http链接
                 urls: ['https://enhezzz.com/assets/img/zhang.png'] // 需要预览的图片http链接列表
            })
      }
    }
  }
</script>
<style scoped>
  .about {
    min-height:100vh;
    background:url(https://enhezzz.com/assets/img/love.jpg) 100% 100% no-repeat; background-size:100% 100%;
  }
  .seller>.seller-name {
    text-align: center;
  }

  .store {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .store>.cert {
    display: inline-block;
    width: 54px;
    height: 38px;
    float: left;
    margin-right: 8px;
    _margin-right: 4px;
    background: url(https://enhezzz.com/assets/img/cert.png) no-repeat;
  }
  .store>.desc {
    display: inline-block;
  }
  .contact {
    width: 100px;
    height: 30px;
    margin: 0 auto;
    position: relative;
  }
  .contact>.tag {
    width: 100%;
    height: 100%;
    background: url(https://enhezzz.com/assets/img/contact.jpg) no-repeat;
  }
  .contact>.arCode {
    position: absolute;
    left: 100%;
    width: 30px;
    height: 30px;
  }
</style>
