<template>
  <div class="container">
    <h3 class="shoe-name">{{title}}</h3>
    <div id="nocaptcha"></div>
    <div class="gallery">
      <div class="big-img">
        <image :src="'https:'+mainUrl"></image>
      </div>
      <div class="small-img">
        <div :class="{selected: img.selected}" class="item btn" v-for="img in imgUrls" :key="img.index"
         >
          <image :src="'https:'+img.url" @click="selectImg" :data-index="img.index" :data-url="img.url"></image>
        </div>
      </div>
    </div>
    <div class="prod-deteil">
      <div class="item price">
        <span class="title">价格</span>
        <span class="desc price-rmb">¥{{price}}</span>
        <!--<div class="transaction">-->
          <!--<div class="confirmGoodsCount">-->
            <!--<div>-->
              <!--<span>确认</span>-->
            <!--</div>-->
            <!--<div>-->
              <!--<span>{{soldQuantity.confirmGoodsCount}}</span>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="soldTotalCount">-->
            <!--<div>-->
              <!--<span>总售</span>-->
            <!--</div>-->
            <!--<div>-->
              <!--<span>{{soldQuantity.soldTotalCount}}</span>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      </div>
      <div class="item discount">
        <span class="title discount-title">优惠</span>
        <div class="desc discount-desc">
          <div class="discount-desc-activity" v-for="coupon in couponActivity" :key="coupon.activityId">
            <image :src="'https:'+coupon.icon[0]"></image>
            <span>{{coupon.title}}</span>
          </div>
          <div class="discount-desc-activity"></div>
        </div>
      </div>
      <div class="item shoe-size">
        <span class="title shoe-size-title">鞋码</span>
        <div class="desc shoe-size-desc">
          <span @click="selectSize" :class="{selected: shoe.selected}" class="btn size" v-for="shoe in property"
             :key="shoe.code" :data-price="shoe.prices" :data-code="shoe.code" :data-stock="shoe.stock">
            {{shoe.size}}
          </span>
        </div>
      </div>
      <div class="item color">
        <span class="title color-title">颜色</span>
        <div class="desc color-desc">
          <span :class="{selected: item.selected}" class="btn color" v-for="item in colors" :key="index"
                :data-index="item.index" @click="selectColor">
            {{item.color}}
          </span>
        </div>
      </div>
      <div class="item stock">
        <span class="title">数量</span>
        <div class="desc stock-desc">
          <!--<van-stepper :value="buyNumber" :change="onChange" />-->
          <span>(库存<span style="color: #f40">{{totalStock}}</span>件)</span>
        </div>
      </div>
      <div class="item commitment">
        <span class="title commitment-title">承诺</span>
        <div class="desc commitment-desc">
          <div class="commitment-desc-item" v-for="(item, index) in tradeContract.service" :key="item.desc">
            <image :src="index==0?item.icons[0]:'https:'+item.icons[0]"></image>
            <span>{{item.title}}</span>
          </div>
        </div>
      </div>
      <div class="item pay">
        <div class="title pay-title">支付</div>
        <div class="desc pay-desc">
          <div class="pay-desc-item" v-for="(item, index) in tradeContract.pay" :key="item.url">
            <image :src="'https:'+item.icons[0]"></image>
            <span>{{item.title}}</span>
          </div>
        </div>
      </div>
      <div class="item tradeInfo">
        <span class="title trandeInfo-title">交易情况</span>
        <div class="desc tradeInfo-desc">
          <div class="teadeInfo-desc-confirmGoodsCount">确认收货：{{soldQuantity.confirmGoodsCount}}</div>
          <div class="teadeInfo-desc-soldTotalCount">售出：{{soldQuantity.soldTotalCount}}</div>
        </div>
      </div>
    </div>
    <!--<van-goods-action>-->
      <!--<van-goods-action-icon-->
        <!--icon="chat"-->
        <!--text="客服"-->
        <!--bind:click="onClickIcon"-->
      <!--/>-->
      <!--<van-goods-action-icon-->
        <!--icon="cart"-->
        <!--text="购物车"-->
        <!--bind:click="onClickIcon"-->
      <!--/>-->
      <!--<van-goods-action-button-->
        <!--text="加入购物车"-->
        <!--type="warning"-->
        <!--bind:click="onClickButton"-->
      <!--/>-->
      <!--<van-goods-action-button-->
        <!--text="立即购买"-->
        <!--bind:click="onClickButton"-->
      <!--/>-->
    <!--</van-goods-action>-->
  </div>
