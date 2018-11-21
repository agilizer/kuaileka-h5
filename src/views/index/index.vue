<template>
  <div class="index">
    <tabbar ref="tabbarIndex" :class="{'iphone-x-bottom':isIphoneX}">
      <tabbar-item v-for="(tabbar,index) in tabbarItems" @on-item-click="tabbarItemClick(index)" :selected="currentIndex == index" :show-dot="tabbar.showDot" :key="tabbar.id">
        <img class="tabbar-img" slot="icon" :src="tabbar['icon'+(currentIndex == index?1:0)]" />
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import { Tabbar, TabbarItem } from 'vux'
  import envUrl from '../../config/env'
  import db from '../../plugins/db'
  import api from '../../service/api'
  export default {
    name: 'index',
    components: {
      Tabbar,
      TabbarItem,
    },
    data() {
      return {
        payPopup: true,
        tabbarItems: [{
          id: 'home',
          name: '快乐咖',
          icon0: require("../../assets/images/ic_shouye01.png"),
          icon1: require("../../assets/images/ic_shouye02.png"),
          path: "home.html",
          active: false,
          showDot: false,
          webview: null
        }, {
          id: 'message',
          name: '消息',
          icon0: require("../../assets/images/ic_xiaoxi01.png"),
          icon1: require("../../assets/images/ic_xiaoxi02.png"),
          path: "message.html",
          active: false,
          showDot: false,
          webview: null
        }, {
          id: 'user',
          name: '个人中心',
          icon0: require("../../assets/images/ic_wode01.png"),
          icon1: require("../../assets/images/ic_wode02.png"),
          path: "user.html",
          active: false,
          showDot: false,
          webview: null
        }],
        isIphoneX: false,
        currentIndex: 0, //当前选中tabbar
      }
    },
    created() {

      //    this.$http.post(this, api.addMember, {
      //      fromOpenid: '',
      //      appid: api.appid,
      //      openid: 'oRrdQt6As2Pt9qfTM0gMy5R0Uivw',
      //      nickName: 'pluie',
      //      avatarUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/rgbaiaDTeNzSI6jUiaRsZSian3ynQnNeSGOdcHTiaMe3WsL7zpfzBkDdRk1wDCRKeZ8esHerwX0siaSmuxmM1D70VuQ/132',
      //      gender: 1,
      //      province: '四川',
      //      city: '成都',
      //      country: '中国'
      //    }).then(data => {
      //      console.log(data)
      //    })

      //显示加载中...
      this.$vux.loading.show({
        text: 'Loading'
      })
      if(window.plus) {
        //console.log('window')
        this.init();
        this.wecatLogin();
      } else {
        document.addEventListener("plusready", () => {
          //console.log('plusready')
          this.init();
          this.wecatLogin();
        }, false);
      }
      //    this.$http.post(this,api.shareCoupon, {
      //      openid: 'oRrdQt6As2Pt9qfTM0gMy5R0Uivw',
      //      code:'',
      //    }).then(data=>{
      //    	console.log(data)
      //    })
    },
    methods: {
      init() {
        let outTime = 0;
        let u = navigator.userAgent;
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if(isiOS && screen.height == 812 && screen.width == 375) this.isIphoneX = true; //适配iphoneX下方的菜单 
        if(!isIOS) outTime = 500; //延迟加载webview,iOS系统500ms延迟，andoriod不用
        //经纬度定位
        plus.geolocation.getCurrentPosition(p => {
          console.log(JSON.stringify(p))
          //        this.latitude = p.coords.latitude; //维度
          //        this.longitude = p.coords.longitude; //经度
          //        this.altitude = p.coords.altitude //海拔
          db.set('local', p)

          //定位成功之后加载home页面
          setTimeout(() => {
            this.tabbarItems[this.currentIndex].webview = this.createWebview(this.tabbarItems[this.currentIndex]);
            plus.webview.currentWebview().append(this.tabbarItems[this.currentIndex].webview);
            //去掉加载中...
            this.$vux.loading.hide()
          }, outTime);
        }, function(e) {
          //('Geolocation error: ' + e.message);
        }, {
          provider: 'baidu',
          coordsType: 'bd09ll'
        });

        //竖屏
        plus.screen.lockOrientation("portrait-primary");
      },
      //微信登录
      wecatLogin() {
        const _this = this;
        plus.oauth.getServices(function(services) {
          _this.auths = services;
          let s = _this.auths[0];
          if(!s.authResult) {
            s.login(function(e) {
              //("登录认证成功！");
              s.getUserInfo(function(e) {
                _this.userInfo = s.userInfo;
                _this.addMember();
                db.set('userInfo', s.userInfo)
              }, function(e) {
                //("获取用户信息失败：" + e.message + " - " + e.code);
              });
            }, function(e) {
              //("登录认证失败！");
            });
          } else {
            ///("已经登录认证！");
            _this.userInfo = s.userInfo;
            db.set('userInfo', s.userInfo)
            //console.log(JSON.stringify(s.userInfo))
          }
        }, function(e) {
          //("获取分享服务列表失败：" + e.message + " - " + e.code);
        });
      },
      //注册用户到数据库
      async addMember() {
        let res = await this.$http.post(this, api.addMember, {
          fromOpenid: '',
          appid: api.appid,
          openid: this.userInfo.openid,
          nickName: this.userInfo.nickname,
          avatarUrl: this.userInfo.headimgurl,
          gender: this.userInfo.sex,
          province: this.userInfo.province,
          city: this.userInfo.city,
          country: this.userInfo.country
        })
        //      console.log(JSON.stringify(res))
        //      alert(JSON.stringify(res))
      },
      //创建webview
      createWebview(tabbarItem) {
        //初始加载工作台webview
        return plus.webview.create(tabbarItem.path, tabbarItem.id, {
          'popGesture': 'none',
          'titleNView': {
            'backgroundColor': '#404040',
            'titleText': tabbarItem.name,
            'titleColor': '#FFFFFF',
            'titleSize': '18',
            buttons: tabbarItem.buttons,
            autoBackButton: false,
            progress: {
              color: '#ffb64c'
            }
          },
          bounce: 'vertical',
          height: this.fixHeight() + 'px',
          bottom: this.fixBottom() + 'px',
          bounceBackground: '#f4f4f4'
        });
      },
      //append的webview的高度（除去tabbar高度）
      fixHeight() {
        let tabbarHeight = this.$refs.tabbarIndex.$el.scrollHeight;
        if(this.currentIndex == 0) db.set('clientHeight', document.documentElement.clientHeight);
        return document.documentElement.clientHeight - tabbarHeight;
      },
      fixBottom() {
        let tabbarHeight = this.$refs.tabbarIndex.$el.scrollHeight
        if(this.currentIndex == 0) db.set('tabbarHeight', tabbarHeight);
        return tabbarHeight;
      },
      //底部tabbar切换
      tabbarItemClick(index) {
        if(!window.plus) return;
        if(!this.tabbarItems[index].webview) {
          this.tabbarItems[index].webview = this.createWebview(this.tabbarItems[index]);
        }
        const wb = plus.webview.currentWebview();
        wb.remove(this.tabbarItems[this.currentIndex].webview);
        wb.append(this.tabbarItems[index].webview);
        //进入消息页面自动刷新
        //      if(index == 0) {
        //        this.tabbarItems[1].webview.evalJS('document.funcRefresh()');
        //      }
        this.currentIndex = index;
      },
    }
  }
</script>