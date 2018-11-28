<template>
  <popup class="pay-view" position='bottom' v-model="popupShow" @on-hide="hidePopup">
    <h2 class="title">支付</h2>
    <swiper v-if="couponList.length>0" height="3.9rem" class="coupon-list" :show-dots="false">
      <swiper-item v-for="(item, index) in couponList" :key="index">
        <label>
        <div class="coupon-item">
          <h2>{{item.typeName}}</h2>
          <div class="price">
            <template v-if="item.type=='DISCOUNT'">
              <i>￥</i>
              <span>{{item.discount}}</span>
            </template>
            <img v-else="" src="../../assets/images/coffee-cup.png" style="width:1.65rem;" />
          </div>
          <div class="info">
            <p>截止日期：{{item.endTime}}</p>
            <p>来源：{{item.desc}}</p>
          </div>
        </div>
        <div class="coupon-checked">
        	<span>使用本优惠券</span>
        	<input type="checkbox" :value="item" v-model="couponValue" @change="couponChange"/>
       	</div>
        </label>
      </swiper-item>
    </swiper>
    <p class="tip" v-if="couponList.length>1">左右滑动，更换优惠券</p>
    <div class="pay-detail" v-if="orderList.length>0">
      <p><span class="grey">已选择商品</span><span>{{orderList[0].name}}×1</span></p>
      <p><span class="grey">原价</span><span class="orange">￥{{totalAmount}}</span></p>
      <p v-if="couponList.length>0"><span class="grey">优惠券</span><span class="orange">￥{{couponSub}}</span></p>
      <p v-if="couponList.length>0"><span class="grey">优惠价</span><span class="orange">￥{{payValue}}</span></p>
      <label><span>余额支付</span><input type="radio" value="balance" v-model="payWay"/></label>
      <label><span>微信支付</span><input type="radio"  value="wecat" v-model="payWay"/></label>
    </div>
    <div class="button-group">
      <div class="button default-button" @click="hidePopup">取消</div>
      <div class="button primary-button" @click="pay">确定</div>
    </div>
  </popup>
</template>

