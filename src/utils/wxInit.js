import wx from 'weixin-js-sdk'
import {formatDateTime} from './format'
import request from './request'
import {GetQueryString} from './utils'
import {setLocalData,getLocalData} from './storages'
import {baseURL} from '@/utils/api'
import {isEmptyObject} from '@/utils/utils'
let linkUrl = baseURL.split('Api')[0];
let user_info = getLocalData('user_info');
let appId = 'wx7b0e83e677e7f200';//正式环境
// let appId = 'wx1266e20b2e350f18';//测试环境
let httpUrl = location.href;
let localUrl = '';
httpUrl.indexOf('#')!== -1?localUrl=httpUrl.split('#')[0]:localUrl=httpUrl.split('?')[0];//获取锚点之前的链接
// 查询订单微信支付状态
function orderQuery(id,payCb) {
  let params = {goods_order_id:id};
  request.orderQuery(params).then(res=>{
    var revert = res.data;
    if(revert.code==200){
      payCb?payCb():''
    }else if(revert.code==301){
      orderQuery(id,payCb)
    }
  })
}
export function wx_grant(callback) {
  //获取code||source||is_img
  let code = GetQueryString("code");
  let source = GetQueryString("source");
  let is_img = GetQueryString("is_img");
  let userInfo = getLocalData('user_info');//获取本地用户信息
  let newSource = '';
  if(source){
    newSource = source;
    setLocalData('source',newSource)
  }else {
    newSource=''
  }
  if(!userInfo){
    if(code){
      let params = {code: code,source: newSource,is_img: is_img};
      request.getOpenId(params).then((data)=>{
        if (data.data.code == 200) {
          setLocalData('user_info',data.data.data);
          userInfo = getLocalData('user_info');//获取本地用户信息
          // callback();
          location.href = linkUrl + 'webapp/index.html';
          if (userInfo.subscribe == 0) {}//未关注公众号
        }
      });
    } else {
      let type = GetQueryString('type');
      let http_url = {
        type:type,
        httpUrl:httpUrl
      };
      setLocalData('http_url',http_url);
      let redirectUri = encodeURIComponent(location.href + "?source=");
      location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
        + appId
        + '&redirect_uri='
        + redirectUri + newSource + '&response_type=code&scope=snsapi_userinfo&state=0220#wechat_redirect';
    }
  }else {
    callback()
  }
}
export function wx_config() {
  let params = {url:localUrl};
  request.getJsSdk(params).then((res)=>{
    let res_conf = res.data.data;
    wx.config({
      debug: false,
      appId: res_conf.appId,
      timestamp: res_conf.timestamp,
      nonceStr: res_conf.nonceStr,
      signature: res_conf.signature,
      jsApiList: ['scanQRCode','onMenuShareTimeline', 'onMenuShareAppMessage','onMenuShareWeibo','getLocation','openLocation']
    });
    getLocation()
  })
}
export function wxShare(options,callback) {
  let share_option = {
    title: options.title, // 分享标题
    desc: options.info, // 分享描述
    link: options.newUrl, // 分享链接
    imgUrl: options.img, // 分享图标
    success: function() {
      callback?callback():'';
      alert("分享成功")
    },
    cancel: function() {
      alert("分享失败,您取消了分享!")
    }
  };
  wx.ready(function() {
    wx.onMenuShareTimeline(share_option);
    //微信分享菜单测试
    wx.onMenuShareAppMessage(share_option);
    wx.onMenuShareQQ(share_option);
    wx.onMenuShareWeibo(share_option);
  });
}
export function wxQRCode(callback,errorBack) {
  wx.ready(function () {
    wx.scanQRCode({
      // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
      needResult: 1,
      desc: 'scanQRCode desc',
      success: function (res) {
        console.log(res.resultStr);
        let params = JSON.parse(res.resultStr);
        params.merchants_id = user_info.merchants_id;
        request.cancelMerchantsGoodsBarcode(params).then(res => {
          if (res.data.code == 200) {
            callback()
          } else {
            errorBack(res.data.message)
          }
        })
      }
    })
  })
}
export function wxPayment(order_id,payCancel,payCb) {
  let userInfo = getLocalData('user_info');
  console.log(userInfo,'userInfo');
  let params = {
    user_id:userInfo.id,
    goods_order_id:order_id,
    pay_type:'WX_JSAPI',
  };
  request.payApiCall(params).then(res=>{
    var revert = res.data;
    if(revert.code==200){
      wx.config({
        debug: false, // 开启调试模式,成功失败都会有alert框
        appId: revert.data.appId, // 必填，公众号的唯一标识
        timestamp: revert.data.timeStamp, // 必填，生成签名的时间戳
        nonceStr: revert.data.nonceStr, // 必填，生成签名的随机串
        signature: revert.data.paySign,// 必填，签名
        jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表x
      });
      wx.ready(function () {
        wx.chooseWXPay({
          "appId": revert.data.appId,//公众号名称，由商户传入
          "timestamp": revert.data.timeStamp, //时间戳，自1970年以来的秒数
          "nonceStr": revert.data.nonceStr, //随机串
          "package": revert.data.package,
          "signType": revert.data.signType,  //微信签名方式：
          "paySign": revert.data.paySign,   //微信签名
          "body":'',
          success: function(res) {
            // 支付成功后的回调函数
            if (res.errMsg == "chooseWXPay:ok") {
              orderQuery(order_id,payCb);
            } else {
              alert('失败');
            }
          },
          cancel: function(res) {
            payCancel?payCancel():''
          },
          fail:function () {
            alert('支付失败');
            payCancel?payCancel():''
          }
        });
      });
      wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        alert('支付失败');
        payCancel?payCancel():''
      });
    }else if(revert.code==401){
      alert(revert.message);
      payCancel?payCancel():'';
      window.location.href='https://www.findif.cn/Wx/getFirst?user_id='+ userInfo.id + '&order_id=' + order_id
    }else {
      alert(revert.message);
      payCancel?payCancel():''
    }
  })
}
function getLocation() {
  wx.ready(function(){
    wx.getLocation({
      type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        console.log('定位中');
        let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        let speed = res.speed; // 速度，以米/每秒计
        let accuracy = res.accuracy; // 位置精度
        let params={
          position:{
            lat: latitude,
            lng:longitude
          }
        };
        setLocalData('position',params);
        console.log(params)
      },
      fail: function (error) {
      },
      cancel: function (res) {
        alert("无法获取您的城市信息,请允许获取您的位置信息!");
      }
    });
  })
}
export function openLocation(lat,lng,addr,detail,url) {
  wx.openLocation({
    latitude: parseFloat(lat), // 纬度，浮点数，范围为90 ~ -90
    longitude: parseFloat(lng), // 经度，浮点数，范围为180 ~ -180。
    name: addr, // 位置名
    address: detail, // 地址详情说明
    scale: 14, // 地图缩放级别,整形值,范围从1~28。默认为最大
    infoUrl: url // 在查看位置界面底部显示的超链接,可点击跳转
  });
}
