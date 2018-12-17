const https = require('https')
const fs = require('fs')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const express = require('express')
const app = express()

//首页
app.get('/init',(req,res)=> {
  const request =  https.get('https://shop240461004.taobao.com/index.htm?spm=a1z10.3-c.w5002-17579319697.2.fd4844c9eeakVn')
  const Console = new console.Console(fs.createWriteStream('./log.txt'))
  request.on('response',(imcommingMsg)=> {
    let buffers = [];
    imcommingMsg.on('data',(chunk)=> {
      buffers.push(chunk)
    })
    imcommingMsg.on('end',()=> {
      // Console.log(iconv.decode(Buffer.concat(buffers),'gb2312'))
      const prods = []
      const $ = cheerio.load(iconv.decode(Buffer.concat(buffers),'gb2312'))
      $('body').find('.item3line1>.item').each((i,e)=> {
        // console.log(e)
        const prod = {};
        prod.imgUrl = $(e).find('.item img').attr('data-ks-lazyload');
        prod.title = $(e).find('.item>.detail>.item-name').text();
        prod.price = $(e).find('.item>.detail .c-price').text();
        const href = $(e).find('.item a').attr('href');
        prod.id = href.slice(href.indexOf('=')+1);
        prods.push(prod)
      })
      res.json(prods).end()
    })
  })

})

//商品详情页
app.get('/prodDetail',(req,res)=> {
  console.log(req.query)
  const request =  https.get(`https://item.taobao.com/item.htm?id=${req.query.id}`);
  request.on('response',(imcomingMsg)=> {
    const Console = new console.Console(fs.createWriteStream('./log.html'));
    const buffers = [];
    imcomingMsg.on('data',chunk=> {
      buffers.push(chunk)
    })
    imcomingMsg.on('end',()=> {
      Console.log(iconv.decode(Buffer.concat(buffers),'gb2312'))
      const $ = cheerio.load(iconv.decode(Buffer.concat(buffers),'gb2312'));
      // const product = {}
      //缩略图
      const imgUrls = Array.from($('body').find('.tb-gallery #J_UlThumb img')).map(item=> {
        return $(item).attr('data-src')
      })
      console.log(imgUrls)
      const title = $('body').find('.tb-item-info-r .tb-main-title').text()
      // prod.price = $('body').find('.tb-item-info-r .tb-rmb-num').text()
      //动态设置统计数据
      // prod.stat = {
      //   comment: $('body').find('.tb-meta #J_RateCounter').text(),
      //   transaction: $('body').find('.tb-meta #J_SellCounter').text()
      // }
      //动态设置优惠
      // prod.discount = Array.from($('body').find('.tb-meta .tb-other-discount .tb-coupon'))
      //   .map((i,item)=> {
      //     console.log(i)
      //     console.log(item)
      //   })

      //配送动态设置

      //鞋码信息(包含标识code和鞋码大小)
      let property = {}
      property= Array.from($('body').find('#J_isku .J_TMySizeProp  .J_TSaleProp li'))
        .map((item)=> {
          return {
            code: $(item).attr('data-value'),
            size: $(item).find('span').text()
          }
        })
      //颜色
      const colors = Array.from($('body').find('#J_isku .J_Prop_Color a')).map(item=> {
        return $(item).text()
      })
      //库存动态设置
      //花呗动态设置
      const request = https.get({
        host: 'detailskip.taobao.com',
        path: `/service/getData/1/p1/item/detail/sib.htm?itemId=${req.query.id}&sellerId=3132981987&modules=dynStock,qrcode,viewer,price,duty,xmpPromotion,delivery,activity,fqg,zjys,couponActivity,soldQuantity,originalPrice,tradeContract&callback=onSibRequestSuccess`,
        headers: {
          cookie: 't=11dcae029c6e5d70a66531ba79374385; thw=cn; cna=j+kTFP3rXRkCAW8qpnsWydZh; miid=176923261510481232; tg=0; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; _m_h5_tk=abba1b135272b359388e4b002dd4a4c1_1544628914770; _m_h5_tk_enc=4c3d8551a99a732a4e7030d8ca9a0bbe; hng=CN%7Czh-CN%7CCNY%7C156; enc=oJXtGu%2BZwEKi%2FqNmxAyGWCyrT67YnZ2uY1lh9IwgApJ7ya9pNQMsK7rLT0wxEK2zRGfziDA1cyOpuT00QzcMwQ%3D%3D; ubn=p; ucn=center; cookie2=104e989320cc76bd4eb64f59d2a8f63d; _tb_token_=f81ae13ae45e3; _cc_=VFC%2FuZ9ajQ%3D%3D; whl=-1%260%260%261544848278369; mt=ci=0_0; v=0; x5sec=7b2264657461696c736b69703b32223a2264376133333533613738303938343435613165646466373764623834653634364349337230754146454b4b636e3758376c4e4c6c47773d3d227d; isg=BO_vtH-s73Ju3uzKW19rH-D9fgNVgRxCGPNNzgF8h95kUA9SCWRBBmNJ1gBLKBsu',
          //伪造referer
          referer: 'https://item.taobao.com/item.htm?spm=a1z10.1-c.w4004-17579319714.2.6c0f9adco0hrXy&id=580305580625',
          // 'accept-encoding': 'gzip, deflate, br'
        }
      })
      request.on('response',(incomingMsg)=> {
        const buffers = []
        incomingMsg.on('data', chunk => {
          buffers.push(chunk)
        })
        incomingMsg.on('end', () => {
          const prod = {}
          // console.log(iconv.decode(Buffer.concat(buffers),'gb2312'))
          const loginRes = JSON.parse(iconv.decode(Buffer.concat(buffers), 'gb2312').match(/(?<=\().*(?=\))/)[0])
          // console.log(loginRes)
          if (loginRes.data) {
            const obj = {}
            const prop = {}
            for (let item in loginRes.data.originalPrice) {
              let key = item;
              if (item.indexOf(';') != -1)
                key = item.match(/(?<=;).*?(?=;)/)[0]
              else continue;
              prop[key] = {}
              // console.log(loginRes.data.originalPrice[item])
              prop[key].prices = loginRes.data.originalPrice[item].price
            }
            for (let item in loginRes.data.dynStock.sku) {
              let key = item;
              if (item.indexOf(';') != -1)
                key = item.match(/(?<=;).*?(?=;)/)[0]
              prop[key].stock = loginRes.data.dynStock.sku[item].stock
            }
            obj.prop = prop
            //总库存
            obj.totalStock = loginRes.data.dynStock.stock
            //价格范围
            obj.price = loginRes.data.price
            //二维码
            obj.qrcodeImgUrl = loginRes.data.qrcodeImgUrl
            //交易合约(支付方式和服务)
            obj.tradeContract = loginRes.data.tradeContract
            //优惠活动
            obj.couponActivity = loginRes.data.couponActivity.coupon.couponList
            //销售数量
            obj.soldQuantity = loginRes.data.soldQuantity
            //花呗支付
            // obj.hb = loginRes.data.fqg.skuItemPurchase
            const arr = []
            property.map(item=> {
              if(!obj.prop[item.code]) return;
              arr.push({...item,...(obj.prop[item.code])})
            })
            obj.property = arr
            delete obj.prop
            obj.colors = colors
            obj.imgUrls = imgUrls
            obj.title = title
            console.log(obj)
            res.json(obj).end()
          }
        })
      })

    })
  })
})

app.listen(80,'localhost',()=> {
  console.log('listening 80 port...')
})



