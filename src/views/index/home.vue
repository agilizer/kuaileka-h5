<template>
  <div class="home">
    <div class="address-container" @click="gotoAddressChoose">
      <div class="address-top">
        {{address.name}}<i class="angle-white-bottom"></i>
      </div>
    </div>
    <swiper v-if='swiperInit' loop dots-position="center" :height="swiperHeight" style="margin-top: -1px"
            class="dots-class">
      <swiper-item class="swiper-banner-img" v-for="(item, index) in bannerList" :key="index">
        <img :src="baseURL+item.src">
      </swiper-item>
    </swiper>
    <div class="announce">
      <div class="cup-acc">
        <img class="cup" src="../../assets/images/coffee-cup.png"/>
        <div class="circle">
          <div class="num">{{cuped}}/{{cupActivityNum}}</div>
          <em :style="{height:cupPercent+'rem',top:1-cupPercent+'rem'}"></em>
        </div>
      </div>
      <p>{{levelName}}： 再次消费{{cupActivityNum - cuped}}次可获得免费优惠券</p>
    </div>
    <div class="container product-container">
      <div class="product-list">
        <product-item v-for=" i in productList" :key="i.code" :item="i" @order="orderCup" @orderSub="orderCupSub"
                      :total="totalCount"></product-item>
      </div>
    </div>
    <div class="goto-buy" v-if="isiOS&&isShowVRNav" @click="goToPosition">
      <span>去这里</span>
    </div>
    <div class="button-buy" @click="showPayView">
      <span>购买</span>
      <i v-if="totalCount">{{totalCount}}</i>
    </div>
    <pay-popup v-model="payPopupShow" :orderList=orderList :couponList=couponList></pay-popup>
  </div>
</template>

