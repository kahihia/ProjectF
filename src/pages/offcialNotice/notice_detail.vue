<template>
    <div id="notice_detail">
      <head_bar :backLast="true" :tab_c="true" :head="head" :bg_color="bg_color"></head_bar>
      <div class="content">
        <p class="c-a">
          {{content}}
        </p>
        <p class="time_wrap c-b">{{time}}</p>
      </div>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import {getLocalData} from '@/utils/storages';
  import request from '@/utils/request';
  import {formatDateTime} from '@/utils/format';
    export default {
      name: "notice_detail",
      components:{head_bar},
      data(){
        return{
          head:'消息详情',
          bg_color:'#f4f3f0',
          user_info:getLocalData('user_info'),
          timeStamp:formatDateTime(new Date()),//时间戳
          content:this.$route.query.content,
          time:this.$route.query.time,
        }
      },
      mounted() {
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed() {
        this.$store.commit('updateBottomNav', {showBottomNav: true})
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  #notice_detail{
    width: 100%;
    background-color: @bg-b;
    min-height: 100%;
    padding-top: 90px;
    .content{
      padding: 20px 32px;
      .time_wrap{
        text-align: right;
        margin-top: 20px;
      }
    }
  }
</style>
