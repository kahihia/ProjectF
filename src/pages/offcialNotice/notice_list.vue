<template>
  <div id="notice_list">
    <head_bar :backLast="true" :tab_c="true" :head="head" :bg_color="bg_color">
    </head_bar>
    <div class="content">
      <div class="notice_wrap">
        <div class="notice_item card ellipsis" v-show="notice_list.length>0" v-for="(item,index) in notice_list" @click="toNtcDetail(item)">
          <div class="circle" v-show="item.is_see==0">
          </div>
          <span class="c-a">{{item.notice_content}}</span>
        </div>
        <div class="c-b mixin-center" v-show="notice_list.length==0">{{notice_data.message}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import {getLocalData} from '@/utils/storages';
  import request from '@/utils/request';
  import {formatDateTime} from '@/utils/format';
    export default {
      name: "notice_list",
      components:{head_bar},
      data(){
        return{
          head:'系统消息',
          bg_color:'#f4f3f0',
          user_info:getLocalData('user_info'),
          timeStamp:formatDateTime(new Date()),//时间戳
          notice_list:[],
          notice_data:[],
        }
      },
      methods:{
        getNotice(){
          let params={
            user_id:this.user_info.id,
            timeStamp:this.timeStamp
          };
          request.getUserNotice(params).then(res=>{
            this.notice_list=res.data.data;
            this.notice_data=res.data;
          })
        },
        toNtcDetail(item){
          // updateUserNotice
          let params={
            id:item.id,
            timeStamp:this.timeStamp
          };
          if(item.is_see==0){
            request.updateUserNotice(params).then(res=>{
              this.$router.push({path:'/noticeDetail',query:{content:item.notice_content,time:item.inputtime}})
            })
          }else if(item.is_see==1){
            this.$router.push({path:'/noticeDetail',query:{content:item.notice_content,time:item.inputtime}})
          }
        }
      },
      mounted() {
        this.getNotice();
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed() {
        this.$store.commit('updateBottomNav', {showBottomNav: true})
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  .card{
    background-color: @W1;
    box-shadow: 0 0 15px 0
    rgba(0, 1, 1, 0.05);
    .mixin-borderRadius(10px);
  }
  #notice_list{
    width: 100%;
    background-color: @bg-b;
    min-height: 100%;
    padding-top: 90px;
    .content{
      padding: 20px 32px;
      .notice_wrap{
        .notice_item{
          position: relative;
          width: 100%;
          padding: 20px 20px;
          margin-bottom: 20px;
          &:last-child{
            margin-bottom: 0;
          }
          .circle{
            position: absolute;
            right: 0;
            width: 10px;
            height: 10px;
            background-color: @hot;
            .mixin-borderRadius(50%);
          }
        }
      }
    }
  }
</style>
