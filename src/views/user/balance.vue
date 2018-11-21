<template>
  <!--账户余额-->
  <div class="container balance">
    <div class="balance-top">
      <span>账户余额（￥）：</span>
      <i>账户明细</i>
    </div>
    <div class="num">
      93.00
    </div>
    <div class="button">
      去充值
    </div>
  </div>
</template>

<script>
  import api from '../../service/api'
  import db from '../../plugins/db'
  export default {
    name: 'home',
    components: {},
    data() {
      return {}
    }
  }
</script>
<style>

</style>