/*
 * Created by WebStorm.
 * User: Jxy
 * Date: 2018/9/19
 * Time: 12:53
 */
(function () {
  var W = 750, w = parseInt(window.screen.width), s = w / W, u = navigator.userAgent.toLowerCase(), m = '<meta name="viewport" content="width=' + W + ',';
  // alert(/android (\d+\.\d+)/.test(u));
  var u = navigator.userAgent, app = navigator.appVersion;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
  if (isAndroid) {
    if (parseFloat(RegExp.$1) > 2.3)m += 'minimum-scale=' + s + ',maximum-scale=' + s + ',';
  } else {
    m += 'user-scalable=no,';
  }
  m += 'target-densitydpi=device-dpi">';
  document.write(m);
}());
