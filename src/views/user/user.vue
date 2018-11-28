<template>
  <div class="user">
    <div class="user-content">
      <div class="head-img-con">
        <img :src="userInfo.headimgurl" />
        <h3>{{userInfo.nickname}}</h3>
      </div>
      <div class="menu-tab">
        <div class="item" v-for="i in menuTabGroup" @click="gotoWebview(i)">
          <img class="icon" :src="i.icon" />
          <span>{{i.value}}</span>
        </div>
      </div>
      <div class="menu-list">
        <div class="item" v-for="i in menuListGroup" @click="gotoWebview(i)">
          <div>
            <img class="icon" :src="i.icon" />
            <span>{{i.value}}</span>
          </div>
          <img class="icon" src="../../assets/images/ic_next.png" />
        </div>
      </div>
      <div class="ads">
        <img src="../../assets/images/im_fenxiang0.png" />
      </div>
      <!--<div class="" @click="wecatLogin" style="text-align: center;line-height: 1rem;">
        登录
      </div>-->
    </div>
  </div>
</template>

<script>
  import db from '../../plugins/db'
  export default {
    name: 'home',
    components: {},
    data() {
      return {
        userInfo: {
          headimgurl: 'http://www.znsfagri.com/uploadfile/editor/image/20170626/20170626151136_11631.jpg',
          nickname: 'psdue'
        },
        menuTabGroup: [{
          value: '我的订单',
          icon: require('../../assets/images/ic_wddd.png'),
          path: "userOrder.html",
          webview: null
        }, {
          value: '我的优惠券',
          icon: require('../../assets/images/ic_ye.png'),
          path: "coupon.html",
          webview: null
        }, {
          value: '我的余额',
          icon: require('../../assets/images/ic_wdye.png'),
          path: "balance.html",
          webview: null
        }],
        menuListGroup: [{
          value: '联系客服',
          icon: require('../../assets/images/ic_yjfk.png'),
          webview: null
        }, {
          value: '快乐装备',
          icon: require('../../assets/images/ic_klzb.png'),
          webview: null
        }]
      }
    },
    created() {
      if(db.get('userInfo')) this.userInfo = db.get('userInfo');
    },
    methods: {
      gotoWebview(item) {
        if(window.plus) {
          item.webview = plus.webview.create(item.path, item.id, {
            'popGesture': 'close',
            'backButtonAutoControl': 'close',
            'titleNView': {
              'backgroundColor': '#404040',
              'titleText': item.value,
              'titleColor': '#FFFFFF',
              'titleSize': '18',
              'splitLine': {
                color: '#f4f4f4'
              },
              autoBackButton: true,
              progress: {
                color: '#f7be36'
              }
            }
          });
          plus.webview.show(item.webview, 'slide-in-right');
        }
      },
    }
  }
  //第三方登录返回的services信息
  //      [{
  //        "id": "weixin",
  //        "description": "微信",
  //        "authResult": {
  //          "access_token": "15_GVZZmkJ4quw0RhkcO-vuOkmwACRy0bgxqNQuJcYSyFZ_21wxkOr5-FQL7UwFgaPvjxqvcrY50GhcoAVsAoONnWvqt4MBRwKvZzsIzuWtQew",
  //          "expires_in": 7200,
  //          "refresh_token": "15_qmZ2aYfnuaiWxcjpqOx2KJghchZjBrIvPwwFAM4KWd91_UccndHOhOsRMxHuJ82__gEAfIYpq2qOKCQvyo4YEs5GGQZ_WkO6Pu3j-ZQUEuY",
  //          "openid": "oRrdQt6As2Pt9qfTM0gMy5R0Uivw",
  //          "scope": "snsapi_userinfo",
  //          "unionid": "oU5YytyYhR_n36LulSvB8dnKW8GM"
  //        },
  //        "userInfo": {
  //          "openid": "oRrdQt6As2Pt9qfTM0gMy5R0Uivw",
  //          "nickname": "pluie",
  //          "sex": 1,
  //          "language": "zh_CN",
  //          "city": "成都",
  //          "province": "四川",
  //          "country": "中国",
  //          "headimgurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/rgbaiaDTeNzSI6jUiaRsZSian3ynQnNeSGOdcHTiaMe3WsL7zpfzBkDdRk1wDCRKeZ8esHerwX0siaSmuxmM1D70VuQ/132",
  //          "privilege": [],
  //          "unionid": "oU5YytyYhR_n36LulSvB8dnKW8GM"
  //        }
  //      }, {
  //        "id": "qq",
  //        "description": "QQ",
  //        "authResult": null,
  //        "userInfo": null
  //      }, {
  //        "id": "sinaweibo",
  //        "description": "新浪微博",
  //        "authResult": null,
  //        "userInfo": null
  //      }, {
  //        "id": "xiaomi",
  //        "description": "小米",
  //        "authResult": null,
  //        "userInfo": null
  //      }]
</script>
<style>

</style>