/**
  *
  *运行前：请先填写Appid、APIKey以及图片的路径
  *
  *印刷文字多语种识别WebAPI接口调用示例接口文档(必看)：https://www.xfyun.cn/doc/words/printed-word-recognition/API.html
  *图片属性：尺寸1024×768，图像质量75以上，位深度24最短边最小不低于20像素，最大不超过4096像素，格式jpg/jpeg
  *(Very Important)创建完webapi应用添加服务之后一定要设置ip白名单，找到控制台--我的应用--设置ip白名单，如何设置参考：http://bbs.xfyun.cn/forum.php?mod=viewthread&tid=41891
  *错误码链接：https://www.xfyun.cn/document/error-code (code返回错误码时必看)
  @author iflytek
 */
const CryptoJS = require('crypto-js')
var request = require('request')
var log = require('log4node')
var fs = require('fs')

// 系统配置
const config = {
  // 印刷文字多语种 webapi接口地址
  hostUrl: "https://webapi.xfyun.cn/v1/service/v1/ocr/recognize_document",
  host: "webapi.xfyun.cn",
  //在控制台-我的应用-印刷文字识别多语种获取
  appid: "5f0c296c",
  // 接口密钥(webapi类型应用开通印刷文字识别多语种服务后，控制台--我的应用---印刷文字识别多语种---服务的apikey)
  apiKey: "31cb1e5568b3a0fc644b775322f574bb",
  uri: "/v1/recognize_document",
  // 本地上传图片
  file: "./ocr.jpeg"
}

// 获取当前时间戳
let ts = parseInt(new Date().getTime() / 1000)

let options = {
  url: config.hostUrl,
  headers: getReqHeader(),
  form: getPostBody()
}

exports.recognizeDocument = (image) => {
  // console.log('recognizeDocument -> ', options.form);
  return new Promise((resolve, reject) => {
    // 返回识别结果json串
    // getPostBody(image)
    // .then(data => {
      options.form = { image: image}
      request.post(options, (err, resp, body) => {
        if (err) {
          log.error(err)
        }
        let res = JSON.parse(body)
        if (res.code != 0) {
          log.error(`发生错误，错误码：${res.code} 错误原因：${res.desc} sid：${res.sid}`)
          log.error(`请前往https://www.xfyun.cn/document/error-code?code=${res.code}查询解决办法`)
        }
        // 打印当前任务sid，如有问题请提供至技术人员
        log.info(`sid：${res.sid}`)
        log.info('【印刷文字识别（多语种）】' + JSON.stringify(res.data))
        return resolve(res)
      })
    })
  // })

}

// 组装业务参数
function getXParamStr() {
  let xParam = {
    engine_type: 'recognize_document'
  }
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(xParam)))
}

// 组装请求头
function getReqHeader() {
  let xParamStr = getXParamStr()
  let xCheckSum = CryptoJS.MD5(config.apiKey + ts + xParamStr).toString()
  return {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'X-Appid': config.appid,
    'X-CurTime': ts + "",
    'X-Param': xParamStr,
    'X-CheckSum': xCheckSum
  }
}

// 组装postBody
function getPostBody() {
  let buffer = fs.readFileSync(config.file)
  // let buffer = fs.readFileSync(image)
  return {
    image: buffer.toString('base64'),
  }
  // return new Promise((resolve, reject) => {
  //   fetch(imageUrl)
  //       .then(res => res.blob())
  //       .then(blob => {
  //         var reader = new FileReader()
  //         reader.readAsDataURL(blob)
  //         reader.onloadend = function() {
  //           // var base64data = reader.result.toString('base64')
  //           var base64data = reader.result.replace('data:image/jpeg;base64,', '')
  //           resolve({
  //             image: base64data,
  //           })
  //         }
  //       })
  // })

}

// exports { recognizeDocument};
// export default recognizeDocument
