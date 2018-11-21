<template>
  <div class="recharge">
    <h2>请选择充值金额：</h2>
    <checker v-model="rechargeCount" :max="1" class="recharge-box" default-item-class="recharge-item" selected-item-class="recharge-item-selected">
      <checker-item v-for="i in rechargeItemList" :value="i.value" :key="'recharge-'+i.value" @on-item-click="rechargeItemClick">
        <dt>{{i.tName}}</dt>
        <dd>{{i.dName}}</dd>
      </checker-item>
    </checker>
    <div class="recharge-user">
      <h2>其他金额：</h2>
      <input type="number" v-model.trim.number="rechargeUser" placeholder="￥0.00" @input="userInput" />
    </div>
    <div class="button" :class="{disabled:payDisabled}" @click="pay">确认支付</div>
  </div>
</template>

<script>
  import { Checker, CheckerItem } from 'vux'
  export default {
    name: 'recharge',
    components: {
      Checker,
      CheckerItem
    },
    data() {
      return {
        rechargeItemList: [{
          value: 100,
          tName: '￥100',
          dName: '赠送50元'
        }, {
          value: 200,
          tName: '￥200',
          dName: '赠送100元'
        }, {
          value: 500,
          tName: '￥500',
          dName: '赠送300元'
        }, ],
        rechargeCount: '',
        rechargeUser: '', //用户自己填写的金额
        payDisabled: true,
      }
    },
    methods: {
      rechargeItemClick() {
        this.$nextTick(() => {
          this.payDisabled = this.rechargeCount > 0 ? false : true;
        })
      },
      userInput() {
        this.rechargeCount = this.rechargeUser = parseFloat(this.rechargeUser).toFixed(2);
        if(this.rechargeCount > 0) this.payDisabled = false;
      },
      pay() {
        console.log(this.rechargeCount)
      }
    }
  }
</script>
<style lang="scss">
  .recharge-item-selected {
    position: relative;
    &:after {
      position: absolute;
      right: -.2rem;
      top: -.2rem;
      content: '';
      display: block;
      width: .42rem;
      height: .42rem;
      background: url(../../assets/images/ic_chose1.png) center / cover;
    }
  }
</style>