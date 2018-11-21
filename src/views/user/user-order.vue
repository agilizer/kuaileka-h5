<template>
  <!--订单列表-->
  <div class="user-order">
    <div class="tab-menu-container">
      <ul class="tab-menu">
        <li v-for="(i,index) in orderMenu" :class="{active:tabIndex==index}" @click="tabClick(index)">{{i.value}}</li>
      </ul>
    </div>
    <ul class="order-list">
      <!--<li>
        <div class="info">
          <p><span>咖啡机名</span><span>百汇园3号</span></p>
          <p><span>订单商品</span><span>plim juice ×3</span></p>
          <p><span>订单金额</span><span>￥9.8</span></p>
          <p><span>购买日期</span><span>2018-11-20 15:11:12</span></p>
          <p><span>支付方式</span><span>余额</span></p>
        </div>
        <div class="operation">
          <div class="num">
            <span>订单号：</span>
            <em>FDSGDFJDF664353423</em>
          </div>
          <div class="button">制作</div>
        </div>
      </li>
      <li>
        <div class="info">
          <p><span>咖啡机名</span><span>百汇园3号</span></p>
          <p><span>订单商品</span><span>plim juice ×3</span></p>
          <p><span>订单金额</span><span>￥9.8</span></p>
          <p><span>购买日期</span><span>2018-11-20 15:11:12</span></p>
          <p><span>支付方式</span><span>余额</span></p>
        </div>
        <div class="operation">
          <div class="num">
            <span>订单号：</span>
            <em>FDSGDFJDF664353423</em>
          </div>
          <div class="button diabled">已完成</div>
        </div>
      </li>-->
    </ul>
    <me-scroll :style="{'height':scrollerHeight}" class="order-list" @up="meUp" @down="meDown" @init="meInit">
      <li v-for="i in list">
        <div class="info">
          <p><span>咖啡机名</span><span>{{i.machine}}</span></p>
          <p><span>订单商品</span><span>{{i.productNames}}</span></p>
          <p><span>订单金额</span><span>￥{{i.salePrice}}</span></p>
          <p><span>购买日期</span><span>{{i.saleTime}}</span></p>
          <p><span>支付方式</span>
            <span v-if="i.paymentDevice=='wx_pub_qr'">微信支付</span>
            <span v-if="i.paymentDevice=='alipay_qr'">支付宝</span>
            <span v-if="i.paymentDevice=='balance_qr'">余额</span>
            <span v-if="i.paymentDevice=='coupon_qr'">优惠券</span>
          </p>
        </div>
        <div class="operation">
          <div class="num">
            <span>订单号：</span>
            <em>{{i.chargeId}}</em>
          </div>
          <div class="button" :class="">制作</div>
        </div>
      </li>
    </me-scroll>

    <div class="no-order">
      <img src="../../assets/images/im_qsdd.png" style="width: 3.5rem;height: 2.5rem;" />
      <p>暂无订单</p>
    </div>

  </div>
</template>

<script>
  import api from '../../service/api'
  import db from '../../plugins/db'
  import MeScroll from '../../components/common/me-scroll.vue'
  export default {
    name: 'home',
    components: {
      MeScroll
    },
    data() {
      return {
        orderMenu: [{
          value: '未完成'
        }, {
          value: '已完成'
        }],
        tabIndex: 0,
        mescroll: null,
        scrollerHeight: '100vh',
        page: 1,
        size: 100,
        isCompleted: false,
        list: [],
      }
    },
    created() {

    },
    methods: {
      tabClick(index) {
        this.tabIndex = index;
        this.isCompleted = index == 1;
        this.list = [];
        this.mescroll.resetUpScroll();
      },
      dataGet() {
        return this.$http.get(this, api.saleRecordList, {
          openid: db.get('userInfo').openid,
          pageSize: 1000,
          pageNo: 1,
          complete: this.isCompleted
        })
      },
      //mescroll初始化
      meInit(mescroll) {
        this.mescroll = mescroll;
        this.mescroll.setPageSize(this.size);
      },
      //mescroll下拉刷新
      meDown() {
        setTimeout(() => {
          this.refreshFecth();
        }, 500);
      },
      //mescroll上拉加载
      meUp(page) {
        setTimeout(() => {
          this.fetchMore(page);
        }, 500);
      },
      //加载更多
      async fetchMore(page) {
        this.page = page.num;
        let data = await this.dataGet();
        if(page.num == 1) this.list = [];
        let nextPage = true;
        if(data.length < this.size) {
          nextPage = false;
        }
        this.list = this.list.concat(data);
        this.mescroll.endSuccess(data.length, nextPage);
        this.mescroll.endErr();
      },
      //列表刷新
      async refreshFecth() {
        this.mescroll.setPageNum(1);
        this.page = 1;
        const data = await this.dataGet();
        this.list = [];
        let nextPage = true;
        if(data.length < this.size) {
          nextPage = false;
        }
        this.list = this.list.concat(data);
        this.mescroll.endSuccess(data.length, nextPage);
        this.mescroll.endErr();
      },
    }
  }
</script>
<style>

</style>