import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import {getLocalData,clearLocalData} from '@/utils/storages'
import {isEmptyObject} from '@/utils/utils'
import {GetQueryString} from '@/utils/utils'
const test = () => import('@/pages/demo/test');
const cutImg = () => import('@/components/cut_img');
const addSelect = () => import('@/components/address_select');
const scroll_demo = () => import('@/pages/demo/scroll_demo');
const Login = () => import('@/pages/Login/Login');
const add = () => import('@/pages/Index/index');
const add2 = () => import('@/pages/Index/test');

const home = () => import('@/pages/home/home');
const goodsdetail = () => import('@/pages/goods/goods_detail');
const calendar = () => import('@/pages/goods/calendar');
const evaluate = () => import('@/pages/goods/evaluate');
const shopdetail = () => import('@/pages/shop/detail');
const Nearby = () => import('@/pages/Nearby/index');
const chat = () => import('@/pages/chat/index');
const chatIn = () => import('@/pages/chat/chatIn');
const options = () => import('@/pages/options/index');
const balance = () => import('@/pages/merchant/balance');
const withdrawal = () => import('@/pages/merchant/withdrawal');

const merchantHome = () => import('@/pages/merchant/merchant_home');
const merchantOpt = () => import('@/pages/merchant/merchants_option');
const auditFail = () => import('@/pages/merchant/audit_fail');
const confirmOrder = () => import('@/pages/order/order_confirm');
const orderDetail = () => import('@/pages/order/order_detail');
const orderList = () => import('@/pages/order/order_list');
const writeOffSuc = () => import('@/pages/order/writeOffSuc');

