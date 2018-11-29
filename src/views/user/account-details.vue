<template>
  <!--帐号明细-->
  <div class="account-detail">
    <me-scroll :style="{'height':scrollerHeight}" class="" @up="meUp" @down="meDown" @init="meInit">
      <h2 v-if="!noData">账户明细</h2>
      <li v-for="i in list">
        <span>充值</span>
        <i>88咖豆</i>
        <span>2018-01-22 18:00</span>
      </li>
      <div class="no-data-img" v-if="noData">
        <img src="../../assets/images/im_qsdd.png" style="width: 3.5rem;height: 2.5rem;" />
        <p>暂无账户明细</p>
      </div>
    </me-scroll>
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
        list: [],
        page: 1,
        size: 10,
        scrollerHeight: '100vh',
        noData: false,
      }
    },
    created() {},
    methods: {
      dataGet() {
        return this.$http.get(this, api.consumeList, {
          openid: db.get('userInfo').openid,
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
        this.noData = this.list.length == 0;
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
        this.noData = this.list.length == 0;
        this.mescroll.endSuccess(data.length, nextPage);
        this.mescroll.endErr();
      },
    }
  }
</script>
<style>

</style>