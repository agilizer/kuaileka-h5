<template>
  <!--账户余额-->
  <div class="container balance">
    <div class="balance-top">
      <span>账户余额（￥）：</span>
      <i @click="gotoWebview(accountWebview,'accountDetails','账户明细')">账户明细</i>
    </div>
    <div class="num">
      93.00
    </div>
    <div class="button" @click="gotoWebview(rechargeWebview,'recharge','充值')">去充值</div>
  </div>
</template>

<script>
  import api from '../../service/api'
  import db from '../../plugins/db'
  export default {
    name: 'home',
    components: {},
    data() {
      return {
        accountWebview: null,
        rechargeWebview: null,
      }
    },
    methods: {
      gotoWebview(webview, webUrl, name) {
        if(webview) {
          plus.webview.show(webview, 'slide-in-right');
        } else {
          webview = plus.webview.create(webUrl + '.html', 'address', {
            'popGesture': 'hide',
            'backButtonAutoControl': 'hide',
            'titleNView': {
              'backgroundColor': '#404040',
              'titleText': name,
              'titleColor': '#FFFFFF',
              'titleSize': '18',
              autoBackButton: true,
              progress: {
                color: '#f7be36'
              }
            }
          });
          plus.webview.show(webview, 'slide-in-right');
        }
      },
    }
  }
</script>
<style>

</style>