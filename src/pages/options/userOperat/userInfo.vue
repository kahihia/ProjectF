<template>
  <div id="userInfo">
    <head_bar :backLast="true" :tab_c="true" :bg_color="bg_color"></head_bar>
    <div class="Header" :style="{background:'url('+UserImg+') center/cover no-repeat'}">
      <div class="UserImg">
        <img :src="imgUrl(user_info.head_img)" class="mixin-img">
      </div>
      <div class="UserName input_title">{{user_info.user_name}}</div>
      <div class="UserAddress e_d">
        <img src="../images/icon_Wlocation.png" alt="">{{user_info.address}}
      </div>
      <div class="UserSelect">
        <div>关注</div>
        <div>私聊</div>
      </div>
      <div class="UserList">
        <div>
          <div class="Number input_title">{{user_info.attention_number}}</div>
          <div class="type c-l">关注</div>
        </div>
        <div>
          <div class="Number input_title">{{user_info.fans_number}}</div>
          <div class="type c-l">粉丝</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import {formatDateTime} from '@/utils/format';
  import request from '@/utils/request';
  import {getLocalData} from '@/utils/storages';
    export default {
      name: "userInfo",
      components:{head_bar},
      data() {
        return {
          UserImg:require('../images/head_bg.png'),
          bg_color:'rgba(0,0,0,0)',
          user_info:{},
          user_params:{
            id:this.$route.query.user_id,//被查看者id
            examine_user_id:String(getLocalData('user_info').id),//查看者id
            timeStamp:formatDateTime(new Date()),//时间戳
          },
        }
      },
      methods:{
        getUserInfo(){
          request.getUserInfo(this.user_params).then(res=>{
            this.user_info=res.data.data;
          })
        }
      },
      created(){
        this.getUserInfo()
      },
      mounted(){
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed(){
        this.$store.commit('updateBottomNav', {showBottomNav: true});
      }
    }
</script>

<style lang="less" scoped>
  @import "../../../assets/less/reset";
  #userInfo{
    width: 100%;
    overflow: hidden;
    .Header{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
      box-sizing: border-box;
      .UserImg{
        margin-top: 70px;
        width: 120px;
        height: 120px;
        background-color: #ffe035;
        box-shadow: 0 13px 17px 0
        rgba(0, 1, 1, 0.25);
        .mixin-borderRadius(50%);
        overflow: hidden;
      }
      .UserName{
        line-height: 40px;
        margin: 20px 0 10px;
      }
      .UserAddress{
        display: flex;
        align-items: center;
        line-height: 40px;
        img{
          width: 18px;
          height: 23px;
          margin-right: 10px;
        }
      }
      .UserSelect{
        display: flex;
        justify-content: flex-start;
        margin: 40px 0;
        div{
          width: 100px;
          border-radius: 8px;
          border: solid 2px @border_g;
          font-size: 24px;
          text-align: center;
          line-height: 40px;
          color: #ffffff;
          margin: 0 20px;
        }
      }
      .UserList{
        display: flex;
        justify-content: flex-start;
        line-height: 40px;
        div{
          width: 120px;
          text-align: center;
        }
      }
    }
  }
</style>
