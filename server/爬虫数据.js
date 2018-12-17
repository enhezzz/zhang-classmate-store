
const https = require('https')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const querystring = require('querystring')
const request = https.get({
  host: 'detailskip.taobao.com',
  path: '/service/getData/1/p1/item/detail/sib.htm?itemId=580305580625&sellerId=3132981987&modules=dynStock,qrcode,viewer,price,duty,xmpPromotion,delivery,activity,fqg,zjys,couponActivity,soldQuantity,originalPrice,tradeContract&callback=onSibRequestSuccess',
  headers: {
    cookie: 't=11dcae029c6e5d70a66531ba79374385; thw=cn; cna=j+kTFP3rXRkCAW8qpnsWydZh; miid=176923261510481232; tg=0; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; _m_h5_tk=abba1b135272b359388e4b002dd4a4c1_1544628914770; _m_h5_tk_enc=4c3d8551a99a732a4e7030d8ca9a0bbe; hng=CN%7Czh-CN%7CCNY%7C156; enc=oJXtGu%2BZwEKi%2FqNmxAyGWCyrT67YnZ2uY1lh9IwgApJ7ya9pNQMsK7rLT0wxEK2zRGfziDA1cyOpuT00QzcMwQ%3D%3D; ubn=p; ucn=center; cookie2=104e989320cc76bd4eb64f59d2a8f63d; _tb_token_=f81ae13ae45e3; _cc_=VFC%2FuZ9ajQ%3D%3D; whl=-1%260%260%261544848278369; mt=ci=0_0; v=0; x5sec=7b2264657461696c736b69703b32223a2264376133333533613738303938343435613165646466373764623834653634364349337230754146454b4b636e3758376c4e4c6c47773d3d227d; isg=BO_vtH-s73Ju3uzKW19rH-D9fgNVgRxCGPNNzgF8h95kUA9SCWRBBmNJ1gBLKBsu',
    //伪造referer
    referer: 'https://item.taobao.com/item.htm?spm=a1z10.1-c.w4004-17579319714.2.6c0f9adco0hrXy&id=580305580625',
    // 'accept-encoding': 'gzip, deflate, br'
  }
})
// request.setHeader('cookie', 't=11dcae029c6e5d70a66531ba79374385; thw=cn; cna=j+kTFP3rXRkCAW8qpnsWydZh; miid=176923261510481232; tg=0; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; tracknick=%5Cu4E1C%5Cu4EAC%5Cu94C1%5Cu5854%5Cu4E0A%5Cu706C%5Cu76DB%5Cu5F00%5Cu7684%5Cu7E41%5Cu534E; lgc=%5Cu4E1C%5Cu4EAC%5Cu94C1%5Cu5854%5Cu4E0A%5Cu706C%5Cu76DB%5Cu5F00%5Cu7684%5Cu7E41%5Cu534E; _m_h5_tk=abba1b135272b359388e4b002dd4a4c1_1544628914770; _m_h5_tk_enc=4c3d8551a99a732a4e7030d8ca9a0bbe; hng=CN%7Czh-CN%7CCNY%7C156; enc=oJXtGu%2BZwEKi%2FqNmxAyGWCyrT67YnZ2uY1lh9IwgApJ7ya9pNQMsK7rLT0wxEK2zRGfziDA1cyOpuT00QzcMwQ%3D%3D; ubn=p; ucn=center; cookie2=104e989320cc76bd4eb64f59d2a8f63d; v=0; _tb_token_=f81ae13ae45e3; unb=1080656774; uc1=cookie16=UtASsssmPlP%2Ff1IHDsDaPRu%2BPw%3D%3D&cookie21=Vq8l%2BKCLiv0Mzbofagu7Fg%3D%3D&cookie15=UIHiLt3xD8xYTw%3D%3D&existShop=false&pas=0&cookie14=UoTYMha%2BliBjFA%3D%3D&tag=8&lng=zh_CN; sg=%E5%8D%8E40; _l_g_=Ug%3D%3D; skt=e874fef6b80ec88f; cookie1=U7hBpRnguVHJUEU0HqMVRG6IsXCzKLKsuTk%2FHeeVj%2F0%3D; csg=0a640d2c; uc3=vt3=F8dByRzOB6%2BybspiR6g%3D&id2=UoH38yvUW7xlZA%3D%3D&nk2=1VbQrie8%2BVxjC8cq1fMT89DcsUAqVQ%3D%3D&lg2=URm48syIIVrSKA%3D%3D; existShop=MTU0NDg0NjI4Mg%3D%3D; _cc_=VFC%2FuZ9ajQ%3D%3D; dnk=%5Cu4E1C%5Cu4EAC%5Cu94C1%5Cu5854%5Cu4E0A%5Cu706C%5Cu76DB%5Cu5F00%5Cu7684%5Cu7E41%5Cu534E; _nk_=%5Cu4E1C%5Cu4EAC%5Cu94C1%5Cu5854%5Cu4E0A%5Cu706C%5Cu76DB%5Cu5F00%5Cu7684%5Cu7E41%5Cu534E; cookie17=UoH38yvUW7xlZA%3D%3D; mt=ci=-1_1&np=; isg=BBgYs4Zy8O_xWdvvqAoE0gOg6UYGFCN_G35aa1ILk9NI7bnX-BMZG16MIWX4fTRj');
request.on('response',(incomingMsg)=> {
  const buffers = []
  incomingMsg.on('data',chunk=> {
    buffers.push(chunk)
  })
  incomingMsg.on('end',()=> {
    const prod = {}
    // console.log(iconv.decode(Buffer.concat(buffers),'gb2312'))
    const loginRes = JSON.parse(iconv.decode(Buffer.concat(buffers),'gb2312').match(/(?<=\().*(?=\))/)[0])
    console.log(loginRes)
    if(loginRes.data){
      const obj = {}
      const prop = {}
      //各鞋码价格
      for(let item in loginRes.data.originalPrice){
        let key = item;
        if(item.indexOf(';')!=-1)
        key = item.match(/(?<=;).*?(?=;)/)[0]
        else continue;
        prop[key] = {}
        // console.log(loginRes.data.originalPrice[item])
        prop[key].prices = loginRes.data.originalPrice[item].price
      }
      //各鞋码库存
      for(let item in loginRes.data.dynStock.sku){
        let key = item;
        if(item.indexOf(';')!=-1)
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
      //花呗支付
      // obj.hb = loginRes.data.fqg.skuItemPurchase
      console.log(obj)

    }


    //过期需要登陆时
    if(loginRes.url&&loginRes.url.indexOf('login') == -1){
      const request = https.get(`https:${loginRes.url}`)
      request.on('response',incomingMsg=> {
        const buffers = []
        incomingMsg.on('data',chunk=> {
          buffers.push(chunk)
        })
        incomingMsg.on('end',()=> {
          const $ =  cheerio.load(iconv.decode(Buffer.concat(buffers),'gb2312'))
          const request = https.get('https://g.alicdn.com/sd/nch5/index.js')
          request.on('response',(incomingMsg)=> {
            const buffers = []
            incomingMsg.on('data',chunk=> {
              buffers.push(chunk)
            })
            incomingMsg.on('end',()=> {
              console.log(iconv.decode(Buffer.concat(buffers),'gb2312'))
            })
          })
        })
      })
    }else if(loginRes.url&&loginRes.url.indexOf('login') != -1){
      console.log(loginRes.url)
      const request = https.get(loginRes.url,(incomingMsg=> {
        const buffers = []
        incomingMsg.on('data',chunk=> {
          buffers.push(chunk)
        })
        incomingMsg.on('end',()=> {
          const $ = cheerio.load(iconv.decode(Buffer.concat(buffers),'gb2312'))
          let KISSY;
          //加载第一个script
          new Promise((resolve,reject)=> {
            console.log($('html').find('script[src*="https://g.alicdn.com/kissy"]').attr('src'))
            https.get($('html').find('script[src*="https://g.alicdn.com/kissy"]').attr('src'),(incomingMsg)=> {
                let str = ''
                incomingMsg.setEncoding('utf8');
                incomingMsg.on('data',chunk=> {
                  str+=chunk
                })
                incomingMsg.on('end',()=> {
                  eval(str)
                  console.log(KISSY)
                  //加载第二个script
                  console.log($('body').find('script[src*="https://g.alicdn.com/tb/login"]').attr('src'))
                  https.get($('body').find('script[src*="https://g.alicdn.com/tb/login"]').attr('src'),(incomingMsg)=> {
                    window = {
                      location: {
                        protocol: 'https',
                        href: $('body').find('script[src*="https://g.alicdn.com/tb/login"]').attr('src'),
                        search: "?t=20130321",
                        host: "g.alicdn.com"
                      }
                    }
                    let str = ''
                    incomingMsg.setEncoding('utf8');
                    incomingMsg.on('data',chunk=> {
                      str+=chunk
                    })
                    incomingMsg.on('end',()=> {
                      eval(str)
                    })
                  })
                  // resolve()
                })
            })
          }).then(()=> {
            //加载第二个script
            // console.log($('body').find('script[src*="https://g.alicdn.com/tb/login"]').attr('src'))
            // https.get($('body').find('script[src*="https://g.alicdn.com/tb/login"]').attr('src'),(incomingMsg)=> {
            //   window = {
            //     location: {
            //       protocol: 'https',
            //       href: $('body').find('script[src*="https://g.alicdn.com/tb/login"]').attr('src')
            //     }
            //   }
            //   let str = ''
            //   incomingMsg.setEncoding('utf8');
            //   incomingMsg.on('data',chunk=> {
            //     str+=chunk
            //   })
            //   incomingMsg.on('end',()=> {
            //     eval(str)
            //   })
            // })
          })

        })
      }))

    //   const hostname = loginRes.url.match(/(?<=\/\/).*?com/)[0];
    //   const path = encodeURI(loginRes.url.match(/(?<=com).*/)[0])
    //   console.log(hostname)
    //   console.log(path)
    //   const request = https.request({
    //     hostname,
    //     path
    //   })
    //   request.on('response',(incomingMsg)=> {
    //     const buffers = []
    //     incomingMsg.on('data',chunk=> {
    //       buffers.push(chunk)
    //     })
    //     incomingMsg.on('end',()=> {
    //       console.log(iconv.decode(Buffer.concat(buffers),'gb2312'))
    //     })
    //   })
    //   request.write(querystring.stringify({
    //     TPL_password: 'hgs996219',
    //     TPL_username: '1159819949@qq.com'
    //   }))
    //   request.end()
    }

  })
})
