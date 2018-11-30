/**
 * 百度定位插件
 */
const baiduLocationPlugin = function () {
  const _BARCODE = 'baiduLocation',
    B = window.plus.bridge;
  window.plus.baiduLocation = {
    getCurrentPosition: function (successCallback, errorCallback) {
      const success = typeof successCallback !== 'function' ? null : function (args) {
          successCallback(args);
        },
        fail = typeof errorCallback !== 'function' ? null : function (code) {
          errorCallback(code);
        };
      const callbackID = B.callbackId(success, fail);
      return B.exec(_BARCODE, "getCurrentPosition", [callbackID]);
    }
  }
}

export default baiduLocationPlugin

