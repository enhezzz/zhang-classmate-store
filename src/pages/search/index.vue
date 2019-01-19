<template>
  <div class="search-container">
    <div class="search-input">
      <input placeholder="输入你要搜索的宝贝..." v-model="name" />
      <!--<van-button round type="danger">圆形按钮</van-button>-->
      <button class="btn" @tap="search" :disabled="searching">
        找一下♪(゜▽゜*)♪
      </button>
    </div>
    <div class="search-result">
      <div class="result">{{search_result}}</div>
      <van-card
        num="2"
        :price="shoe.price"
        desc="点击查看详情"
        :title="shoe.title"
        :thumb="'https:'+shoe.imgUrl"
        v-for="shoe in shoes"
        :key="shoe.id"
        :thumb-link="'/pages/prodDetail/main?id='+shoe.id"
      />
      <van-toast id="van-toast" />
    </div>
  </div>
</template>
<script>
  import Toast from '../../../static/vant/toast/toast.js';
  import $URL from './gbk'
  import {throttle} from 'lodash'
  import request from '../../request'
  export default {
    data() {
      return {
        name: '',
        search_result: '',
        shoes: [],
        searching: false
      }
    },
    methods: {
      search: throttle(function(){
        if(this.searching) return;
        else
          (()=> {
          console.log('搜索中。。。')
          wx.showLoading({
            title: '别着急😘...',
          })
          console.log(this)
          this.searching  = true
            let shoeName = $URL.encode(this.name.trim())
          wx.request({
            url: `${request.domain}/search?keyword=${encodeURIComponent(shoeName)}`,
            success: (res)=> {
              console.log(res)
              console.log(res.data)
              let data = res.data
              this.shoes = data.shoes
              this.search_result =data.search_result
              wx.hideLoading();
              if(data.shoes.length == 0){
                Toast('真不巧，没有找到你要的宝贝哦/(ㄒoㄒ)/~~');
              }
              this.searching  = false
            },
            fail: ()=> {
              wx.hideLoading()
              Toast({message: '好吧，你的颜值太高把我给吓蒙（崩）了,哭唧唧...'})
              this.searching  = false
            }
          })
        })()

      },6000)
    }
  }
</script>
<style scoped>
  /*.search-input {*/
  /*border: 1px solid #c5ac76;*/
  /*border-radius: 50px;*/
  /*margin: 4px 6px;*/
  /*padding: 3px 6px;*/
  /*font-size: 12px;*/
  /*color: #83aac5;*/
  /*}*/
  .search-container {
    overflow: hidden;
    min-height: 100vh;
    background: url(https://enhezzz.com/assets/img/search.gif) 100% 100% no-repeat; background-size:100% 100%;
  }
  .search-input>input {
    border: 1px solid #c5ac76;
    border-radius: 50px;
    margin: 4px 6px;
    padding: 3px 6px;
    font-size: 12px;
    color: #83aac5;
  }
  .search-input>.btn {
    background: #83aac5;
    color: #fff;
    line-height:59px;
    margin:0px 5px;
    border-radius:8px;
    text-align: center;
  }
  .result {
    color: #CC6666;
  }
</style>
