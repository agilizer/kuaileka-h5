<template>
  <!--优惠券列表-->
  <div class="coupon">
    <div class="tab-menu-container">
      <ul class="tab-menu">
        <li v-for="(i,index) in couponMenu" :class="{active:tabIndex==index}" @click="tabClick(index)">
          {{i.value}}({{index?historyList.length:list.length}})
        </li>
      </ul>
    </div>
    <ul class="coupon-list" v-show="tabIndex==0">
      <li class="coupon-item" v-for="i in list">
        <h2>{{i.typeName}}</h2>
        <div class="price">
          <template v-if="i.type=='DISCOUNT'">
            <i>￥</i>
            <span>{{i.discount}}</span>
          </template>
          <img v-else src="../../assets/images/coffee-cup.png" style="width:1.65rem;" />
        </div>
        <div class="info">
          <p>截止日期：{{i.endTime}}</p>
          <p>来源：{{i.desc}}</p>
        </div>
      </li>
    </ul>
    <ul class="coupon-list" v-show="tabIndex==1">
      <li class="coupon-item disabled" v-for="i in historyList">
        <h2>{{i.typeName}}-已使用</h2>
        <div class="price">
          <template v-if="i.type=='DISCOUNT'">
            <i>￥</i>
            <span>{{i.discount}}</span>
          </template>
          <img v-else src="../../assets/images/coffee-cup.png" style="width:1.65rem;" />
        </div>
        <div class="info">
          <p>截止日期：{{i.endTime}}</p>
          <p>来源：{{i.desc}}</p>
        </div>
      </li>
    </ul>
    <!--<li class="coupon-item">
        <h2>优惠券</h2>
        <div class="price">
          <img src="../../assets/images/coffee-cup.png" style="width:1.65rem;" />
        </div>
        <div class="info">
          <p>截止日期：2018-12-24 12:00:00</p>
          <p>来源：注册赠送</p>
        </div>
      </li>
      <li class="coupon-item disabled">
        <h2>优惠券-已使用</h2>
        <div class="price">
          <template>
            <i>￥</i>
            <span>320</span>
          </template>
        </div>
        <div class="info">
          <p>截止日期：2018-12-24 12:00:00</p>
          <p>来源：注册赠送</p>
        </div>
      </li>
      <li class="coupon-item disabled">
        <h2>优惠券-已使用</h2>
        <div class="price">
          <img src="../../assets/images/coffee-cup.png" style="width:1.65rem;" />
        </div>
        <div class="info">
          <p>截止日期：2018-12-24 12:00:00</p>
          <p>来源：注册赠送</p>
        </div>
      </li>
      <li class="coupon-item" v-for="i in list" :class="">
        <h2>优惠券-已使用</h2>
        <div class="price">
          <img src="../../assets/images/coffee-cup.png" style="width:1.65rem;" />
        </div>
        <div class="info">
          <p>截止日期：2018-12-24 12:00:00</p>
          <p>来源：注册赠送</p>
        </div>
      </li>-->

    <!--<me-scroll :style="{'height':scrollerHeight}" class="coupon-list" @up="meUp" @down="meDown" @init="meInit"></me-scroll>-->
    <div class="fixed-bottom" :class="{'iphone-x-height':isIphoneX}" v-show="tabIndex==0" @click="gotoIndex">
      <div class="button" :class="{'iphone-x-bottom':isIphoneX}">去使用</div>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../components/common/me-scroll.vue'
  import api from '../../service/api'
  import db from '../../plugins/db'
  import iPhoneXSafearea from '../../plugins/mixins/iphoneX-safe-area'
  export default {
    name: '',
    mixins: [iPhoneXSafearea],
    components: {
      MeScroll
    },
    data() {
      return {
        couponMenu: [{
          value: '可用',
          active: true,
        }, {
          value: '历史',
          active: false,
        }],
        tabIndex: 0,
        list: [],
        historyList: [],
        page: 1,
        size: 10,
        scrollerHeight: '100vh',
      }
    },
    created() {
      this.init();
    },
    methods: {
      async init() {
        let res = await this.$http.get(this, api.couponList, {
          appid: api.appid,
          openid: db.get('userInfo').openid,
          effective: true, // 优惠券可使用
          tip: false
        })
        this.list = res.result;
        let hRes = await this.$http.get(this, api.couponList, {
          appid: api.appid,
          openid: db.get('userInfo').openid,
          effective: false, // 优惠券可使用
          tip: false
        })
        this.historyList = hRes.result;
      },
      tabClick(index) {
        this.tabIndex = index;
      },
      gotoIndex() {
        plus.webview.currentWebview().close()
        let wb = plus.webview.getLaunchWebview();
        wb.evalJS('document.showHomeWebview()')
      }
      //    dataGet() {
      //      return this.$http.get(this, api.couponList, {
      //        appid: api.appid,
      //        openid: db.get('userInfo').openid,
      //        effective: true, // 优惠券可使用
      //        tip: false
      //      })
      //    },
      //    //mescroll初始化
      //    meInit(mescroll) {
      //      this.mescroll = mescroll;
      //      this.mescroll.setPageSize(this.size);
      //    },
      //    //mescroll下拉刷新
      //    meDown() {
      //      setTimeout(() => {
      //        this.refreshFecth();
      //      }, 500);
      //    },
      //    //mescroll上拉加载
      //    meUp(page) {
      //      setTimeout(() => {
      //        this.fetchMore(page);
      //      }, 500);
      //    },
      //    //加载更多
      //    async fetchMore(page) {
      //      this.page = page.num;
      //      let data = await this.dataGet();
      //      if(page.num == 1) this.list = [];
      //      let nextPage = true;
      //      if(data.result.length < this.size) {
      //        nextPage = false;
      //      }
      //      this.list = this.list.concat(data.result);
      //      this.mescroll.endSuccess(data.result.length, nextPage);
      //      this.mescroll.endErr();
      //    },
      //    //列表刷新
      //    async refreshFecth() {
      //      this.mescroll.setPageNum(1);
      //      this.page = 1;
      //      const data = await this.dataGet();
      //      this.list = [];
      //      let nextPage = true;
      //      if(data.result.length < this.size) {
      //        nextPage = false;
      //      }
      //      this.list = this.list.concat(data.result);
      //      this.mescroll.endSuccess(data.result.length, nextPage);
      //      this.mescroll.endErr();
      //    },
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
</style>