const express = require('express')
const app = express()
const https = require('https')
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.get('/test', (req,res)=> {
  res.end('test')
})

app.post('/session',(req,res)=> {
  console.log(req.body)
  const options = {
    hostname: 'api.weixin.qq.com',
    path: `/sns/jscode2session?appid=wx873ea751d7d5f632&secret=99032e44132060711fb6de8dfa59f294&js_code=${req.body.code}&grant_type=authorization_code`,

  }
  https.get(options,(response)=> {
    console.log(`response code: ${res.statusCode}`)
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      console.log(`响应主体: ${chunk}`);
    });
    response.on('end', () => {
      console.log('响应中已无数据');
    });
    res.end()
  })
})
app.listen(80,'localhost',()=> {
  console.log('listening 80 port...')
})
