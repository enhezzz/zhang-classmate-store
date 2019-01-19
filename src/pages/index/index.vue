<template>
  <div>
    <swiper indicator-dots autoplay>
      <block v-for="(url,index) in imgsUrl" :key="index">
      <swiper-item>
        <image :src="'/static/assets/'+url" class="slide-image" />
      </swiper-item>
      </block>
    </swiper>
    <van-card
      lazy-load="true"
      :price="prod.price"
      desc="点击查看详细信息"
      :title="prod.title"
      :thumb="'https:'+prod.imgUrl"
      v-for="(prod,index) in prods"
      :key="prod.id"
      :thumb-link="'/pages/prodDetail/main?id='+prod.id"
    />
    <!--<van-loading color="#fff" v-if="loading" class="loading" size="50px"/>-->
  </div>
</template>

<script>
// import card from '@/components/card'
import request from '../../request'
export default {
  data () {
    return {
      motto: 'Hello World',
      userInfo: {},
      prods: [],
      imgsUrl: [
        '2.jpg',
        '3.jpg',
        '4.jpg',
        '5.jpg',
        '6.jpg',
        '7.jpg',
        '8.jpg'
      ],
      loading: true
    }
  },
  created () {
    wx.showLoading({
      title: '我来啦！~',
    })
    wx.setBackgroundColor({
      backgroundColorTop: '#ffffff', // 顶部窗口的背景色为白色
      backgroundColorBottom: '#5588dd', // 底部窗口的背景色为白色
    })
    wx.request({
      url: `${request.domain}/init`,
      success: (res) => {
        console.log(res)
        console.log(this)
        this.loading = false
        wx.hideLoading()
        this.prods.push(...res.data)
      }
    })
  },
  onPullDownRefresh () {
    console.log('pulldown..')
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
  image {
    width: 100%;
    height: 100%;
  }
  .loading {
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 1000;
    transform: translate3d(-50%,-50%,0);
    background: rgba(160,66,66,.6);
  }
</style>
