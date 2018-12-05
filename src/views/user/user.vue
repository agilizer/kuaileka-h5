<template>
  <div class="user">
    <div class="user-content">
      <div class="head-img-con">
        <img :src="userInfo.headimgurl" />
        <h3>{{userInfo.nickname}}</h3>
      </div>
      <div class="menu-tab">
        <div class="item" v-for="i in menuTabGroup" :key="i.id" @click="gotoWebview(i)">
          <img class="icon" :src="i.icon" />
          <span>{{i.value}}</span>
        </div>
      </div>
      <div class="menu-list">
        <div class="item" v-for="i in menuListGroup" :key="i.id" @click="gotoWebview(i)">
          <div>
            <img class="icon" :src="i.icon" />
            <span>{{i.value}}</span>
          </div>
          <img class="icon" src="../../assets/images/ic_next.png" />
        </div>
      </div>
      <div class="ads" @click="share">
        <img src="../../assets/images/im_fenxiang0.png" />
      </div>
      <!--<div class="" @click="wecatLogin" style="text-align: center;line-height: 1rem;">登录</div>-->
    </div>
  </div>
</template>

<script>
  import db from '../../plugins/db'
  import api from '../../service/api'
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
          webview: null,
          id: 'userOrder',
        }, {
          value: '我的优惠券',
          icon: require('../../assets/images/ic_ye.png'),
          path: "coupon.html",
          webview: null,
          id: 'coupon',
        }, {
          value: '我的余额',
          icon: require('../../assets/images/ic_wdye.png'),
          path: "balance.html",
          webview: null,
          id: 'balance',
        }],
        menuListGroup: [{
            value: '联系客服',
            icon: require('../../assets/images/ic_yjfk.png'),
            path: "userContact.html",
            webview: null,
            id: 'userContact',
          },
          //      {
          //        value: '快乐装备',
          //        icon: require('../../assets/images/ic_klzb.png'),
          //        webview: null
          //      }
        ]
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
              //            'splitLine': {
              //              color: '#f4f4f4'
              //            },
              autoBackButton: true,
              progress: {
                color: '#f7be36'
              }
            }
          });
          plus.webview.show(item.webview, 'slide-in-right');
        }
      },
      share() {
        if(window.plus) {
          // 扩展API加载完毕，现在可以正常调用扩展API
          let sweixin;
          plus.share.getServices(function(services) {
            services.forEach(i => {
              console.log(JSON.stringify(i))
              if(i.id == 'weixin') sweixin = i;
            });
            let msg = {
              type: 'miniProgram',
              title: '分享小程序标题',
              thumbs: ['http://thirdwx.qlogo.cn/mmopen/vi_32/rgbaiaDTeNzSI6jUiaRsZSian3ynQnNeSGOdcHTiaMe3WsL7zpfzBkDdRk1wDCRKeZ8esHerwX0siaSmuxmM1D70VuQ/132']
            };
            msg.content = '分享小程序描述内容。';
            msg.miniProgram = {
              id: 'gh_09604479aeb7', // 小程序的原始标识
              webUrl: 'http://www.dcloud.io/'
            };
            // 发送分享
            if(sweixin.authenticated) {
              doShare(sweixin, msg);
            } else {
              sweixin.authorize(function() {
                doShare(sweixin, msg);
              }, function(e) {
                console.log('认证授权失败：' + JSON.stringify(e));
              });
            }
          }, function(e) {
            alert("获取分享服务列表失败：" + e.message + " - " + e.code);
          });

          function doShare(srv, msg) {
            srv.send(msg, function() {
              console.log('分享到"' + srv.description + '"成功！');
            }, function(e) {
              console.log('分享到"' + srv.description + '"失败: ' + JSON.stringify(e));
            });
          }
        }
        //      "web"-分享网页类型，title（必填）、content（必填）、thumbs（必填）、href（网页url，必填）属性值有效；
        //      "text"-分享文字类型，content（必填）属性值有效； "image"-分享图片类型，pictures（必填）属性值有效；
        //      "music"-分享音乐类型，title（必填）、content（必填）、thumbs（必填）、media（音乐url，必填）属性值有效；
        //      "video"-分享视频类型，title（必填）、content（必填）、thumbs（必填）、media（视频url，必填）属性值有效；
        //      "miniProgram"-分享小程序类型（仅支持分享到好友），title（必填）、content（必填）、thumbs（图片小于128K，宽高比为5:4，必填）、miniProgram（小程序参数，必填）属性值有效；
        //      没有设置type时，如果href值有效则默认值为"web"，如果pictures有效则默认值为"image"，否则默认值为"text"。
        //      新浪微博分享平台，可取值： "web"-分享网页类型，content、href（网页url，必填），分享链接添加到内容之后；
        //      "text"-分享文字类型，content（必填）属性有效，可在内容中直接插入链接地址；
        //      "image"-分享图片类型，content（可选）、thumbs（可选）、pictures（必填）属性有效；
        //      "video"-分享视频类型，content（可选）、thumbs（可选）、media（本地视频文件，必填）属性有效； 没有设置type时，如果存在thumbs则默认值为"image"，如果存在href则默认值为"web"，否则默认为"text"。
        //      QQ分享平台，可取值： "text"-分享文字类型，href（iOS可选，Android必填）、title（必填，最长30个字符）、content（可选，最长40个字符）、pictures或thumbs（可选，优先pictures，iOS不支持）属性有效；
        //		"image"-分享图片类型，pictures或thumbs（必填，优先pictures）属性有效；
        //      "music"-分享音乐类型，title（必填，最长30个字符）、content（可选，最长40个字符）、href（必填）、media（音乐url，必填）、pictures或thumbs（可选，优先pictures）属性值有效； 没有设置type时，默认值"text"。
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
<style></style>
