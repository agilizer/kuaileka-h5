/*eslint-disable*/
const mixin = {
  data() {
    return {
      isIphoneX: false,
    }
  },
  mounted() {
    this.initIphoneXSafeArea();
  },
  methods: {
    initIphoneXSafeArea() {
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if(isiOS) {
        if(screen.height === 812 && screen.width === 375
          || screen.height === 896 && screen.width === 414) this.isIphoneX = true;
      }
    }
  }
};

export default mixin;
