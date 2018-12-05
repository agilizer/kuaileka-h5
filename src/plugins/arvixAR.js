/**
 * 百度定位插件
 */
const arvixARPlugin = function () {
  const _BARCODE = 'arvixAR',
    B = window.plus.bridge;
  window.plus.arvixAR = {
    showARViewController: function (latitude, longitude, address,
                                    successCallback, errorCallback) {
      const success = typeof successCallback !== 'function' ? null : function (args) {
          successCallback(args);
        },
        fail = typeof errorCallback !== 'function' ? null : function (code) {
          errorCallback(code);
        };
      const callbackID = B.callbackId(success, fail);
      return B.exec(_BARCODE, "showARViewController", [callbackID, latitude, longitude, address]);
    }
  }
}

export default arvixARPlugin

