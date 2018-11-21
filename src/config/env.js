/**
 * 配置编译环境和线上环境之间的切换
 *
 *
 *
 *
 *
 */

let webviewUrl = 'http://192.168.5.235:8086'

if(process.env.NODE_ENV == 'development') {

} else if(process.env.NODE_ENV == 'production') {
  webviewUrl = "https://www.kuailecoffee.com/"
}

export default {
  webviewUrl
}