/**
 * 控制台中打印日志
 */

export let xconsole = '';

export const consolePlugin = function () {
  const _BARCODE = 'console',
    B = window.plus.bridge;
  window.plus.console = {
    log: function (arg) {
      return B.exec(_BARCODE, "log", [arg]);
    }
  }
  xconsole = window.plus.console;
}

