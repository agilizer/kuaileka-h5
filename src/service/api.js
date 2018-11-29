export default {
  appid: 'wx633b83ee07bd395a', //小程序appid
  originID: 'gh_09604479aeb7', //小程序原始id
  applacationID: 'wxd3396cbba3418fdc', //微信第三方登录的appid
  applacationSecret: '77cb99013cbc32a56ac38521020c0d76', //微信第三方登录的appsecret
  existMember: '/program/existMember ', //查询用户登录状态及昵称
  addMember: '/program/addMember', //用户注册
  shareCoupon: '/program/shareCoupon', //用户获得优惠券，进入首页，弹框通知
  machineList: '/program/machineList', //咖啡机列表
  productList: '/program/productList', //查询咖啡机产品
  productInfo: '/program/productInfo', //二维码扫描进入
  couponList: '/program/couponList', //优惠券查询
  preparePay: '/program/preparePay', //查询微信支付需参数
  payComplete: '/program/payComplete', //查询支付状态
  makeProduct: '/program/makeProduct', //制作咖啡
  generateDrink: '/program/generateDrink', //生成饮品券
  advertisement: '/program/advertisement', //banner广告图片查询
  memberInfo: '/program/memberInfo', //查询用户的信息
  messageList: '/program/messageList', //消息提示
  saleRecordList: '/program/saleRecordList', //订单查询
  consumeList: '/program/consumeList', //余额明细查询
  recharge: '/program/recharge', //充值获取支付信息
}