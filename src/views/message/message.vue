<template>
  <div class="message">
    <div class="line" ref="mline"></div>
    <ul class="message-list" ref="mlist">
      <li v-for="i in messageList">
        <h2>{{i.title}}</h2>
        <div>{{i.time}}</div>
        <p>{{i.content}}</p>
      </li>
    </ul>

    <!--<me-scroll :style="{'height':scrollerHeight}" class="message-list" @up="meUp" @down="meDown" @init="meInit">

    </me-scroll>-->

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
        messageList: [{
          id: '',
          name: '',
        }],
        scrollerHeight: '100vh',
        page: 0,
        size: 10,
      }
    },
    created() {
      //mescroller高度确定
      //    setTimeout(() => {
      //      let rem = document.documentElement.style.fontSize.replace('px', ''),
      //        height = document.body.clientHeight;
      //      this.scrollerHeight = parseInt(height - (.8 * rem) - 44) + 'px';
      //    }, 500)
      this.getMessageList();
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
        //      {
        //        "list": [],
        //        "pageNo": 0,
        //        "pageSize": 10,
        //        "totalCount": 0,
        //        "pageStartIndex": 0,
        //        "totalPage": 0
        //      }
      },
      dataGet() {
        return this.$http.get(this, api.taskListNew, '', {
          number: this.page,
          size: this.size,
          direction: 'DESC',
          order: 'dateCreated',
          ifFile: false,
          type: this.groupListChose,
          filter: this.moreFilterValue
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
        this.page = page.num - 1;
        let data = await this.dataGet();
        if(data && data.code === 0) {
          if(page.num == 1) this.taskList = [];
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