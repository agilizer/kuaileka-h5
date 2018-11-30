<template>
  <!--订单列表-->
  <div class="user-order">
    <div class="tab-menu-container" ref="tabMenu">
      <ul class="tab-menu">
        <li v-for="(i,index) in orderMenu" :class="{active:tabIndex==index}" @click="tabClick(index)">{{i.value}}</li>
      </ul>
    </div>
    <me-scroll :style="{'height':scrollerHeight}" class="order-list" @up="meUp" @down="meDown" @init="meInit">
      <li v-for="i in list" v-if="list.length>0">
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
          <div class="button" :class="{disabled:i.status!='PAY'}" @click="makeProduct(i.chargeId)">
            <template v-if="i.status=='PAY'">制作</template>
            <template v-if="i.status!='PAY'">已完成</template>
          </div>
        </div>
      </li>
      <div class="no-data-img" v-if="noData">
        <img src="../../assets/images/im_qsdd.png" style="width: 3.5rem;height: 2.5rem;" />
        <p>暂无订单</p>
      </div>
    </me-scroll>
  </div>
</template>

<script>
  import api from '../../service/api'
  import db from '../../plugins/db'
  import MeScroll from '../../components/common/me-scroll.vue'
  export default {
    name: 'user-order-list',
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
        noData: false,
      }
    },
    created() {
      //确定mescroll的高度
      setTimeout(() => {
        let rem = document.documentElement.style.fontSize.replace('px', ''),
          height = document.body.clientHeight;
        this.scrollerHeight = parseInt(height - .8 * rem) + 'px';
      }, 500)
    },
    methods: {
      tabClick(index) {
        this.noData = false;
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
        this.noData = this.list.length == 0;
        this.mescroll.endSuccess(data.length, nextPage);
        this.mescroll.endErr();
      },
      //列表刷新
      async refreshFecth() {
        this.mescroll.setPageNum(2);
        this.page = 1;
        const data = await this.dataGet();
        this.list = [];
        let nextPage = true;
        if(data.length < this.size) {
          nextPage = false;
        }
        this.list = this.list.concat(data);
        this.noData = this.list.length == 0;
        this.mescroll.endSuccess(data.length, nextPage);
        this.mescroll.endErr();
      },
      makeProduct(id) {
        if(window.plus) {
          let w = plus.nativeUI.showWaiting("制作中...");
        }
        this.$http.post(this, api.makeProduct, {
          chargeId: id
        }).then(data => {
          if(data.success) {
            this.list = [];
            this.mescroll.resetUpScroll();
            if(window.plus) w.close();
          }
        })
      }
    }
  }
</script>
<style>

</style>