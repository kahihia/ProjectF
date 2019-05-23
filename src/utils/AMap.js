export default {
  init:function () {
    const key = 'cbdb1df6ceec898e6c22f9f8eeb70326';
    const AMapURL = 'https://webapi.amap.com/maps?v=1.4.0&key=' + key+'&callback=onAMapCallback';
    return new Promise(function (resolve, reject) {
      // 如果已加载直接返回
      if (typeof AMap !== 'undefined') {
        resolve(AMap);
        return true
      }
      window.onAMapCallback = function () {
        resolve(AMap)
      };
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = AMapURL;
      script.onerror = reject;
      document.head.appendChild(script);
    })
  }
}
