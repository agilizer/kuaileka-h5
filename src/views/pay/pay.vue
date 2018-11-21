<template>
  <div class="pay-view">
    <h2 class="title">支付</h2>
    <swiper height="3.9rem" loop class="coupon-list" :show-dots="false">
      <swiper-item v-for="(item, index) in couponList" :key="index">
        <label>
        <div class="coupon-item">
          <h2>优惠券</h2>
          <div class="price">
            <template>
              <i>￥</i>
              <span>320</span>
            </template>
          </div>
          <div class="info">
            <p>截止日期：2018-12-24 12:00:00</p>
            <p>来源：注册赠送</p>
          </div>
        </div>
        <div class="coupon-checked">
        	<span>使用本优惠券</span>
        	<input type="radio" />
       	</div>
        </label>
      </swiper-item>
    </swiper>
    <div class="pay-detail">
      <p><span class="grey">已选择商品</span><span>卡布奇诺×3</span></p>
      <p><span class="grey">原价</span><span class="orange">￥9.80</span></p>
      <p><span class="grey">优惠券</span><span class="orange">￥9.80</span></p>
      <p><span class="grey">优惠价</span><span class="orange">￥0</span></p>
      <label><span>余额支付</span><input type="radio" value="balance" v-model="payWay"/></label>
      <label><span>微信支付</span><input type="radio"  value="wecat" v-model="payWay"/></label>
    </div>
    <div class="button-group">
      <div class="button default-button">取消</div>
      <div class="button primary-button">确定</div>
    </div>
  </div>
</template>

<script>
  import { Swiper, SwiperItem } from 'vux'
  export default {
    name: 'pay-view',
    components: {
      Swiper,
      SwiperItem,
    },
    data() {
      return {
        couponList: [{
          value: '',

        }],
        payWay: '', //支付方式
      }
    }
  }
</script>
<style lang="scss">
  .coupon-list .coupon-item {
    background: url(../../assets/images/im_yhqbg.png) center / cover;
    &.disabled {
      background-image: url(../../assets/images/im_yhqbg2.png);
    }
  }
  
  .pay-view {
    input[type=radio] {
      width: .42rem;
      height: .42rem;
      background: url(../../assets/images/ic_chose0.png) center / cover;
      border-radius: 50%;
      &:checked {
        background-image: url(../../assets/images/ic_chose1.png);
      }
    }
  }
</style>