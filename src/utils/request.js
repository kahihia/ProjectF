import Vue from 'vue'
import qs from 'qs'
import {signFn} from './sign'//签名

export default {
  getOpenId:(params)=>{ //微信授权接口
    return Vue.httpClient.post('Api/getOpenId', qs.stringify(params))
  },
  getJsSdk:(params)=>{ //微信分享配置接口
    return Vue.httpClient.post('Api/getJsSdk', qs.stringify(params))
  },
  payApiCall:(params)=>{ //微信支付配置接口
    return Vue.httpClient.post('WxjsAPI/payApiCall', qs.stringify(params))
  },
  orderQuery:(params)=>{ //查询订单
    return Vue.httpClient.post('WxjsAPI/orderQuery', qs.stringify(params))
  },
  getUserShareSystem:(params)=>{ //根据分类获取用户分享配置
    params.sign=signFn(params);//追加签名
    return Vue.httpClient.post('Api/getUserShareSystem', qs.stringify(params))
  },
  getJgSign:(params)=>{ //极光初始化
    params.sign=signFn(params);//追加签名
    return Vue.httpClient.post('Api/getJgSign', qs.stringify(params))
  },
  registerJgUser:(params)=>{ //注册极光
    params.sign=signFn(params);//追加签名
    return Vue.httpClient.post('Api/registerJgUser', qs.stringify(params))
  },
  getWebSystem:(params)=>{ //微信分享logo
    params.sign=signFn(params);//追加签名
    return Vue.httpClient.post('Api/getWebSystem', qs.stringify(params))
  },
  uploadOneImg:(params)=>{ //图片上传
    return Vue.httpClient.post('Api/uploadOneImg', qs.stringify(params))
  },
  sendMsg:(params)=>{ //验证手机号
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/sendMsg', qs.stringify(params))
  },
  checkMobileCode:(params)=>{ //验证验证码是否正确
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/checkMobileCode', qs.stringify(params))
  },
  register:(params)=>{ //注册
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/register',qs.stringify(params))
  },
  login:(params)=>{ //登陆
    params.sign=signFn(params);
    return Vue.httpClient.get('Api/login?'+qs.stringify(params))
  },
  getBanner:(params)=>{ //获取banner
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getBanner', qs.stringify(params))
  },
  // 用户相关
  getUserInfo:(params)=>{//获取用户信息
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getUserInfo', qs.stringify(params))
  },
  updateUserInfo:(params)=>{//修改用户信息
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/updateUserInfo', qs.stringify(params))
  },
  getAge:(params)=>{//获取年龄列表
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getAge', qs.stringify(params))
  },
  updateUserHeadImg:(params)=>{//换头像
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/updateUserHeadImg', qs.stringify(params))
  },
  uploadUserPhotoAlbum:(params)=>{//用户相册上传
    return Vue.httpClient.post('Api/uploadUserPhotoAlbum', qs.stringify(params))
  },
  deleteUserPhotoAlbum:(params)=>{//用户删除相册
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/deleteUserPhotoAlbum', qs.stringify(params))
  },
  getUserCoupons:(params)=>{//获取用户拥有优惠券
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getUserCoupons', qs.stringify(params))
  },
  getUserBill:(params)=>{//获取用户余额
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getUserBill', qs.stringify(params))
  },
  getUserBillLists:(params)=>{//获取用户余额明细
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getUserBillLists', qs.stringify(params))
  },
  getUserPhotoAlbum:(params)=>{//获取用户相册
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getUserPhotoAlbum', qs.stringify(params))
  },
  userFeedback:(params)=>{//用户反馈
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/userFeedback', qs.stringify(params))
  },
  getUserNotice:(params)=>{//获取用户系统通知
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getUserNotice', qs.stringify(params))
  },
  updateUserNotice:(params)=>{//更新用户通知状态
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/updateUserNotice', qs.stringify(params))
  },
  judgeUserNotice:(params)=>{//判断用户是否有通知
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/judgeUserNotice', qs.stringify(params))
  },
  // 商品相关
  getCategory:(params)=>{//获取分类列表
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getCategory', qs.stringify(params))
  },
  getActivity:(params)=>{//获取活动列表
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getActivity', qs.stringify(params))
  },
  getList:(params)=>{//获取活动列表
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getUserDynamic', qs.stringify(params))
  },
  getGoodslist:(params)=>{// 获取商品列表
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getGoodslist', qs.stringify(params))
  },
  getGoodsInfo:(params)=>{//商品详情
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getGoodsInfo', qs.stringify(params))
  },
  getMerchantsGoodsField:(params)=>{//获取商品拼团场次
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getMerchantsGoodsField', qs.stringify(params))
  },
  getGoodsOrderList:(params)=>{//获取商品订单列表
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getGoodsOrderList', qs.stringify(params))
  },
  userCollectionGoods:(params)=>{//用户收藏商品
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/userCollectionGoods', qs.stringify(params))
  },
  userCancelCollectionGoods:(params)=>{//用户取消收藏商品
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/userCancelCollectionGoods', qs.stringify(params))
  },
  getUserCollectionGoodsLists:(params)=>{//获取用户收藏商品列表
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getUserCollectionGoodsLists', qs.stringify(params))
  },
  getGoodsComments:(params)=>{//获取商品评价列表
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getGoodsComments', qs.stringify(params))
  },
  getGfGoodsComments:(params)=>{//获取官方商品评价列表
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getGfGoodsComments', qs.stringify(params))
  },
  addMerchantsGoods:(params)=>{//商铺添加商品
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/addMerchantsGoods', qs.stringify(params))
  },
  editMerchantsGoods:(params)=>{//修改商品信息
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/editMerchantsGoods', qs.stringify(params))
  },
  changeGoodsStatus:(params)=>{//商铺添加商品
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/changeGoodsStatus', qs.stringify(params))
  },
  getMerchantsCommentsRules:(params)=>{//商铺添加商品
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getMerchantsCommentsRules', qs.stringify(params))
  },
  getMerchantsGoodsDefaultTime:(params)=>{//获取商品默认拼团场次
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getMerchantsGoodsDefaultTime', qs.stringify(params))
  },
  getSimilarMerchantsGoodsLists:(params)=>{//获取相似商品
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getSimilarMerchantsGoodsLists', qs.stringify(params))
  },
  commentsMerchantsGoods:(params)=>{//用户评价商品
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/commentsMerchantsGoods', qs.stringify(params))
  },
  // 商铺相关
  joinMerchants:(params)=>{//商铺入驻申请
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/joinMerchants', qs.stringify(params))
  },
  editMerchantsStatus:(params)=>{//商铺入驻申请
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/editMerchantsStatus', qs.stringify(params))
  },
  getMerchantsBill:(params)=>{//商铺入驻申请
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getMerchantsBill', qs.stringify(params))
  },
  getMerchantsStatus:(params)=>{//获取商铺审核状态
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getMerchantsStatus', qs.stringify(params))
  },
  getMerchants:(params)=>{//商铺列表
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/MerchantsList', qs.stringify(params))
  },
  merchantsInfo:(params)=>{//店铺详情
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/MerchantsInfo', qs.stringify(params))
  },
  getMerchantsCoupons:(params)=>{//商铺优惠券列表
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getMerchantsCoupons', qs.stringify(params))
  },
  addMerchantsCoupons:(params)=>{//商铺添加优惠券
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/addMerchantsCoupons', qs.stringify(params))
  },
  getMerchantsCouponsInfo:(params)=>{//获取优惠券详情
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getMerchantsCouponsInfo', qs.stringify(params))
  },
  editMerchantsCoupons:(params)=>{//商铺修改优惠券
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/editMerchantsCoupons', qs.stringify(params))
  },
  deleteMerchantsCoupons:(params)=>{//商铺删除优惠券
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/deleteMerchantsCoupons', qs.stringify(params))
  },
  buyMerchantsGoods:(params)=>{//购买商铺商品
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/buyMerchantsGoods', qs.stringify(params))
  },
  userReceiveCoupons:(params)=>{//用户领取店铺优惠券
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/userReceiveMerchantsCoupons', qs.stringify(params))
  },
  editMerchants:(params)=>{//修改商铺信息
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/editMerchants', qs.stringify(params))
  },
  getMerchantsAlbum:(params)=>{//获取商铺相册列表
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getMerchantsPhotoAlbumLists', qs.stringify(params))
  },
  addMerchantsPhotoAlbum:(params)=>{//添加商铺相册
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/addMerchantsPhotoAlbum', qs.stringify(params))
  },
  deleteMerchantsPhotoAlbum:(params)=>{//添加商铺相册
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/deleteMerchantsPhotoAlbum', qs.stringify(params))
  },
  getMerchantsBillLists:(params)=>{//获取商铺余额明细
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getMerchantsBillLists', qs.stringify(params))
  },
  // 订单相关
  getGoodsOrderInfo:(params)=>{//获取商品订单详情
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getGoodsOrderInfo', qs.stringify(params))
  },
  sureSubmitGoodsOrder:(params)=>{//确认提交商品订单
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/sureSubmitGoodsOrder', qs.stringify(params))
  },
  cancelGoodsOrder:(params)=>{//取消订单
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/cancelGoodsOrder', qs.stringify(params))
  },
  cancelMerchantsGoodsBarcode:(params)=>{//核销商品核销码
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/cancelMerchantsGoodsBarcode', qs.stringify(params))
  },
  deleteGoodsOrder:(params)=>{//删除订单
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/deleteGoodsOrder', qs.stringify(params))
  },
  monitorMerchantsGoodsBarcode:(params)=>{//删除订单
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/monitorMerchantsGoodsBarcode', qs.stringify(params))
  },
  // 银行卡相关
  getBingBankLists:(params)=>{//获取绑定的银行卡列表
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getBingBankLists', qs.stringify(params))
  },
  addBingBankCard:(params)=>{//绑定银行卡
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/addBingBankCard', qs.stringify(params))
  },
  initiateWithdrawal:(params)=>{//发起提现
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/initiateWithdrawal', qs.stringify(params))
  },
  getUserBillInfo:(params)=>{//获取用户流水详情
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getUserBillInfo', qs.stringify(params))
  },
  getMerchantsBillInfo:(params)=>{//获取商铺流水详情
    params.sign=signFn(params);
    return Vue.httpClient.post('Api/getMerchantsBillInfo', qs.stringify(params))
  },
}
