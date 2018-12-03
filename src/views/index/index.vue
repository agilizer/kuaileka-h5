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
      document.showHomeWebview = (res) => {
        const wb = plus.webview.currentWebview();
        wb.remove(this.tabbarItems[2].webview);
        wb.append(this.tabbarItems[0].webview);
        this.currentIndex = 0
      }
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
        //顶部状态栏背景和主题
        plus.navigator.setStatusBarBackground('#404040');
        plus.navigator.setStatusBarStyle('light');
        let outTime = 0;
        if (plus.os.name === 'Android') outTime = 500; //延迟加载webview, Android系统500ms延迟，iOS不用
        setTimeout(() => {
          this.tabbarItems[this.currentIndex].webview = this.createWebview(this.tabbarItems[this.currentIndex]);
          plus.webview.currentWebview().append(this.tabbarItems[this.currentIndex].webview);
        }, outTime);

        //网络请求
        document.addEventListener("netchange", this.onNetChange, false);

        //竖屏
        plus.screen.lockOrientation("portrait-primary");
      },
      // 网络环境发生变化
      onNetChange() {
        const nt = plus.networkinfo.getCurrentType();
        switch (nt) {
          case plus.networkinfo.CONNECTION_ETHERNET:
          case plus.networkinfo.CONNECTION_WIFI:

            break;
          case plus.networkinfo.CONNECTION_CELL2G:
          case plus.networkinfo.CONNECTION_CELL3G:
          case plus.networkinfo.CONNECTION_CELL4G:

            break;
          default:
            break;
        }
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
