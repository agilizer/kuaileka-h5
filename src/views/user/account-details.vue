<template>
  <!--帐号明细-->
  <div class="account-detail">
    <h2>账户明细</h2>
    <me-scroll :style="{'height':scrollerHeight}" class="" @up="meUp" @down="meDown" @init="meInit">
      <li v-for="i in list">
        <span>充值</span>
        <i>88咖豆</i>
        <span>2018-01-22 18:00</span>
      </li>
      <li>
        <span>充值</span>
        <i class="grey">-88咖豆</i>
        <span>2018-01-22 18:00</span>
      </li>
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
      }
    },
    created() {},
    methods: {
      dataGet() {
        return this.$http.get(this, api.consumeList,{
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
        if(data && data.code === 0) {
          if(page.num == 1) this.list = [];
          let nextPage = true;
          if(data.body.content.length < this.size) {
            nextPage = false;
          }
          this.list = this.list.concat(data.body.content);
          this.mescroll.endSuccess(data.body.content.length, nextPage);
        } else {
          this.$vux.toast.text('系统错误，请刷新重试！');
          this.mescroll.endErr();
        }
        this.mescroll.endErr();
      },
      //列表刷新
      async refreshFecth() {
        this.mescroll.setPageNum(2);
        this.page = 0;
        const data = await this.dataGet();
        data.body.content.forEach(x => {
          if(!x.endDate) x.endDate = ''
        });
        if(data && data.code === 0) {
          this.taskList = [];
          let nextPage = true;
          if(data.body.content.length < this.size) {
            nextPage = false;
          }
          this.taskList = this.taskList.concat(data.body.content);
          this.mescroll.endSuccess(data.body.content.length, nextPage);
        } else {
          this.$vux.toast.text('系统错误，请刷新重试！');
          this.mescroll.endErr();
        }
        this.mescroll.endErr();
      },
    }
  }
</script>
<style>

</style>