const editUser = () => import('@/pages/options/editUserInfo/index');
const upAlbum = () => import('@/pages/options/editUserInfo/upload_album');
const myCollection = () => import('@/pages/options/myCollection/index');
const userInfo = () => import('@/pages/options/userOperat/userInfo');
const feedback = () => import('@/pages/options/feedback');
const merchantGoods = () => import('@/pages/shopGoods/good_center');
const addGoods = () => import('@/pages/shopGoods/add_goods');
const setShop = () => import('@/pages/merchant/setShop');
const paymentList = () => import('@/pages/merchant/paymentList');
const paymentDetail = () => import('@/pages/merchant/paymentDetail');
const couponList = () => import('@/pages/merchant/coupon/coupon_list');
const addCoupon = () => import('@/pages/merchant/coupon/add_coupon');
const businessHours = () => import('@/pages/merchant/business_hours');
const Verify = () => import('@/pages/Login/Verify');
const bankCard = () => import('@/pages/bankCard/bank_card');
const cardList = () => import('@/pages/bankCard/card_list');
const search = () => import('@/pages/search/search');
const noticeList = () => import('@/pages/offcialNotice/notice_list');
const noticeDetail = () => import('@/pages/offcialNotice/notice_detail');
const square = () => import('@/pages/square/square');
Vue.use(Router);
const searchUrl = window.location.search.slice(1);
let arr = searchUrl.split('&');
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
const vueRouter = new Router({
  // mode:'history',
  routes: [
    // meta:{keepAlive: true}需要被缓存
    // meta: {requireAuth: true}添加该字段，表示进入这个路由是需要登录的
    {path: '/Login', name: 'Login', component: Login,meta:{index:0}},
    {path: '/', name: 'home', component: home,meta: {requireAuth: true,index:1}},
    {path: '/Nearby', name: 'Nearby', component: Nearby,meta:{index:1}},
    {path: '/square', name: 'square', component: square,meta:{index:1}},
    {path: '/chat', name: 'chat', component: chat,meta:{index:1}},
    {path: '/merchantChat', name: 'chat', component: chat,meta:{index:3}},
    {path: '/options', name: 'options', component: options,meta:{index:1}},
    {path: '/merchantHome', name: 'merchantHome', component: merchantHome,meta: {requireAuth: true,index: 3}},
    {path: '/test', name: 'test', component: test},
    {path: '/cutImg', name: 'cutImg', component: cutImg},
    {path: '/addSelect', name: 'addSelect', component: addSelect,meta:{keepAlive: true,index: 4}},
    {path: '/scroll_demo', name: 'scroll_demo', component: scroll_demo},
    {path: '/add', name: 'add', component: add},
    {path: '/add2', name: 'add2', component: add2},
    {path: '/goodsdetail', name: 'goodsdetail', component: goodsdetail,meta: {requireAuth: true}},
    {path: '/calendar', name: 'calendar', component: calendar ,meta:{index:3}},
    {path: '/shopdetail', name: 'shopdetail', component: shopdetail ,meta:{index:3}},
    {path: '/chatIn', name: 'chatIn', component: chatIn ,meta:{index:3}},
    {path: '/userInfo', name: 'userInfo', component: userInfo , meta:{requireAuth: true,index:3}},
    {path: '/feedback', name: 'feedback', component: feedback ,meta:{index:3}},
    {path: '/confirmOrder', name: 'confirmOrder', component: confirmOrder,meta:{index:3}},
    {path: '/orderList', name: 'orderList', component: orderList},
    {path: '/writeOffSuc', name: 'writeOffSuc', component: writeOffSuc},
    {path: '/editUser', name: 'editUser', component: editUser,meta:{index:2}},
    {path: '/myCollection', name: 'myCollection', component: myCollection,meta:{index:2}},
    {path: '/merchantGoods', name: 'merchantGoods', component: merchantGoods,meta:{index:3}},
    {path: '/addGoods', name: 'addGoods', component: addGoods,meta:{index:4}},
    {path: '/setShop', name: 'setShop', component: setShop,meta:{keepAlive: true,index:2}},
    {path: '/paymentList', name: 'paymentList', component: paymentList},
    {path: '/paymentDetail', name: 'paymentDetail', component: paymentDetail},
    {path: '/orderDetail', name: 'orderDetail', component: orderDetail},
    {path: '/merchantOpt', name: 'merchantOpt', component: merchantOpt,meta:{index:3}},
    {path: '/auditFail', name: 'auditFail', component: auditFail},
    {path: '/upAlbum', name: 'upAlbum', component: upAlbum},
    {path: '/couponList', name: 'couponList', component: couponList},
    {path: '/addCoupon', name: 'addCoupon', component: addCoupon},
    {path: '/balance', name: 'balance', component: balance},
    {path: '/withdrawal', name: 'withdrawal', component: withdrawal},
    {path: '/evaluate', name: 'evaluate', component: evaluate},
    {path: '/businessHours', name: 'businessHours', component: businessHours},
    {path: '/Verify', name: 'Verify', component: Verify},
    {path: '/bankCard', name: 'bankCard', component: bankCard},
    {path: '/cardList', name: 'cardList', component: cardList},
    {path: '/search', name: 'search', component: search},
    {path: '/noticeList', name: 'noticeList', component: noticeList,meta:{index:2}},
    {path: '/noticeDetail', name: 'noticeDetail', component: noticeDetail,meta:{index:3}},
  ]
});
vueRouter.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true});
  let user_info = getLocalData('user_info');
  gtag('js', new Date());
  gtag('config', 'UA-118661794-1',{'page_path': to.fullPath});
  // 判断该路由是否需要登录权限
  if (to.meta.requireAuth) if (!isEmptyObject(user_info)) {
    let current_path=store.state.remix.is_current_path;
    if (to.path === '/Login') {
      clearLocalData('user_info');
      location.reload()
    }
    // 判断是否验证手机号
    if(!user_info.phone){
      if(to.path === '/Verify'){
        next()
      }else {
        next({path:'/Verify'})
      }
    }else {
      next()
    }
    if(searchUrl.indexOf('good_id=') !== -1){
      window.location.href = `${location.origin}/webapp/index.html#/goodsdetail?good_id=${GetQueryString('good_id')}&distance=${GetQueryString('distance')}`
    }else {
      if(user_info.is_merchants==0&&!current_path){
        if(to.path==='/'|| to.path==='/goodsdetail'){
          next()
        }else {
          next({path:'/'})
        }
      }else if(user_info.is_merchants==1&&!current_path){
        store.commit('updateCurrentPath',{is_current_path:true});
        if(to.path==='/merchantHome'|| to.path==='/goodsdetail'){
          next()
        }else {
          next({path:'/merchantHome'})
        }
      }else if(current_path){
        next()
      }
    }
    next()
  } else{
    if (to.path !== '/Login' && isEmptyObject(user_info)) {
      return next({path: '/Login'})
    }
    next()
  }else {
    next();
  }
});
vueRouter.afterEach(function (to) {
  store.commit('updateLoadingStatus', {isLoading: false})
});
export default vueRouter
