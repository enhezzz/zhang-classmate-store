const https = require('https')
const fs = require('fs')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const express = require('express')
const querystring = require('querystring')
const path = require('path')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname)))

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
let x5secdata = '7b2264657461696c736b69703b32223a226365393732353232646432626234643631396131633530363734636236663861434e437235754546454d695a3849626a3664657243773d3d227d',
    originX5secdata = '';
app.get('/prodDetail',(req,res)=> {
  console.log(req.query);
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
          cookie: `thw=cn; cna=O6urFGdMWkcCARuaG+PoAa30; t=06011b4cd422d9cccd7dd759550244e4; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; ubn=p; enc=wSpLbWsGHtjU57FVNd2Ei1OdGuahOItD40zp4xKMS8uMgYSPKZY7%2BBpFbcq1rhjzqq4IbQZVvxZHQ1Mn6JhCYQ%3D%3D; ucn=center; hng=CN%7Czh-CN%7CCNY%7C156; uc3=vt3=F8dByRIqrdPxabW0i70%3D&id2=UUphyu%2BHvM6emtnyjg%3D%3D&nk2=CseRdKpRcw%3D%3D&lg2=V32FPkk%2Fw0dUvg%3D%3D; tracknick=iamhugs; lgc=iamhugs; _cc_=V32FPkk%2Fhw%3D%3D; tg=5; mt=ci=0_1; cookie2=11795a8d66adae82d9fc1af543f68346; v=0; _tb_token_=ba7383544658; miid=339653452096650142; x5sec=${x5secdata}`,
          //伪造referer
          referer: 'https://item.taobao.com/item.htm?spm=a1z10.1-c.w4004-17579319714.8.1daf9adcmperyp&id=571072092607',
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
          console.log(loginRes)
          if(loginRes.url) {  //  需要验证系列...
            console.log('验证系列................................................................')
            let queryPara = querystring.parse(loginRes.url.slice(loginRes.url.indexOf('?')+1))
            console.log(queryPara)
            originX5secdata = queryPara.x5secdata
            const request = https.get('https:'+loginRes.url)
            request.on('response',(incomingMsg)=> {
              const buffers = []
              incomingMsg.on('data', chunk => {
                buffers.push(chunk)
              })
              incomingMsg.on('end', () => {
                console.log(buffers.toString()) //  utf8编码
                let html = buffers.toString()
                let regExp = /function\s+ncinitpc(.|\n|\s)*?(?=callback)/
                let resolvedScript = html.match(regExp)[0]
                console.log(resolvedScript)
                let template = fs.readFileSync(path.join(__dirname, './verify-template.html'), 'utf8')
                console.log(template)
                let reg = /'\{\$script\$\}'/
                let resolvedHtml = template.replace(reg, resolvedScript)
                fs.writeFileSync(path.join(__dirname, './verify.html'), resolvedHtml)
                res.status(403).end()
              })
            })

          }
          // console.log(loginRes)
          else if (loginRes.data) { // 无需验证系列
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

app.post('/verify', (req, res)=> {
  // console.log(req.body);
  let reqBody = req.body
  let queryPara = querystring.stringify({
    nc_token: reqBody.token,
    nc_session_id: reqBody.csessionid,
    nc_sig: reqBody.sig,
    x5secdata: originX5secdata,
    x5step: 100
  })
  let request =  https.get({
    hostname: 'detailskip.taobao.com',
    path: `/service/getData/1/p1/item/detail/sib.htm/_____tmd_____/verify/?${queryPara}`
  })
  request.on('response',(incomingMsg)=> {
    // console.log(incomingMsg.headers)
    let cookies = incomingMsg.headers['set-cookie']
    if(cookies) {
      let x5 = cookies[0].match(/(?<=x5sec=).*?(?=;)/)[0]
      if(x5) {
        x5secdata = x5
        console.log(x5secdata)
        res.status(200).end();
      }
    }
    // const buffers = []
    // incomingMsg.on('data', chunk => {
    //   buffers.push(chunk)
    // })
    // incomingMsg.on('end', () => {
    //   console.log(buffers.toString())
    //   console.log(buffers.toString())
    // })
  })

  //detailskip.taobao.com:443/service/getData/1/p1/item/detail/sib.htm/_____tmd_____/verify/
})

//  分類
// app.get('/classification',(req, res) => {
//   const c = req.query.condition?req.query.condition: null
//   const request = https.get({
//     hostname: 'shop240461004.taobao.com',
//     path: `/i/asynSearch.htm?_ksTS=1545143316765_150&callback=jsonp151&mid=w-17579319719-0&wid=17579319719&path=/search.htm&search=y&spm=a1z10.1-c.w5002-17579319697.1.1f0c9adccRPvwC&pv=${c?c: ''}`,
//     headers: {
//       referer: 'https://shop240461004.taobao.com/search.htm?spm=a1z10.1-c.w5002-17579319697.1.6d839adcSDUtA0&search=y',
//       cookie: 'thw=cn; cna=O6urFGdMWkcCARuaG+PoAa30; t=06011b4cd422d9cccd7dd759550244e4; cookie2=1afd39ee8f3c2233bbbe53abadec833a; _tb_token_=e51715a5e073e; tg=0; swfstore=283030; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; enc=wSpLbWsGHtjU57FVNd2Ei1OdGuahOItD40zp4xKMS8uMgYSPKZY7%2BBpFbcq1rhjzqq4IbQZVvxZHQ1Mn6JhCYQ%3D%3D; hng=CN%7Czh-CN%7CCNY%7C156; v=0; unb=1080656774; sg=%E5%8D%8E40; _l_g_=Ug%3D%3D; skt=79623b09ffaab5ea; cookie1=U7hBpRnguVHJUEU0HqMVRG6IsXCzKLKsuTk%2FHeeVj%2F0%3D; csg=7e01e0e3; uc3=vt3=F8dByRMGB5ZcEqqLO%2Fk%3D&id2=UoH38yvUW7xlZA%3D%3D&nk2=1VbQrie8%2BVxjC8cq1fMT89DcsUAqVQ%3D%3D&lg2=UIHiLt3xD8xYTw%3D%3D; existShop=MTU0NTkyMTY5MA%3D%3D; tracknick=%5Cu4E1C%5Cu4EAC%5Cu94C1%5Cu5854%5Cu4E0A%5Cu706C%5Cu76DB%5Cu5F00%5Cu7684%5Cu7E41%5Cu534E; lgc=%5Cu4E1C%5Cu4EAC%5Cu94C1%5Cu5854%5Cu4E0A%5Cu706C%5Cu76DB%5Cu5F00%5Cu7684%5Cu7E41%5Cu534E; _cc_=UtASsssmfA%3D%3D; dnk=%5Cu4E1C%5Cu4EAC%5Cu94C1%5Cu5854%5Cu4E0A%5Cu706C%5Cu76DB%5Cu5F00%5Cu7684%5Cu7E41%5Cu534E; _nk_=%5Cu4E1C%5Cu4EAC%5Cu94C1%5Cu5854%5Cu4E0A%5Cu706C%5Cu76DB%5Cu5F00%5Cu7684%5Cu7E41%5Cu534E; cookie17=UoH38yvUW7xlZA%3D%3D; mt=ci=45_1; uc1=cookie14=UoTYM8%2FSqQO7rg%3D%3D&lng=zh_CN&cookie16=V32FPkk%2FxXMk5UvIbNtImtMfJQ%3D%3D&existShop=false&cookie21=URm48syIZJfmYzXrEixrAg%3D%3D&cookie15=WqG3DMC9VAQiUQ%3D%3D&pas=0; whl=-1%260%261545921120942%261545922731812; pnm_cku822=098%23E1hvOvvUvbpvUpCkvvvvvjiPR25yAjDRPsqZtjljPmPh6j3Pn2qZ0jibPFS9tjlER4wCvvpvvUmmKphv8vvvvvCvpv2gvvmvwZCvmVIvvUUdphvWvvvv991vpvQvvvmm2hCv2vmivpvUvvmv%2BqmwkYAEvpvVmvvC9jaVmphvLv98wpvjE4oQD76wd56wfXxrA8TKfvDrAjc6RqwiLO2v%2BE7reB69D7z9aB4AVAnlYnjDRbUSoOmxfwAKHkx%2Fsjc6k2JTbZ%2FxAOF65igCvpvVvvpvvhCv2QhvCvvvvvvtvpvhvvvvvv%3D%3D; x5sec=7b2273686f7073797374656d3b32223a223665373433363561636162336531663333306231626665646637626233653366434b33526b2b45464549767538743636334a363947786f4e4d5441344d4459314e6a63334e4473784d513d3d227d; l=aB75_cd0yixpAa9X2Ma4IsGfC707yCfPVubK1MaHsTEhNPeb7RXy1Jto-VwRj_qC5TCy_K-5F; isg=BJqaNR8qkrEoDx4dab8yHMAf60B8Yx7CmKp33qQTWS34FzpRjFubte9p46Mux5Y9'
//     }
//   })
//   request.on('response',(incommingMsg) => {
//     const buffers = []
//     incommingMsg.on('data', (chunk) => {
//       buffers.push(chunk)
//     })
//     incommingMsg.on('end', () => {
//       const Console = new console.Console(fs.createWriteStream(path.join(__dirname,'./classification.html')))
//       // console.log(iconv.decode(Buffer.concat(buffers),'gb2312'))
//       Console.log(`<div class="container">${decodeURIComponent(iconv.decode(Buffer.concat(buffers),'gb2312')
//         .match(/<[a-z].*[a-z]>/)[0]
//         .replace(/\\/g,''))}</div>`)
//       const $ = cheerio.load(`<div class="container">${decodeURIComponent(iconv.decode(Buffer.concat(buffers),'gb2312')
//         .match(/<[a-z].*[a-z]>/)[0]
//         .replace(/\\/g,''))}</div>`)
//       const obj = {}
//       //  已选择条件
//       if($('.selected-attr>a')){
//       const selectedConditions = Array.from($('.selected-attr>a')).map(item=> {
//         return {
//           title: $(item).text(),
//           href:  $(item).attr('href').match(/(?<=pv=).*/)[0]
//         }
//       })
//       obj.selectedConditions = selectedConditions
//     }
//       //条件
//       const condition  = []
//       const shoeSize = Array.from($('.container th:contains("鞋码")').next().find('a')).map(item => {
//         return {
//           href: $(item).attr('href').match(/(?<=pv=).*/)[0],
//           title: $(item).text()
//         }
//       })
//       // console.log(Array.from($('.container th:contains("鞋码")').next().find('a')).map(item => $(item).text()))
//       if(shoeSize.length != 0)
//         condition.push({title: '鞋码', data: shoeSize})
//       const size = Array.from($('.container th:contains("尺码")').next().find('a')).map(item => {
//         return {
//           href: $(item).attr('href').match(/(?<=pv=).*/)[0],
//           title: $(item).text()
//         }
//       })
//       // console.log(Array.from($('.container th:contains("尺码")').next().find('a')).map(item => $(item).text()))
//       if(size.length != 0)
//         condition.push({title: '尺码',data: size})
//       const func = Array.from($('.container th:contains("功能")').next().find('a')).map(item => {
//         return {
//           href: $(item).attr('href').match(/(?<=pv=).*/)[0],
//           title: $(item).text()
//         }
//       })
//       // console.log(Array.from($('.container th:contains("功能")').next().find('a')).map(item => $(item).text()))
//       if(func.length != 0)
//         condition.push({title: '功能', data: func})
//       const location = Array.from($('.container th:contains("适用场地")').next().find('a')).map(item => {
//         return {
//           href: $(item).attr('href').match(/(?<=pv=).*/)[0],
//           title: $(item).text()
//         }
//       })
//       // console.log(Array.from($('.container th:contains("适用场地")').next().find('a')).map(item => $(item).text()))
//       if(location.length != 0)
//         condition.push({title: '适用场地', data: location})
//       const isFake = Array.from($('.container th:contains("是否瑕疵")').next().find('a')).map(item => {
//         return {
//           href: $(item).attr('href').match(/(?<=pv=).*/)[0],
//           title: $(item).text()
//         }
//       })
//       // console.log(Array.from($('.container th:contains("是否瑕疵")').next().find('a')).map(item => $(item).text()))
//       if(isFake.length != 0)
//         condition.push({title: '是否瑕疵', data: isFake})
//
//
//       obj.conditions = condition
//       //搜索結果
//       obj.searchResult = $('.container .search-result').text()
//       console.log($('.container .search-result').text())
//       //寶貝列表
//       obj.shoes = Array.from($('.container .item3line1>.item')).map(item => {
//         const id = $(item).attr('data-id')
//         const href = $(item).find('.photo>.J_TGoldData').attr('href')
//         const imgUrl = $(item).find('.photo img').attr('src')
//         const title = $(item).find('.detail>.J_TGoldData').text()
//         const totalSale = $(item).find('.detail .sale-area>.sale-num').text()
//         const price = $(item).find('.detail .cprice-area>.c-price').text()
//         return {
//           id,
//           href,
//           imgUrl,
//           title,
//           totalSale,
//           price
//         }
//       })
//       console.log(obj)
//       res.json(obj).end()
//       // console.log(Array.from($('.container .item3line1>.item')).map(item => {
//       //   const id = $(item).attr('data-id')
//       //   const href = $(item).find('.photo>.J_TGoldData').attr('href')
//       //   const imgUrl = $(item).find('.photo img').attr('src')
//       //   const title = $(item).find('.detail>.J_TGoldData').text()
//       //   const totalSale = $(item).find('.detail .sale-area>.sale-num').text()
//       //   const price = $(item).find('.detail .cprice-area>.c-price').text()
//       //   return {
//       //     id,
//       //     href,
//       //     imgUrl,
//       //     title,
//       //     totalSale,
//       //     price
//       //   }
//       // }))
//     })
//   })
//
// })


app.get('/search',(req, res)=> {
  const keyword = req.query.keyword.trim()
  console.log(keyword)
  let request =  https.get({
    hostname: 'shop240461004.taobao.com',
    path: `/i/asynSearch.htm?_ksTS=1546868999847_150&callback=jsonp151&mid=w-17579319719-0&wid=17579319719&path=/search.htm&search=y&q=${keyword}&searcy_type=item&s_from=newHeader&source=null&ssid=s5-e&spm=a1z10.1.1996643285.d4916905&initiative_id=shopz_20190107`,
    headers: {
      referer: 'https://shop240461004.taobao.com/search.htm?q=air&searcy_type=item&s_from=newHeader&source=&ssid=s5-e&search=y&spm=a1z10.1.1996643285.d4916905&initiative_id=shopz_20190107',
      cookie: 'thw=cn; cna=O6urFGdMWkcCARuaG+PoAa30; t=06011b4cd422d9cccd7dd759550244e4; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; enc=wSpLbWsGHtjU57FVNd2Ei1OdGuahOItD40zp4xKMS8uMgYSPKZY7%2BBpFbcq1rhjzqq4IbQZVvxZHQ1Mn6JhCYQ%3D%3D; hng=CN%7Czh-CN%7CCNY%7C156; uc3=vt3=F8dByRIqrdPxabW0i70%3D&id2=UUphyu%2BHvM6emtnyjg%3D%3D&nk2=CseRdKpRcw%3D%3D&lg2=V32FPkk%2Fw0dUvg%3D%3D; tracknick=iamhugs; lgc=iamhugs; _cc_=V32FPkk%2Fhw%3D%3D; tg=5; mt=ci=0_1; miid=339653452096650142; cookie2=19cf89249654eb68fc004d4d0c01d5f4; v=0; _tb_token_=e33f083e70dab; swfstore=23355; uc1=cookie14=UoTYMbyVzpC2yQ%3D%3D; pnm_cku822=098%23E1hv99vUvbpvUvCkvvvvvjiPR2SWzji8Rs59ljrCPmPysjiRRLcU0jr8RLMOAjtURphvCvvvvvvPvpvhvv2MMqyCvm9vvvvvphvv%2Fvvv9a3vpvkDvvmm86Cv2vvvvUUWphvWvvvv991vpvQvkphvC99vvOCzBuyCvv9vvUv6CIX5bvyCvhQv7kyvCAMB%2Bb0ySfyzcrVnI4mzD2rO3w0x9C9aWDNBlwethbUfbjc6D76OdeQEfwClYb8raAuQD7zWdigDN%2BCl%2BE7rVC69fc7QD40fvphvC9vhvvCvp8wCvvpvvUmm; l=aB75_cd0yixpAKzK9Ma7iX7zB707y8ZPwXfM1MakrTEhNPeS7RXy1jno-VwWj_qC5Tcy_K-5F; isg=BIWF8SZPdT_x41F8Sqb17dNWlMF_6jm-ixP4v4fqQbzLHqWQT5JJpBPwLAJNXlGM'
    }
  })
  request.on('response',(incommingMsg)=> {
    const buffers = []
    incommingMsg.on('data', (chunk) => {
      buffers.push(chunk)
    })
    incommingMsg.on('end', () => {
      // const Console = new console.Console(fs.createWriteStream(path.join(__dirname, './classification.html')))
      // console.log(iconv.decode(Buffer.concat(buffers),'gb2312'))
      // Console.log(`<div class="container">${decodeURIComponent(iconv.decode(Buffer.concat(buffers), 'gb2312')
      //   .match(/<[a-z].*[a-z]>/)[0]
      //   .replace(/\\/g, ''))}</div>`)

      const $ = cheerio.load(`<div class="container">${decodeURIComponent(iconv.decode(Buffer.concat(buffers), 'gb2312')
        .match(/<[a-z].*[a-z]>/)[0]
        .replace(/\\/g, ''))}</div>`)
      let search_result = $('.search-result').text()
      let shoes = Array.from($('.item3line1>.item')).map(item=> {
        return {
          id: $(item).attr('data-id'),
          imgUrl: $(item).find('.photo img').attr('src'),
          title: $(item).find('.detail a').text(),
          price: $(item).find('.detail>.attribute .c-price').text(),
          sale: $(item).find('.detail>.attribute .sale-num').text()
        }
      })
      let resObj = {
        search_result,
        shoes
      }
      res.json(resObj).end()
    })
  })
})


// app.listen(80,'localhost',()=> {
//   console.log('listening 80 port...')
// })


var options = {
  key: fs.readFileSync('1711660_www.enhezzz.com.key'),
  cert: fs.readFileSync('1711660_www.enhezzz.com.pem')
};


var a = https.createServer(options, app).listen(443);


