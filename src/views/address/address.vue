<template>
  <div class="address">
    <me-scroll class="address-list message-scroller" meid='body' @up="meUp" @down="meDown" @init="meInit">
      <div class="item" v-for="(i,index) in list" :key="i.id" @click="selectAddress(i)">
        <div class="img" :style="{background: 'url('+cafeimg+') top right no-repeat / contain, url('+cafebg+') top left no-repeat / contain'}">
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
    <div class="scan-enter" v-if="isiOS">
      <img src="../../assets/images/scan.png" />
    </div>
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
        cafeimg: require('../../assets/images/im_cardbg.png'),
        cafebg: require('../../assets/images/im_cardbg2.png'),

        mescroll: null,
        scrollerHeight: '100vh',
        page: 1,
        size: 10,
        list: [],
        local: {
          latitude: '39.95896', //纬度
          longitude: '116.48301', //经度
        },
        isiOS: false,
      }
    },
    created() {
      //    this.local = db.get('local').coords;
      if(window.plus) {
        this.isiOS = plus.os.name === 'iOS';
      } else {
        document.addEventListener("plusready", () => {
          this.isiOS = plus.os.name === 'iOS';
        }, false);
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
        this.mescroll.setPageNum(2); //设置page.num的值，下拉刷新之后第一页已经加载，第一次加载更多从第二页开始，所以设置为2
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
  .address .address-list .item .img {
    background: url(../../assets/images/im_cardbg.png) top right no-repeat / contain, url(../../assets/images/im_cardbg2.png) top left no-repeat / contain;
  }
</style>