</template>
<script>
import request from '../../request'
export default {
  data () {
    return {
      buyNumber: 1,
      couponActivity: [],
      price: '0',
      property: [],
      qrcodeImgUrl: '',
      soldQuantity: {
        confirmGoodsCount: 0,
        soldTotalCount: 0
      },
      totalStock: 0,
      tradeContract: {
        pay: [],
        service: []
      },
      title: '',
      colors: [],
      imgUrls: [{url: '', index: 0, selected: false}],
      mainUrl: '//enhezzz.com/assets/img/404.jpg'
    }
  },
  computed: {
    // mainImgUrl () {
    //   return this.imgUrls[0].url
    // }
  },
  methods: {
    selectSize (e) {
      this.price = e.target.dataset.price
      this.totalStock = e.target.dataset.stock
      const selectedCode = e.target.dataset.code
      this.property = this.property.map(item => {
        return {...item, selected: selectedCode === item.code}
      })
    },
    selectColor (e) {
      const INDEX = e.target.dataset.index
      this.colors = this.colors.map(color => {
        return {...color, selected: color.index === INDEX}
      })
    },
    selectImg (e) {
      const INDEX = e.target.dataset.index
      this.imgUrls = this.imgUrls.map(img => {
        return {...img, selected: img.index === INDEX}
      })
      this.mainUrl = e.target.dataset.url.replace(/\d+x\d+/, '400x400')
    }
  },
  onLoad () {
    wx.showLoading({
      title: '马不停蹄的加载~',
    })
    wx.request({
      url: `${request.domain}/prodDetail?id=${this.$root.$mp.query.id}`,
      success: (res) => {
        let resCode = res.statusCode;
        if(resCode == 403){
          wx.showLoading({
            title: 'boom~,请联系一下管理员那个家伙',
          })
        }else {
          const data = res.data
          this.couponActivity = data.couponActivity
          this.price = data.price
          //  初始化所有鞋码选择为未选择
          this.property = data.property.map(item => {
            return { ...item, selected: false }
          })
          this.qrcodeImgUrl = data.qrcodeImgUrl
          this.soldQuantity = data.soldQuantity
          this.totalStock = data.totalStock
          this.tradeContract = data.tradeContract
          this.title = data.title
          //  初始化所有颜色选择为未选择
          this.colors = data.colors.map((color, index) => {
            return { color, index, selected: false }
          })
          //  初始化所有缩略图为未选择
          this.imgUrls = data.imgUrls.map((url, index) => {
            return { url, index, selected: false }
          })
          this.mainUrl = data.imgUrls[0].replace(/\d+x\d+/, '400x400')
          wx.hideLoading()
        }
      }
    })
    console.log(this.$root.$mp.query)
  }
}
</script>
<style scoped>
  .gallery image {
  width: 100%;
  }
  .gallery {
    /*height: 250px;*/
  }
  .gallery>.big-img {
    height: 280px;
    margin-bottom: 10px;
  }
  .gallery>.small-img {
    display: flex;
    flex-wrap: wrap;
  }
  .shoe-name {
    padding: 10px 0;
  }
  .gallery>.small-img>.item {
    height:70px;
    width:18%;
    margin:0 1% 5px;
    box-sizing: border-box;
  }
  .gallery>.small-img>.item image {
    width: 100%;
    height: 100%;
  }
  .prod-deteil>.item {
    padding: 10px;
    display: flex;
    font-size: 18px;
  }
  .prod-deteil>.item>.title {
    margin-right: 20px;
    min-width:40px;
  }
  .prod-deteil>.price {
    background: #FFF2E8;
  }
  .prod-deteil>.price>.price-rmb {
    color: #f40;
    font-size: 24px;
  }
  .prod-deteil>.price>.transaction {
    float: right;
    text-align: center;
  }
  .prod-deteil>.price>.transaction>.confirmGoodsCount,
  .prod-deteil>.price>.transaction>.soldTotalCount{
    padding: 0 10px;
    float: left;
  }
  .prod-deteil>.discount {
    background: #FFF9F5
  }
  .prod-deteil>.discount image {
    width: 80px;
    height: 16px;
  }
  .prod-deteil .desc .btn {
    display: inline-block;
    padding: 5px;
    border: 1px solid #c5c5c5;
    margin: 0 5px 5px 0
  }
  .btn.selected {
    color: #f40;
    border: 1px solid #f40;

  }
  .prod-deteil>.commitment image,
  .prod-deteil>.pay image {
    width: 16px;
    height: 16px;
  }
</style>
