<template>
  <div class="home">
    <div class="address-container" @click="gotoAddressChoose">
      <div class="address-top">
        {{address.name}}<i class="angle-white-bottom"></i>
      </div>
    </div>
    <swiper v-if='swiperInit' loop dots-position="center" :height="swiperHeight" class="dots-class">
      <swiper-item class="swiper-banner-img" v-for="(item, index) in bannerList" :key="index">
        <img :src="baseURL+item.src">
      </swiper-item>
    </swiper>
    <div class="announce">
      <div class="cup-acc">
        <img class="cup" src="../../assets/images/coffee-cup.png" />
        <div class="circle">
          <div class="num">{{cuped}}/{{cupActivityNum}}</div>
          <em :style="{height:cupPercent+'rem',top:1-cupPercent+'rem'}"></em>
        </div>
      </div>
      <p>咖小白： 再次消费5次可获得免费优惠券</p>
    </div>
    <div class="container product-container">
      <div class="product-list">
        <product-item v-for=" i in productList" :key="i.code" :item="i" @order="orderCup" @orderSub="orderCupSub" :total="totalCount"></product-item>
      </div>
    </div>
    <div class="button-buy" @click="showPayView">
      <span>购买</span>
      <i v-if="totalCount">{{totalCount}}</i>
    </div>
    <pay-popup v-model="payPopupShow" :orderList=orderList></pay-popup>
  </div>
</template>

<script>
  import { Swiper, SwiperItem } from 'vux'
  import ProductItem from '../../components/common/product-item'
  import payPopup from '../../components/common/pay-popup'
  import db from '../../plugins/db'
  let clientHeight = db.get('clientHeight')
  import api from '../../service/api'
  export default {
    name: 'home',
    components: {
      Swiper,
      SwiperItem,
      ProductItem,
      payPopup
    },
    data() {
      return {
        cupActivityNum: 5,
        cuped: 1,
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
      }
    },
    created() {
      document.addressChange = (res) => {
        this.address = res;
      }
      //确定banner的高度
      setTimeout(() => {
        let rem = document.documentElement.style.fontSize.replace('px', '');
        this.swiperHeight = parseInt(2.54 * rem) + 'px';
        this.swiperInit = true;
        console.log(this.swiperHeight)
      }, 500)
      this.init();
      this.addressDetermine(); //定位
      if(window.plus) {}
    },
    computed: {
      cupPercent() {
        return this.cuped / this.cupActivityNum;
      }
    },
    methods: {
      async init() {
        let res = await this.$http.get(this, api.advertisement, {
          appid: api.appid,
        })
        this.bannerList = res;
      },
      //确定最近的咖啡机的位置
      async addressDetermine() {
        //      this.local = db.get('local').coords;
        let res = await this.$http.get(this, api.machineList, {
          appid: api.appid,
          lat: this.local.latitude,
          lng: this.local.longitude,
          pageSize: 10,
          pageNo: 1
        })
        //      let addressFilter = res.every(i => {
        //        return i.distance > 3 && i.unit == 'km'
        //      })
        //分离距离单位为km和m的
        let mAddress = [],
          kmAddress = [];
        res.forEach(i => {
          if(i.unit == 'm') {
            mAddress.push(i)
          } else {
            kmAddress.push(i)
          }
        })
        //如果距离单位为m的只有一个，那么最近咖啡机就是这个
        if(mAddress.length == 1) {
          this.address = mAddress[0]
        } else if(mAddress.length > 1) {
          //确定最近的咖啡机（单位为m）
          let min = mAddress[0]
          mAddress.forEach(i => {
            if(i.distance < min.distance) min = i;
          })
          this.address = min;
        } else {
          //确定最近的咖啡机（单位为km）
          let min = kmAddress[0]
          kmAddress.forEach(i => {
            if(i.distance < min.distance) min = i;
          })
          this.address = min;
        }
      },
      //更换地点页面
      gotoAddressChoose() {
        if(this.addressWebview) {
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
                color: '#ffb64c'
              }
            }
          });
          plus.webview.show(this.addressWebview, 'slide-in-right');
        }
      },
      //订单+
      orderCup(item) {
        if(this.totalCount > 0) {
          this.$vux.toast.text('目前仅支持同时购买一份')
        } else {
          this.totalCount++;
          if(this.orderList.length == 0) {
            item.num = 1;
            this.orderList.push(item)
          } else {
            this.orderList.forEach(i => {
              if(item.code == i.code) {
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
          if(item.code == i.code) {
            if(i.num > 1) {
              i.num++
            } else {
              this.orderList.splice(index, 1)
            }
            this.totalCount--;
          }
        })
      },
      showPayView() {
        if(this.orderList.length == 0) {
          this.$vux.toast.text('请选择商品')
          return;
        }
        if(window.plus) {
          //        db.set('homeViewHeight', plus.webview.currentWebview().getStyle().height);
          //        plus.webview.currentWebview().setStyle({
          //          height: clientHeight + 'px',
          //          bottom: '0'
          //        })
        }
        this.payPopupShow = true;
      },

    },
    watch: {
      async 'address.machineCode' (value) {
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