<script>
  import {Swiper, SwiperItem} from 'vux'
  import ProductItem from '../../components/common/product-item'
  import payPopup from '../../components/common/pay-popup'
  import db from '../../plugins/db'

  let clientHeight = db.get('clientHeight')
  import api from '../../service/api'
  import login from '../../views/index/mixin/login'

  import baiduMapWalkNaviPlugin from '../../plugins/baiduMapWalkNaviPlugin'
  import baiduLocationPlugin from '../../plugins/baiduLocationPlugin'
  import {consolePlugin, xconsole} from '../../plugins/consolePlugin'

  export default {
    name: 'home',
    mixins: [login],
    components: {
      Swiper,
      SwiperItem,
      ProductItem,
      payPopup
    },
    data() {
      return {
        cupActivityNum: 5,
        cuped: 0,
        levelName: '咖小白',
        baseURL: 'https://www.kuailecoffee.com',
        local: {
          latitude: '39.95896', //纬度
          longitude: '116.48301', //经度
        },
        address: {
          machineCode: ''
        },
        swiperHeight: 'px',
        swiperInit: false,
        bannerList: [],
        productList: [],
        orderList: [],
        totalCount: 0,
        payPopupShow: false,
        isiOS: false,
        couponList: [], //优惠券列表
        isShowVRNav: true,
      }
    },
    created() {
      //监听咖啡机地址变化
      document.addressChange = (res) => {
        this.address = res;
        this.hideVRNav();
      }
      //确定banner的高度
      setTimeout(() => {
        let rem = document.documentElement.style.fontSize.replace('px', '');
        this.swiperHeight = parseInt(2.54 * rem) + 'px';
        this.swiperInit = true;
      }, 500)
      this.init();
      if (window.plus) {
        this.baiduMapPluginInit();
      } else {
        document.addEventListener("plusready", () => {
          this.baiduMapPluginInit();
        }, false);
      }
    },
    computed: {
      cupPercent() {
        return this.cuped / this.cupActivityNum;
      }
    },
    methods: {
      baiduMapPluginInit() {
        this.w = plus.nativeUI.showWaiting('', {
          padding: '5%'
        });
        baiduMapWalkNaviPlugin();
        baiduLocationPlugin();
        // 安装日志插件
        consolePlugin();
        this.isiOS = plus.os.name === 'iOS';
        if (plus.os.name === 'iOS') {
          // 获取定位数据
          window.plus.baiduLocation.getCurrentPosition((args) => {
            const p = {};
            p.coords = {};
            p.coords['latitude'] = args.latitude;
            p.coords['longitude'] = args.longitude;
            xconsole.log(JSON.stringify(p))
            db.set('local', p)
            this.addressDetermine(); //定位
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
            this.addressDetermine(); //定位
            this.w.close()
          }, function (e) {
            //('Geolocation error: ' + e.message);
          }, {
            provider: 'baidu',
            coordsType: 'bd09ll'
          });
        }
      },
      async init() {
        let res = await this.$http.get(this, api.advertisement, {
          appid: api.appid,
        })
        this.bannerList = res;
        if (db.get('userInfo')) this.getMemberInfo();
      },
      //获取会员信息
      async getMemberInfo() {
        //用户信息
        let MemberInfo = await this.$http.get(this, api.memberInfo, {
          appid: api.appid,
          openid: db.get('userInfo').openid
        })
        this.cupActivityNum = MemberInfo.promoteCount;
        this.cuped = MemberInfo.levelCount;
        //      //是否有优惠券到账
        //      let shareCoupon = await this.$http.get(this, api.shareCoupon, {
        //        appid: api.appid,
        //        openid: db.get('userInfo').openid
        //      })
      },
      //确定最近的咖啡机的位置
      async addressDetermine() {
        this.local = db.get('local').coords;
        let res = await this.$http.get(this, api.machineList, {
          appid: api.appid,
          lat: this.local.latitude,
          lng: this.local.longitude,
          pageSize: 10,
          pageNo: 1
        })
        //分离距离单位为km和m的
        let mAddress = [],
          kmAddress = [];
        res.forEach(i => {
          if (i.unit == 'm') {
            mAddress.push(i)
          } else {
            kmAddress.push(i)
          }
        })
        //如果距离单位为m的只有一个，那么最近咖啡机就是这个
        if (mAddress.length == 1) {
          this.address = mAddress[0]
        } else if (mAddress.length > 1) {
          //确定最近的咖啡机（单位为m）
          let min = mAddress[0]
          mAddress.forEach(i => {
            if (i.distance < min.distance) min = i;
          })
          this.address = min;
        } else {
          //确定最近的咖啡机（单位为km）
          let min = kmAddress[0]
          kmAddress.forEach(i => {
            if (i.distance < min.distance) min = i;
          })
          this.address = min;
        }
        this.hideVRNav()
      },
      //超过10km的的咖啡机就不导航了
      hideVRNav() {
        if (this.address.distance > 10 && this.address.unit == km) this.isShowVRNav = false;
      },
      //更换地点页面
      gotoAddressChoose() {
        if (this.addressWebview) {
          plus.webview.show(this.addressWebview, 'slide-in-right');
        } else {
          this.addressWebview = plus.webview.create('address.html', 'address', {
            'popGesture': 'hide',
            'backButtonAutoControl': 'hide',
            'titleNView': {
              'backgroundColor': '#404040',
              'titleText': '选择地点',
              'titleColor': '#FFFFFF',
              'titleSize': '18',
              autoBackButton: true,
              progress: {
                color: '#f7be36'
              }
            }
          });
          plus.webview.show(this.addressWebview, 'slide-in-right');
        }
      },
      //订单+
      orderCup(item) {
        if (this.totalCount > 0) {
          this.$vux.toast.text('目前仅支持同时购买一份')
        } else {
          this.totalCount++;
          if (this.orderList.length == 0) {
            item.num = 1;
            this.orderList.push(item)
          } else {
            this.orderList.forEach(i => {
              if (item.code == i.code) {
                i.num++
              } else {
                item.num = 1;
                this.orderList.push(item)
              }
            })
          }
        }
      },
      //订单-
      orderCupSub(item) {
        this.orderList.forEach((i, index) => {
          if (item.code == i.code) {
            if (i.num > 1) {
              i.num++
            } else {
              this.orderList.splice(index, 1)
            }
            this.totalCount--;
          }
        })
      },
      async showPayView() {
        if (this.orderList.length == 0) {
          this.$vux.toast.text('请选择商品')
          return;
        }
        if (window.plus) {
          //        db.set('homeViewHeight', plus.webview.currentWebview().getStyle().height);
          //        plus.webview.currentWebview().setStyle({
          //          height: clientHeight + 'px',
          //          bottom: '0'
          //        })
        }

        //判断是否登录，没有登录则请求登录
        if (!db.get('userInfo')) {
          this.$vux.loading.show({
            text: '登录中...'
          })
          let loginRes = await this.wecatLogin();
          this.$vux.loading.hide();
          //若拒绝微信授权登录则不在执行下一步操作
          if (loginRes == 201) return;
          //获取用户会员信息
          this.getMemberInfo();
        }
        this.$vux.loading.show({
          text: '加载中...'
        })
        //获取用户优惠券
        let res = await this.$http.get(this, api.couponList, {
          openid: db.get('userInfo').openid,
          appid: api.appid,
          effective: true,
          tip: false
        })
        this.$vux.loading.hide()
        if (res.success == true) {
          this.couponList = res.result;
          this.payPopupShow = true;
        } else {
          this.$vux.toast.text('系统错误，请稍候重试')
        }
      },
      goToPosition() {
        this.w = plus.nativeUI.showWaiting('', {
          padding: '5%'
        });
        // 加载定位
        window.plus.baiduLocation.getCurrentPosition((res) => {
          this.w.close();
          window.plus.baiduMapWalkNavi.goToPosition(res.latitude, res.longitude,
            this.address.lat, this.address.lng, (res) => {
            }, (res) => {
              plus.nativeUI.alert("导航加载失败，请重试！", null, "加载错误", "确认");
            })
        }, () => {
          this.w.close();
          plus.nativeUI.confirm("请到设置->隐私->定位服务中开启【快乐咖】定位服务，以便于准确获得你的位置信息", (e) => {
            if (e.index === 1) {
              var UIApplication = plus.ios.import("UIApplication");
              var NSURL = plus.ios.import("NSURL");
              var setting = NSURL.URLWithString("UIApplicationOpenSettingsURLString");
              var application = UIApplication.sharedApplication();
              application.openURL(setting);
              plus.ios.deleteObject(setting);
              plus.ios.deleteObject(application);
            }
          }, {
            title: "定位服务已关闭",
            buttons: ['取消', '去设置'],
          }, "确认");
        })
      }
    },
    watch: {
      async 'address.machineCode'(value) {
        let res = await this.$http.get(this, api.productList, {
          machineCode: value
        })
        this.productList = res;
      },
    }
  }
</script>
<style>

</style>
