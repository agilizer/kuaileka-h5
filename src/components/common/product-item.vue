<template>
  <div class="product-item">
    <div class="img">
      <img :src='itemImg' />
    </div>
    <div class="intro">
      <h2 class="ellipsis">{{item.name}}</h2>
      <div class="price">￥{{item.normalPrice}}</div>
      <div class="num">
        <span @click="sub"><img class="sub" :class="{disable:subDisable}" src="../../assets/images/ic_add.png"/></span>
        <i>{{num}}</i>
        <span @click="add"><img class="add" src="../../assets/images/ic_add.png"/></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {
      item: {},
      total: {
        type: Number
      },
    },
    data() {
      return {
        num: 0, //数量
      }
    },
    created() {

    },
    computed: {
      subDisable() {
        if(this.num == 0) return true;
      },
      itemImg() {
        for(let i = 101; i < 157; i++) {
          if(i == this.item.code) {
            return require('../../assets/images/' + this.item.code + '.png')
          }
        }
        return require('../../assets/images/default.png')
      }
    },
    methods: {
      sub() {
        if(this.num > 0) this.num--;
        this.$emit('orderSub', this.item);
      },
      add() {
        if(this.num < 1 && this.total < 1) {
          this.num++;
          this.$emit('order', this.item);
        } else {
          this.$vux.toast.text('目前仅支持同时购买一份')
        }
      }
    }
  }
</script>
<style>

</style>