<template>
  <div class="index">
    <tabbar ref="tabbarIndex" :class="{'iphone-x-bottom':isIphoneX}">
      <tabbar-item v-for="(tabbar,index) in tabbarItems" @on-item-click="tabbarItemClick(index)"
                   :selected="currentIndex == index" :show-dot="tabbar.showDot" :key="tabbar.id">
        <img class="tabbar-img" slot="icon" :src="tabbar['icon'+(currentIndex == index?1:0)]"/>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import {
    Tabbar,
    TabbarItem
  } from 'vux'
  import db from '../../plugins/db'
  import api from '../../service/api'
  import login from './mixin/login'
  import iPhoneXSafearea from '../../plugins/mixins/iphoneX-safe-area'

  import baiduLocationPlugin from '../../plugins/baiduLocationPlugin'
  import {consolePlugin, xconsole} from '../../plugins/consolePlugin'

  export default {
    name: 'index',
    mixins: [login, iPhoneXSafearea],
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

      if (window.plus) {
        this.init();
      } else {
        document.addEventListener("plusready", () => {
          this.init();
        }, false);
      }
    },
    methods: {
      init() {
        this.w = plus.nativeUI.showWaiting("加载中...");
        //顶部状态栏背景和主题
        plus.navigator.setStatusBarBackground('#404040');
        plus.navigator.setStatusBarStyle('light');
        let outTime = 0;
        if (plus.os.name === 'Android') outTime = 500; //延迟加载webview, Android系统500ms延迟，iOS不用
        if (plus.os.name === 'iOS') {
          // 安装定位插件
          baiduLocationPlugin();
          // 安装日志插件
          consolePlugin();
          // 获取定位数据
          window.plus.baiduLocation.getCurrentPosition((args) => {
            const p = {};
            p.coords = {};
            p.coords['latitude'] = args.latitude;
            p.coords['longitude'] = args.longitude;
            xconsole.log(JSON.stringify(p))
            db.set('local', p)
            //定位成功之后加载home页面
            setTimeout(() => {
              this.tabbarItems[this.currentIndex].webview = this.createWebview(this.tabbarItems[this.currentIndex]);
              plus.webview.currentWebview().append(this.tabbarItems[this.currentIndex].webview);
              //去掉加载中...
              this.$vux.loading.hide()
            }, outTime);
            this.w.close()
          }, (result) => {
            xconsole.log(result)
            // 需要处理一下错误信息
            plus.nativeUI.confirm("请到设置->隐私->定位服务中开启【快乐咖】定位服务，以便于准确获得你的位置信息", (e) => {
              if (e.index === 1) {
                plus.runtime.openURL("app-settings:")
              }
            }, {
              title: "定位服务已关闭",
              buttons: ['取消', '去设置'],
            }, "确认");
            this.w.close()
          })
        } else {
          // android 定位
          plus.geolocation.getCurrentPosition(p => {
            //        this.latitude = p.coords.latitude; //维度
            //        this.longitude = p.coords.longitude; //经度
            //        this.altitude = p.coords.altitude //海拔
            db.set('local', p)
            //定位成功之后加载home页面
            setTimeout(() => {
              this.tabbarItems[this.currentIndex].webview = this.createWebview(this.tabbarItems[this.currentIndex]);
              plus.webview.currentWebview().append(this.tabbarItems[this.currentIndex].webview);
              //去掉加载中...
              this.w.close()
            }, outTime);
          }, function (e) {
            //('Geolocation error: ' + e.message);
          }, {
            provider: 'baidu',
            coordsType: 'bd09ll'
          });
        }

        //竖屏
        plus.screen.lockOrientation("portrait-primary");
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
              color: '#f7be36'
            }
          },
          bounce: 'vertical',
          height: this.fixHeight() + 'px',
          bottom: plus.os.name === 'iOS' ? null : (this.fixBottom() + 'px'),
          bounceBackground: '#f4f4f4'
        });
      },
      //append的webview的高度（除去tabbar高度）
      fixHeight() {
        let tabbarHeight = this.$refs.tabbarIndex.$el.scrollHeight;
        if (this.currentIndex == 0) db.set('clientHeight', document.documentElement.clientHeight);
        return document.documentElement.clientHeight - tabbarHeight;
      },
      fixBottom() {
        let tabbarHeight = 0;
        tabbarHeight = this.$refs.tabbarIndex.$el.scrollHeight
        if (this.currentIndex == 0) db.set('tabbarHeight', tabbarHeight);
        return tabbarHeight;
      },
      //底部tabbar切换
      async tabbarItemClick(index) {
        if (!window.plus) return; //判断是不是移动设备环境
        //判断是否登录
        if (!db.get('userInfo')) {
          await this.wecatLogin();
          let loginRes = await this.wecatLogin();
          if (loginRes == 201) return;
        }
        //webview没有要创建
        if (!this.tabbarItems[index].webview) {
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
