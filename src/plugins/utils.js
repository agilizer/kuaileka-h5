const u = navigator.userAgent;
const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

/**
 * 判断用户使用设备信息
 * 返回 android ios/iphonex other 四种 
 * @returns {*}
 */
export const userAgent = function() {
  if(isAndroid) {
    return 'android'
  } else if(isiOS) {
    return 'ios'
  } else {
    return 'other'
  }
};

export const isIphoneX = () => {
  if(isiOS && screen.height == 812 && screen.width == 375) {
    return true
  } else {
    return false;
  }
}

export const ModalHelper = (function(bodyCls) {
  let scrollTop;
  return {
    afterOpen: function() {
      scrollTop = document.scrollingElement.scrollTop;
      document.body.classList.add(bodyCls);
      document.body.style.top = -scrollTop + 'px';
    },
    beforeClose: function() {
      document.body.classList.remove(bodyCls);
      // scrollTop lost after set position:fixed, restore it back.
      document.scrollingElement.scrollTop = scrollTop;
    }
  };
})('modal-open');