<template>
  <div id="app">
    <loading :show="isLoading"></loading>
    <!--<suspend_ball></suspend_ball>-->
      <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    <foot_bar v-if="$store.state.tabbar.showBottomNav"></foot_bar>
  </div>
</template>

<script>
  import foot_bar from '@/components/foot_bar'
  import suspend_ball from '@/components/suspend_ball'
  import { Loading } from 'vux'
  import { mapState,mapActions } from 'vuex'
  import {wx_grant,wx_config} from '@/utils/wxInit'
  import {location,GetQueryString,isWx} from '@/utils/utils'
  import {getLocalData} from '@/utils/storages'
  import AMap from '@/utils/AMap'
  import {setLocalData} from "./utils/storages";
  export default {
    name: 'App',
    components: {
      Loading,
      foot_bar,
      suspend_ball
    },
    data(){
      return{
        user_info:getLocalData('user_info'),//用户信息
        is_login:true,
        transitionName:'',
      }
    },
    watch: {//使用watch 监听$router的变化
      $route(to, from) {
        //如果to索引大于from索引,判断为前进状态,反之则为后退状态
        if (to.meta.index > from.meta.index) {
          //设置动画名称
          this.transitionName = 'slide-left';
        } else if(to.meta.index===from.meta.index){
          this.transitionName=''
        }else {
          this.transitionName = 'slide-right'
        }
      },
    },
    created(){
      this.localData();
      // this.is_weixn();
      this.getUrl()
    },
    mounted(){
      // this.initJIM
    },
    computed: {
      ...mapState({
        isLoading: state => state.remix.isLoading,
        is_init: state => state.remix.is_init,
        JIM: state => state.chat.JIM,
      }),
      // ...mapActions(['initJIM']),
    },
    methods:{
      localData(){
        //本地判断
        // let hrefL = location.href;
        // let routerLink = hrefL.slice(7,16);
        // console.log(routerLink);
        // localStorage.setItem('user_info',JSON.stringify({"id":"174","user_name":"痴痴醉","password":null,"id_card":"511223555433345654","openid":"ofgtxxG1QbDTnj5fjVtNJWzm8KEk","unionid":"obFBn1C1f9OnN4OeNRaF87MrfrzQ","registration_id":"100d8559091002a431d","is_jg_send":"1","jiguang_register_status":"1","real_name":"Tyler","phone":"18782271516","qq":null,"email":null,"age":"90后","sex":"1","head_img":"/Upload/2018/07/31/5b60184dd7be3.jpg","address":"四川省-成都市-锦江区","subscribe":"1","is_robot":"0","source":null,"is_over_source_task":"0","status":"1","inputtime":"2018-04-28 20:29:08","lost_login_time":"2018-09-05 15:00:56","personality_sign":"啦啦啦啦啦","is_official":"0","is_merchants":"1","character":"","love_status":null,"register_source":"WeChat","credit_number":"80","attention_number":0,"fans_number":0,"activity_number":34,"merchants_id":"3"}))
      // localStorage.setItem('position',JSON.stringify({"type":"complete","info":"SUCCESS","status":1,"Eia":"jsonp_466044_","position":{"P":30.58794,"O":104.05358000000001,"lng":104.05358,"lat":30.58794},"message":"Get geolocation time out.Get ipLocation success.Get address success.","location_type":"ip","accuracy":null,"isConverted":true,"addressComponent":{"citycode":"028","adcode":"510107","businessAreas":[],"neighborhoodType":"","neighborhood":"","building":"","buildingType":"","street":"府城大道西段","streetNumber":"127号","province":"四川省","city":"成都市","district":"武侯区","township":"石羊场街道"},"formattedAddress":"四川省成都市武侯区石羊场街道府城大道西段127号仁和春天国际广场","roads":[],"crosses":[],"pois":[]}));
        // if(routerLink == 'localhost'){
        // localStorage.setItem('user_info',JSON.stringify({"id":"175","user_name":"晚丶礼服","password":null,"id_card":null,"openid":"ofgtxxG1QbDTnj5fjVtNJWzm8KEk","unionid":"obFBn1C1f9OnN4OeNRaF87MrfrzQ","real_name":null,"phone":"18483692324","qq":null,"email":null,"age":null,"sex":"1","head_img":"/Upload/2018/07/31/5b601b635b62b.jpg","address":"四川省-南充市-南部县","subscribe":"0","is_robot":"0","source":null,"status":"1","inputtime":"2018-04-28 20:29:08","lost_login_time":"2018-06-06 12:44:47","personality_sign":"","is_official":"0","love_status":null,"attention_number":2,"fans_number":1}))
        // localStorage.setItem('user_info',JSON.stringify({"id":"174","user_name":"痴痴醉","password":null,"id_card":"511223555433345654","openid":"ofgtxxG1QbDTnj5fjVtNJWzm8KEk","unionid":"obFBn1C1f9OnN4OeNRaF87MrfrzQ","registration_id":"100d8559091002a431d","is_jg_send":"1","jiguang_register_status":"1","real_name":"Tyler","phone":"18782271516","qq":null,"email":null,"age":"90后","sex":"1","head_img":"/Upload/2018/07/31/5b60184dd7be3.jpg","address":"四川省-成都市-锦江区","subscribe":"1","is_robot":"0","source":null,"is_over_source_task":"0","status":"1","inputtime":"2018-04-28 20:29:08","lost_login_time":"2018-09-05 15:00:56","personality_sign":"啦啦啦啦啦","is_official":"0","is_merchants":"1","character":"","love_status":null,"register_source":"WeChat","credit_number":"80","attention_number":0,"fans_number":0,"activity_number":34,"merchants_id":"3"}))
        // }
        // end
      },
      getUrl(){
        console.log(window.location.href);
        if(isWx()){
          wx_config();
        }
        let httpUrl = window.location.href;
        setLocalData("come_url",httpUrl)
      },
      location(){
        AMap.init().then(AMap => {
          location(AMap)
        });
      },
      callback(){
        let that = this;
        httpUrl = getLocalData('http_url');
        location.href=httpUrl
      },
      // is_weixn(){
      //   let that = this;
      //   let ua = navigator.userAgent.toLowerCase();
      //   if(ua.match(/MicroMessenger/i)=="micromessenger") {
      //     wx_grant(that.callback);
      //     wx_config();
      //   }else {
      //     // this.location()
      //     let source = GetQueryString("source");
      //     if(source){
      //       this.$store.commit('updateSource',{source:source});
      //     }
      //   }
      // }
    },
}
</script>

<style lang="less">
  *{
    margin: 0;
    padding: 0;
  }
  html, body {
    height: 100%;
    width: 100%;
    -webkit-overflow-scrolling: touch;
  }
  @import '~vux/src/styles/1px.less';
  #app {
    height: 100%;
    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
      will-change: transform;
      transition: all 500ms;
      position: absolute;
    }
    .slide-right-enter {
      opacity: 0;
      transform: translate3d(-100%, 0, 0);
    }
    .slide-right-leave-active {
      opacity: 0;
      transform: translate3d(100%, 0, 0);
    }
    .slide-left-enter {
      opacity: 0;
      transform: translate3d(100%, 0, 0);
    }
    .slide-left-leave-active {
      opacity: 0;
      transform: translate3d(-100%, 0, 0);
    }
}
</style>
