/**
 * 百度定位插件
 */
const baiduMapWalkNaviPlugin = function () {
  const _BARCODE = 'baiduMapWalkNavi',
    B = window.plus.bridge;
  window.plus.baiduMapWalkNavi = {
    goToPosition: function (startLatitude, startLongitude, endLatitude, endLongitude,
                            successCallback, errorCallback) {
      const success = typeof successCallback !== 'function' ? null : function (args) {
          successCallback(args);
        },
        fail = typeof errorCallback !== 'function' ? null : function (code) {
          errorCallback(code);
        };
      const callbackID = B.callbackId(success, fail);
      return B.exec(_BARCODE, "goToPosition", [callbackID, startLatitude, startLongitude,
        endLatitude, endLongitude]);
    }
  }
}

export default baiduMapWalkNaviPlugin

