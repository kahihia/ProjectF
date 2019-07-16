import Vue from 'vue'
import Router from 'vue-router'
import {routes} from "./routes"
import store from '@/store/index'
import {getLocalData,clearLocalData} from '@/utils/storages'
import {isEmptyObject,GetQueryString,isWx} from '@/utils/utils'
import {wx_grant} from '@/utils/wxInit'
import {setLocalData} from "../utils/storages";


Vue.use(Router);
const searchUrl = window.location.search.slice(1);
let arr = searchUrl.split('&');
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
const vueRouter = new Router({
  // mode:'history',
  routes: routes
});
vueRouter.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true});
  let user_info = getLocalData('user_info');
  gtag('js', new Date());
  gtag('config', 'UA-118661794-1',{'page_path': to.fullPath});
  let current_path=store.state.remix.is_current_path;
  next()
  if(!user_info){
    if (!isWx()){
      if (to.path === '/Login') {
        next()
      } else {
        next('/Login');
      }
    }else {
      if (to.path === '/Login') {
        next()
      }else {
        wx_grant().then(res=>{
          console.log(res,'userinfo');
          if(!res.phone){
            if (to.path === '/Verify') {
              next()
            } else {
              next('/Verify')
            }
          }else {
            next()
          }
        })
      }
    }
  }else {
    if(!user_info.phone){
      if (to.path === '/Verify') {
        next()
      } else {
        next('/Verify')
      }
    }else {
      if(searchUrl.indexOf('good_id=') !== -1){
        window.location.href = `${location.origin}/webapp/index.html#/goodsdetail?good_id=${GetQueryString('good_id')}&distance=${GetQueryString('distance')}`
      }else {
        if(user_info.is_merchants==0 && !current_path){
          next()
        }else if (user_info.is_merchants==1 && !current_path) {
          store.commit('updateCurrentPath',{is_current_path:true});
          if (to.path == '/merchantHome'||to.path=='/goodsdetail'||to.path=='/orderDetail') {
            next()
          } else {
            next('/merchantHome')
          }
          next()
        }else if(current_path){
          next()
        }
      }
      next()
    }
  }
});
vueRouter.afterEach(function (to) {
  store.commit('updateLoadingStatus', {isLoading: false})
});
export default vueRouter
