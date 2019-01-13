<template>
  <div class="container">
    <web-view src="http://localhost/verify.html"></web-view>
  </div>
</template>
<script>
export default {

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
  .wv {
    display: none;
  }
</style>
