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

//  分類
app.get('/classification',(req, res) => {
  const c = req.query.condition?req.query.condition: null
  const request = https.get({
    hostname: 'shop240461004.taobao.com',
    path: `/i/asynSearch.htm?_ksTS=1545143316765_150&callback=jsonp151&mid=w-17579319719-0&wid=17579319719&path=/search.htm&search=y&spm=a1z10.1-c.w5002-17579319697.1.1f0c9adccRPvwC&pv=${c?c: ''}`,
    headers: {
      referer: 'https://shop240461004.taobao.com/search.htm?spm=a1z10.1-c.w5002-17579319697.1.1f0c9adccRPvwC&search=y',
      cookie: 't=11dcae029c6e5d70a66531ba79374385; thw=cn; cna=j+kTFP3rXRkCAW8qpnsWydZh; miid=176923261510481232; tg=0; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; hng=CN%7Czh-CN%7CCNY%7C156; enc=oJXtGu%2BZwEKi%2FqNmxAyGWCyrT67YnZ2uY1lh9IwgApJ7ya9pNQMsK7rLT0wxEK2zRGfziDA1cyOpuT00QzcMwQ%3D%3D; _m_h5_tk=a13f5d212ae44bc95824991d0fd04802_1545148862004; _m_h5_tk_enc=3a078e4275246e33a17045b42e4ec2d1; _cc_=Vq8l%2BKCLiw%3D%3D; cookie2=13ba379f3caf9484e7d0a770c23f8f24; _tb_token_=75ae4e7b67539; mt=ci=0_0; v=0; pnm_cku822=098%23E1hvipvUvbpvUpCkvvvvvjiPR25O0jlEPLzwtjD2PmPWzjDURF5vsjDEP2S9tjDCRFyCvvpvvvvv2QhvCvvvvvvEvpCWmmjlvvahSXVxCLIZEcqwa4oQ%2Bul1bPLOlEkAdcUS%2BExrA8TJEcqWa4AxdX9aWXxrgj7J%2B3%2BiafmxfBeKNB3rgj7Q%2BulgENoxfwkKHuyCvv9vvUmsIhc0LUyCvvOUvvVvayTtvpvIvvvvvhCvvP9vvUUWphvhwvvv9krvpvQvvvmm2hCv2vvvvUUWphvWvvhCvvOvUvvvphm5vpvhvvmv99%3D%3D; l=aBt61IUZyHrlCyEB9MailX_sg707y85zDl7O1MamwTEhNPeHzDjmgjno-VwW2_qC5Jcy_K-5v; isg=BJKSSHqnGg0HeGHBJqj-JNWi41i0C5ZUDbyABVzrvsUwbzJpRDPmTZiJ24t2G'
    }
  })
  request.on('response',(incommingMsg) => {
    const buffers = []
    incommingMsg.on('data', (chunk) => {
      buffers.push(chunk)
    })
    incommingMsg.on('end', () => {
      // const Console = new console.Console(fs.createWriteStream(path.join(__dirname,'./classification.html')))
      // Console.log(`<div class="container">${decodeURIComponent(iconv.decode(Buffer.concat(buffers),'gb2312')
      //   .match(/<[a-z].*[a-z]>/)[0]
      //   .replace(/\\/g,''))}</div>`)
      const $ = cheerio.load(`<div class="container">${decodeURIComponent(iconv.decode(Buffer.concat(buffers),'gb2312')
        .match(/<[a-z].*[a-z]>/)[0]
        .replace(/\\/g,''))}</div>`)
      const obj = {}
      const condition  = []
      const shoeSize = Array.from($('.container th:contains("鞋码")').next().find('a')).map(item => {
        return {
          href: $(item).attr('href').match(/(?<=pv=).*/)[0],
          title: $(item).text()
        }
      })
      // console.log(Array.from($('.container th:contains("鞋码")').next().find('a')).map(item => $(item).text()))
      if(shoeSize.length != 0)
        condition.push({title: '鞋码', data: shoeSize})
      const size = Array.from($('.container th:contains("尺码")').next().find('a')).map(item => {
        return {
          href: $(item).attr('href').match(/(?<=pv=).*/)[0],
          title: $(item).text()
        }
      })
      // console.log(Array.from($('.container th:contains("尺码")').next().find('a')).map(item => $(item).text()))
      if(size.length != 0)
        condition.push({title: '尺码',data: size})
      const func = Array.from($('.container th:contains("功能")').next().find('a')).map(item => {
        return {
          href: $(item).attr('href').match(/(?<=pv=).*/)[0],
          title: $(item).text()
        }
      })
      // console.log(Array.from($('.container th:contains("功能")').next().find('a')).map(item => $(item).text()))
      if(func.length != 0)
        condition.push({title: '功能', data: func})
      const location = Array.from($('.container th:contains("适用场地")').next().find('a')).map(item => {
        return {
          href: $(item).attr('href').match(/(?<=pv=).*/)[0],
          title: $(item).text()
        }
      })
      // console.log(Array.from($('.container th:contains("适用场地")').next().find('a')).map(item => $(item).text()))
      if(location.length != 0)
        condition.push({title: '适用场地', data: location})
      const isFake = Array.from($('.container th:contains("是否瑕疵")').next().find('a')).map(item => {
        return {
          href: $(item).attr('href').match(/(?<=pv=).*/)[0],
          title: $(item).text()
        }
      })
      // console.log(Array.from($('.container th:contains("是否瑕疵")').next().find('a')).map(item => $(item).text()))
      if(isFake.length != 0)
        condition.push({title: '是否瑕疵', data: isFake})


      obj.conditions = condition
      //搜索結果
      obj.searchResult = $('.container .search-result').text()
      console.log($('.container .search-result').text())
      //寶貝列表
      obj.shoes = Array.from($('.container .item3line1>.item')).map(item => {
        const id = $(item).attr('data-id')
        const href = $(item).find('.photo>.J_TGoldData').attr('href')
        const imgUrl = $(item).find('.photo img').attr('src')
        const title = $(item).find('.detail>.J_TGoldData').text()
        const totalSale = $(item).find('.detail .sale-area>.sale-num').text()
        const price = $(item).find('.detail .cprice-area>.c-price').text()
        return {
          id,
          href,
          imgUrl,
          title,
          totalSale,
          price
        }
      })
      console.log(obj)
      res.json(obj).end()
      // console.log(Array.from($('.container .item3line1>.item')).map(item => {
      //   const id = $(item).attr('data-id')
      //   const href = $(item).find('.photo>.J_TGoldData').attr('href')
      //   const imgUrl = $(item).find('.photo img').attr('src')
      //   const title = $(item).find('.detail>.J_TGoldData').text()
      //   const totalSale = $(item).find('.detail .sale-area>.sale-num').text()
      //   const price = $(item).find('.detail .cprice-area>.c-price').text()
      //   return {
      //     id,
      //     href,
      //     imgUrl,
      //     title,
      //     totalSale,
      //     price
      //   }
      // }))
    })
  })

})

app.listen(80,'localhost',()=> {
  console.log('listening 80 port...')
})



