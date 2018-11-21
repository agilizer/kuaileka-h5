<template>
  <div class="address">
    <!--<div class="address-list">

    </div>-->
    <me-scroll :style="{'height':scrollerHeight}" class="address-list message-scroller" @up="meUp" @down="meDown" @init="meInit">
      <div class="item" v-for="(i,index) in list" :key="i.id" @click="selectAddress(i)">
        <div class="img">
          <img src="../../assets/images/im_cardbg2.png" />
        </div>
        <div class="intro">
          <h2 class="ellipsis">{{i.name}}</h2>
          <p class="ellipsis">{{i.location}}</p>
          <p>{{i.distance}}{{i.unit}}</p>
          <p>月销&emsp;3</p>
          <div class="price">
            <i>￥</i>
            <span>{{i.lowestPrice}}</span>
            <i>起</i>
          </div>
        </div>
        <div class="tag-con">
          <i class="tag"><img src="../../assets/images/im_jifen.png"/></i>
          <i class="tag"><img src="../../assets/images/im_quan.png"/></i>
        </div>
      </div>
    </me-scroll>
  </div>
</template>

<script>
  import db from '../../plugins/db'
  import api from '../../service/api'
  import MeScroll from '../../components/common/me-scroll.vue'
  export default {
    name: 'home',
    components: {
      MeScroll
    },
    data() {
      return {
        mescroll: null,
        scrollerHeight: '100vh',
        page: 1,
        size: 100,
        list: [],
        local: {
          latitude: '39.95896', //纬度
          longitude: '116.48301', //经度
        }
      }
    },
    created() {
      //    this.local = db.get('local').coords;
      if(window.plus) {} else {
        document.addEventListener("plusready", () => {}, false);
      }
    },
    methods: {
      dataGet() {
        return this.$http.get(this, api.machineList, {
          appid: api.appid,
          lat: this.local.latitude,
          lng: this.local.longitude,
          pageSize: this.size,
          pageNo: this.page
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
      selectAddress(i) {
        plus.webview.getWebviewById('home').evalJS('document.addressChange(' + JSON.stringify(i) + ')')
        plus.webview.currentWebview().hide('slide-out-right');
      }
    }
  }
</script>
<style>
  .address .item .intro {
    background-image: url(../../assets/images/im_cardbg.png);
  }
</style>