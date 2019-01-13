<template>
  <div class="container classification">
    <!--<div class="classification-theme expanded">-->
      <!--<div class="classification-theme-item">-->
        <!--人气-->
      <!--</div>-->
      <!--<div class="classification-theme-item">-->
        <!--功能-->
      <!--</div>-->
      <!--<div class="classification-theme-item">-->
        <!--适用场地-->
      <!--</div>-->
    <!--</div>-->
    <div class="classification-items">
      <div class="header">
        <div class="title">
          所有宝贝:
          <span class="theme-color ">{{searchResult}}</span>
        </div>
        <van-tag size="large" color="#ffe1e1" text-color="#ad0000"
        v-for="item in selectedItems" :key="item.title">
          <span :data-condition="item.href"  @click="selectedCondition">{{item.title}}</span>
          </van-tag>
        <!--<div class="selected-condition" v-show="selectedItems.length != 0">-->
          <!--<div class="title">已选择:</div>-->
          <!--<div class="items">-->
            <!--&lt;!&ndash;<div class="item" v-for="condition in selectedItems"></div>&ndash;&gt;-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="condition" v-for="(condition, index) in conditions" :key="condition.title">-->
          <!--<div class="title">{{condition.title}}: </div>-->
          <!--<div class="items">-->
            <!--<div class="item" v-for="(item, ind) in condition.data" :key="ind">-->
              <!--<span v-show="ind<more[index].nowVal">{{item}}</span>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="more" @click="toMore(index, conditions.length)">-->
            <!--<span>更多</span>-->
          <!--</div>-->
        <!--</div>-->
        <van-collapse :value="activeName" @change="onChange">
          <van-collapse-item :title="condition.title" :name="index" v-for="(condition, index) in conditions"
                             :key="condition.title">
            <van-tag text-color="#CC6666" plain
                     v-for="(item, ind) in condition.data" :key="ind">
              <span :data-condition="item.href" @click="selectedCondition">
                {{item.title}}
              </span>
            </van-tag>
          </van-collapse-item>
        </van-collapse>
      </div>
      <div class="prods">
        <van-card
          :price="shoe.price"
          desc="点击图片查看详情"
          :title="shoe.title"
          :thumb="shoe.imgUrl"
          :thumb-link="'/pages/prodDetail/main?id='+shoe.id"
          v-for="shoe in shoes"
          :tag="shoe.totalSale"
          :key="shoe.id"
        />
      </div>
    </div>
  </div>
</template>
<script>
// export default {
//   data () {
//     return {
//       conditions: [],
//       searchResult: '',
//       shoes: [],
//       selectedItems: [],
//       more: [],
//       //  折叠面板
//       activeName: []
//     }
//   },
//   methods: {
//     toMore (index, length) {
//       console.log(index, length)
//       if (this.more[index].selected) {
//         this.more[index].selected = false
//         this.more[index].nowVal = 2
//       } else {
//         this.more[index].selected = true
//         this.more[index].nowVal = length
//       }
//     },
//     onChange (event) {
//       this.activeName = event.mp.detail
//     },
//     selectedCondition (e) {
//       console.log(e.target.dataset)
//       wx.request({
//         url: `http://localhost/classification?condition=${e.target.dataset.condition}`,
//         success: (res) => {
//           const data = res.data
//           console.log(data)
//           this.conditions = data.conditions
//           this.searchResult = data.searchResult
//           this.shoes = data.shoes
//           this.selectedItems = data.selectedConditions
//         }
//       })
//     }
//   },
//   created () {
//     wx.request(
//       {
//         url: 'http://localhost/classification',
//         success: (res) => {
//           console.log(res)
//           const data = res.data
//           console.log(data)
//           this.conditions = data.conditions
//           this.searchResult = data.searchResult
//           this.shoes = data.shoes
//           console.log(data.conditions.map(() => {
//             return {
//               // originVal: 2,
//               nowVal: 2,
//               selected: false
//             }
//           }))
//           this.more = data.conditions.map(() => {
//             return {
//               // originVal: 2,
//               nowVal: 2,
//               selected: false
//             }
//           })
//         }
//       }
//     )
//   }
// }
</script>
<style scoped>
  .classification {
    min-height: 100%;
    display: flex;
    font-size: 18px;
  }
  .classification>.classification-theme.expanded {
    width: 20%;
    border-right: 1px solid #c5c5c5;
    /*position: fixed;*/
    /*left: 0;*/
    height: 600px;
    /*min-height: 100%;*/
  }
  .classification>.classification-theme>.classification-theme-item {
    padding: 10%;
    text-align: center;
    border-bottom: 1px solid #c5c5c5;
  }
  .classification>.classification-items {
    /*position:fixed;*/
    width:100%;
  }
  .classification>.classification-items>.header>.title {
    border-bottom: 1px solid #c5c5c5;
  }
  .classification>.classification-items>.header>.selected-condition {
    display: flex;
    border-bottom: 1px solid #c5c5c5;
  }
  .classification>.classification-items>.header>.condition {
    display: flex;
    border-bottom: 1px solid #c5c5c5;
  }
  .classification>.classification-items>.header>.condition>.title,
  .classification>.classification-items>.header>.selected-condition>.title {
    width: 25%;
    text-align: right;
  }
  .classification>.classification-items>.header>.condition>.items,
  .classification>.classification-items>.header>.selected-condition>.items {
    flex: 1;
    display: inline-block;
    /*justify-content: space-between;*/
  }
  .classification>.classification-items>.header>.condition>.more {
    width: 15%;
  }
  .disappear {
    display: none;
  }
</style>
<style>
  .van-tag {
    margin: 4px;
  }
</style>
