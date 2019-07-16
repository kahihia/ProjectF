import AMap from './AMap'
import {setLocalData} from './storages'
import request from "./request";
let map,geolocation;
let httpUrl='https://www.findif.cn/';

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */

export function find (list, f) {
  return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy (obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj);
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {};
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  });

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  });

  return copy
}

/**
 * forEach for object
 */
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}
//获取get参数
export function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)return unescape(r[2]);
  return null;
}
export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function isPromise (val) {
  return val && typeof val.then === 'function'
}

export function assert (condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`)
}
export function isEmptyObject(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}
function getRad(d){
  return d*Math.PI/180.0;
}
//计算两地距离
export function getGreatCircleDistance(lat1,lng1,lat2,lng2) {
  let EARTH_RADIUS = 6378.137;//单位KM
  let newPositionData = {
    newLat1:Number(lat1),
    newLng1:Number(lng1),
    newLat2:Number(lat2),
    newLng2:Number(lng2)
  };
  let radLat1 = getRad(newPositionData.newLat1);
  let radLat2 = getRad(newPositionData.newLat2);
  let a = radLat1 - radLat2;
  let b = getRad(newPositionData.newLng1) - getRad(newPositionData.newLng2);
  let s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
  s = s*EARTH_RADIUS;
  s = Math.round(s*10000)/10000.0;
  s<1?s=Math.floor(s*1000*10)/10+'m':s=Math.floor(s * 10)/10+'km';
  return s;
}
export function location() {
  AMap.init().then((AMap) => {
    map = new AMap.Map('container', {
      resizeEnable: true
    });
    map.plugin('AMap.Geolocation', function() {
      geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        timeout: 1000,          //超过10秒后停止定位，默认：无穷大
        buttonPosition:'RB'
      });
      map.addControl(geolocation);
      geolocation.getCurrentPosition(function(status,result){
        setLocalData('position',result);
      });
      // AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
      // AMap.event.addListener(geolocation, 'error', onError);    //返回定位出错信息
    });
  });
}
export function cutArr(str) {
  return str?str.split(','):false
}
export function getNextMonth(date) {
  var arr = date.split('-');
  var year = arr[0]; //获取当前日期的年份
  var month = arr[1]; //获取当前日期的月份
  var day = arr[2]; //获取当前日期的日
  var days = new Date(year, month, 0);
  days = days.getDate(); //获取当前日期中的月的天数
  var year2 = year;
  var month2 = parseInt(month) + 1;
  if (month2 == 13) {
    year2 = parseInt(year2) + 1;
    month2 = 1;
  }
  var day2 = day;
  var days2 = new Date(year2, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = '0' + month2;
  }
  var t2 = year2 + '-' + month2 + '-' + day2;
  return t2;
}
export function isIos() {
  //获取浏览器的userAgent,并转化为小写
  let ua = navigator.userAgent.toLowerCase();
  //判断是否是苹果手机，是则是true
  let isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
  if (isIos) {
    return true
  }else {
    return false
  }
}
// 网络图像文件转Base64
export function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
  var dataURL = canvas.toDataURL("image/" + ext);
  return dataURL;
}
// Base64字符串转二进制
export function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
}
export function imgUrl(url) {
  if(url){
    if(url.slice(0,5)=="http:"){
      let newUrlArr=url.split(":");
      let newUrl = newUrlArr[0]+"s:"+newUrlArr[1];
      return newUrl
    }
    if(url.slice(0,5) == 'https'||url.slice(0,3)=="../ ")
    {return url;}else{return httpUrl+url;}
  }
}
export function reducerDate(msgTime) {
  const time = new Date(msgTime);
  const now = new Date();
  const msgYear = time.getFullYear();
  const nowYear = now.getFullYear();
  const nowHour = now.getHours();
  const nowMinute = now.getMinutes();
  const nowSecond = now.getSeconds();
  const nowTime = now.getTime();
  const todayTime = nowHour * 60 * 1000 * 60 + nowMinute * 1000 * 60 + nowSecond * 1000;
  const gapDate = (nowTime - todayTime - msgTime) / 1000 / 60 / 60 / 24;
  let showTime = '';
  if (msgYear !== nowYear) {
    showTime = 'year';
  } else if (gapDate > 6) {
    showTime = 'month';
  } else if (gapDate <= 6 && gapDate > 2) {
    showTime = 'day';
  } else if (gapDate <= 2 && gapDate > 1) {
    showTime = 'the day before';
  } else if (gapDate <= 1 && gapDate > 0) {
    showTime = 'yesterday';
  } else if (gapDate <= 0) {
    showTime = 'today';
  }
  return showTime;
}
export function stop(){
  var mo=function(e){e.preventDefault();};
  document.body.style.overflow='hidden';
  document.addEventListener("touchmove",mo,false);//禁止页面滑动
}
/***取消滑动限制***/
export function move(){
  var mo=function(e){e.preventDefault();};
  document.body.style.overflow='';//出现滚动条
  document.removeEventListener("touchmove",mo,false);
}
export function isToday(str) {
  console.log(str);
  let d = new Date(str.toString().replace(/-/g,"/"));
  let todaysDate = new Date();
  if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
    return true;
  } else {
    return false;
  }
}
export function isWx() {
  let ua = navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i)=="micromessenger") {
    return true
  }else {
    return false
  }
}
