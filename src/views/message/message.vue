<template>
  <div class="message">
    <div class="line" ref="mline"></div>
    <me-scroll :style="{'height':scrollerHeight}" @up="meUp" @down="meDown" @init="meInit" :up=meScrollUp>
      <ul ref="mlist" class="message-list" v-if="!noData">
        <li v-for="i in messageList" :key='i.id'>
          <h2>{{i.title}}</h2>
          <div>{{i.time}}</div>
          <p>{{i.content}}</p>
        </li>
      </ul>
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
        meScrollUp: {
          use: true,
          htmlNodata: '',
        },
        messageList: [],
        scrollerHeight: '100vh',
        page: 0,
        size: 100,
      }
    },
    created() {
      //mescroller高度确定
      //    setTimeout(() => {
      //      let rem = document.documentElement.style.fontSize.replace('px', ''),
      //        height = document.body.clientHeight;
      //      this.scrollerHeight = parseInt(height - (.8 * rem) - 44) + 'px';
      //    }, 500)
      // this.getMessageList();
    },
    mounted() {},
    methods: {
      async getMessageList() {
        let res = await this.$http.get(this, api.messageList, {
          pageSize: 10,
          pageNo: 1,
          openid: db.get('userInfo').openid,
        })
        this.messageList = res.list;
        //      {
        //        "list": [],
        //        "pageNo": 0,
        //        "pageSize": 10,
        //        "totalCount": 0,
        //        "pageStartIndex": 0,
        //        "totalPage": 0
        //      }
      },
      layout() {
        this.$nextTick(() => {
          //布局
          let fontsize = document.documentElement.style.fontSize.replace('px', '')
          let ul = this.$refs.mlist.children;
          for(let i = 2; i < ul.length; i++) {
            let li2 = ul[i - 2];
            let heightTop2 = li2.offsetHeight + li2.offsetTop;
            let li1 = ul[i - 1];
            let offsetTop1 = li1.offsetTop;
            let li = ul[i];
            if(i % 2 == 0) {
              //左边
              let theTop = heightTop2 >= offsetTop1 ? heightTop2 : offsetTop1;
              li.style.top = (theTop + .6 * fontsize) + 'px';
            } else {
              //右边
              let theTop = heightTop2 >= offsetTop1 ? heightTop2 : offsetTop1;
              li.style.top = (theTop + .6 * fontsize) + 'px';
            }
          }
          let line = this.$refs.mline;
          let li = ul[ul.length - 1];
          let bodyHeight = document.body.offsetHeight;
          let lineHeight = li.offsetHeight + li.offsetTop;
          //      if(lineHeight > bodyHeight) lineHeight = bodyHeight + .6 * fontsize;
          line.style.height = (lineHeight - .9 * fontsize) + 'px';
        })
      },
      dataGet() {
        return this.$http.get(this, api.messageList, {
          pageSize: this.size,
          pageNo: this.page,
          openid: db.get('userInfo').openid,
        })
      },
      //mescroll初始化
      meInit(mescroll) {
        this.noData = true;
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
        if(page.num == 1) this.messageList = [];
        let nextPage = true;
        if(data.list.length < this.size) {
          nextPage = false;
        }
        this.messageList = this.messageList.concat(data.list);
        this.layout()
        this.noData = this.messageList.length == 0;
        this.mescroll.endSuccess(data.list.length, nextPage);
        this.mescroll.endErr();
      },
      //列表刷新
      async refreshFecth() {
        this.mescroll.setPageNum(2);
        this.page = 1;
        const data = await this.dataGet();
        this.messageList = [];
        let nextPage = true;
        if(data.list.length < this.size) {
          nextPage = false;
        }
        this.messageList = this.messageList.concat(data.list);
        this.layout()
        this.noData = this.messageList.length == 0;
        this.mescroll.endSuccess(data.list.length, nextPage);
        this.mescroll.endErr();
      },
    }
  }
</script>
<style>

</style>