<script>
  import { Swiper, SwiperItem, Popup } from 'vux'
  import { ModalHelper } from '../../plugins/utils'
  import db from '../../plugins/db'
  import api from '../../service/api'
  let homeViewHeight = db.get('homeViewHeight')
  let tabbarHeight = db.get('tabbarHeight')
  import login from '../../views/index/mixin/login'
  export default {
    name: 'pay-view',
//  mixins: [login],
    components: {
      Swiper,
      SwiperItem,
      Popup
    },
    props: {
      //显示隐藏
      value: {
        default: true,
        type: Boolean
      },
      orderList: {}
    },
    data() {
      return {
        popupShow: this.value,
        couponList: [],
        payWay: 'balance', //支付方式
        initAmount: 0,
        couponValue: [],
      }
    },
    created() {},
    computed: {
      //总价
      totalAmount() {
        let sum = 0;
        this.orderList.forEach(i => {
          sum += i.normalPrice
        })
        return sum
      },
      //优惠券折扣
      couponSub() {
        if(this.couponValue.length == 0) return 0;
        if(this.couponValue[0].type == 'FREE') {
          return this.orderList[0].normalPrice;
        } else {
          return this.couponValue[0].discount
        }
      },
      //结算价格
      payValue() {
        return this.orderList[0].normalPrice - this.couponSub
      }
    },
    methods: {
      async initCoupon() {
        this.getCouponList();
      },
      couponChange() {
        //console.log(this.couponValue)
        if(this.couponValue.length == 0) return;
        if(this.couponValue.length > 1) this.couponValue.shift();
        if(this.couponValue[0].type == 'DISCOUNT') {
          //        if(this.couponValue[0].discount > )
        }
      },
      hidePopup() {
        this.$emit('input', false); //点击遮罩时传递false关闭
      },
      async getCouponList() {
        let res = await this.$http.get(this, api.couponList, {
          openid: db.get('userInfo').openid,
          appid: api.appid,
          effective: true,
          tip: false
        })
        if(res.success == true) {
          this.couponList = res.result;
        }
      },
      async pay() {
        const _this = this;
        if(!db.get('userInfo')) {
          this.$vux.alert.show({
            title: '提醒',
            content: '请登录',
            onShow() {},
            async onHide() {
              await _this.wecatLogin();
              await _this.getCouponList();
            }
          })
          return;
        }
        let res, productCode = [],
          count = [];
        //产品code
        productCode.push(this.orderList[0].code);
        //数量[1,3]与产品code对应
        count.push(1);
        //优惠券id
        let couponId = this.couponValue[0] ? this.couponValue[0].id : ''
        //余额支付
        if(this.payWay == 'balance') {
          res = await this.$http.post(this, api.preparePay, {
            appid: api.appid,
            openid: db.get('userInfo').openid,
            price: this.payValue,
            desc: '',
            machineCode: this.orderList[0].machineCode,
            productName: this.orderList[0].name,
            productCode: JSON.stringify(productCode),
            count: JSON.stringify(count),
            couponId: couponId,
            payType: 'balance_qr'
          })
          if(res.success) {
            this.$emit('input', false) //关闭付款弹出框
            let payCompleteRes = await this.$http.post(this, api.payComplete, {
              chargeId: res.result.chargeId,
              rId: '', //扫码进入rId,
              success: res.success, //状态,
            })
            if(payCompleteRes.success) this.$vux.toast.text('付款成功')
          } else {
            this.$vux.toast.text(res.message)
          }
          console.log(JSON.stringify(res))
        } else {
          //微信支付
          res = await this.$http.post(this, api.preparePay, {
            appid: api.appid,
            openid: db.get('userInfo').openid,
            price: this.payValue,
            desc: '微信支付',
            machineCode: this.orderList[0].machineCode,
            productName: this.orderList[0].name,
            productCode: JSON.stringify(productCode),
            count: JSON.stringify(count),
            couponId: couponId,
            payType: 'wx_pub_qr'
          })
          //console.log(JSON.stringify(res))
          // 获取支付通道
          plus.payment.getChannels(function(channels) {
            channel = channels[1];
            plus.payment.request(channel, 's', function(result) {
              plus.nativeUI.alert("支付成功！", function() {
                back();
              });
            }, function(error) {
              plus.nativeUI.alert("支付失败：" + error.code);
            });
          }, function(e) {
            alert("获取支付通道失败：" + e.message);
          });
        }
        let channel = null;
        // 1. 获取支付通道
        function plusReady() {
          // 获取支付通道
          plus.payment.getChannels(function(channels) {
            channel = channels[0];
            plus.payment.request(channel, s, function(result) {
              plus.nativeUI.alert("支付成功！", function() {
                back();
              });
            }, function(error) {
              plus.nativeUI.alert("支付失败：" + error.code);
            });
          }, function(e) {
            alert("获取支付通道失败：" + e.message);
          });
        }
        //service = \"mobile.securitypay.pay\"&partner=\"2088801273866834\"&_input_charset=\"UTF-8\"&out_trade_no=\"20181105073818\"&subject=\"DCloud项目捐赠\"&payment_type=\"1\"&seller_id=\"payservice@dcloud.io\"&total_fee=\"10\"&body=\"DCloud致力于打造HTML5最好的移动开发工具，包括终端的Runtime、云端的服务和IDE，同时提供各项配套的开发者服务。\"&it_b_pay=\"1d\"&notify_url=\"http%3A%2F%2Fdemo.dcloud.net.cn%2Fhelloh5%2Fpayment%2Fnotify.php\"&show_url=\"http%3A%2F%2Fdemo.dcloud.net.cn%2Fhelloh5%2Fpayment%2F\"&sign=\"WEnrOSRDWRL2IJt8w%2FLkUqnwjndOead%2BfyUxMWyhUt7j2SinI9GdzxK95byo6cnJ68vQEF50Xp2ltGTjmO3IIaCumUCaUeKhT3NiozXya772Q2uswgKALqtvSy7%2BNJlK4qm3TXbGnzdr3zJ8bS8A3j5gFHy5SxvSRmvw%2BK1yLAw%3D\"&sign_type=\"RSA\""
        //      let ALIPAYSERVER = 'http://demo.dcloud.net.cn/helloh5/payment/alipay.php?total=';
        //      let WXPAYSERVER = 'http://demo.dcloud.net.cn/helloh5/payment/wxpay.php?total=';
        //      //      document.addEventListener('plusready', plusReady, false);
        //      //      if(window.plus){
        //      //      	plusReady();
        //      //      }
        //      // 2. 发起支付请求
        //      function pay(id) {
        //        // 从服务器请求支付订单
        //        let PAYSERVER = '';
        //        if(id == 'alipay') {
        //          PAYSERVER = ALIPAYSERVER;
        //        } else if(id == 'wxpay') {
        //          PAYSERVER = WXPAYSERVER;
        //        } else {
        //          plus.nativeUI.alert("不支持此支付通道！", null, "捐赠");
        //          return;
        //        }
        //        let xhr = new XMLHttpRequest();
        //        xhr.onreadystatechange = function() {
        //          switch(xhr.readyState) {
        //            case 4:
        //              console.log(xhr.responseText)
        //              console.log(JSON.stringify(xhr.responseText))
        //              if(xhr.status == 200) {} else {
        //                alert("获取订单信息失败！");
        //              }
        //              break;
        //            default:
        //              break;
        //          }
        //        }
        //        xhr.open('GET', PAYSERVER);
        //        xhr.send();
        //      }
      }
    },
    watch: {
      value(val) {
        this.popupShow = val;
        if(val) {
          this.initCoupon();
          ModalHelper.afterOpen();
        } else {
          ModalHelper.beforeClose();
          //        this.getCouponList()
          //        if(window.plus) {
          //          let webView = plus.webview.getWebviewById('home')
          //          webView.setStyle({
          //            height: homeViewHeight + 'px',
          //            bottom: tabbarHeight + 'px'
          //          })
          //        }
        }
      },
    }
  }
</script>
<style lang="scss">
  .coupon-list .coupon-item {
    background: url(../../assets/images/im_yhqbg.png) center / cover;
    &.disabled {
      background-image: url(../../assets/images/im_yhqbg2.png);
    }
  }
  
  .pay-view {
    input[type=checkbox],
    input[type=radio] {
      width: .42rem;
      height: .42rem;
      background: url(../../assets/images/ic_chose0.png) center / cover;
      border-radius: 50%;
      &:checked {
        background-image: url(../../assets/images/ic_chose1.png);
      }
    }
  }
</style>