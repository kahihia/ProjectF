<template>
  <div id="Chat">
    <head_bar :headTitle="head_title" :tab_d_img="2" :tab_d="tab_d" :bg_color="bg_color"></head_bar>
    <div class="chatList">
      <div class="chat_item list_style marginB8" v-for="(item,index) in conversation.coverData" @click="inChat(item[0].to_nickname,item[0].to_img,item[0].to_username,index)">
        <div class="head_box marginR22">
          <i class="red_point" v-if="item[0].unRead"></i>
          <img class="mixin-img" :src="item[0].to_img" :onerror="$store.state.remix.errorHeadImg">
        </div>
        <div class="abstract">
          <div class="other_name marginB12">
            <div class="t-b-b name ellipsis">
              <em class="shop_sign d-a marginR6" v-if="item[0].is_merchant">shop</em>
              <span>{{item[0].to_nickname}}</span>
            </div>
            <span class="c-b">刚刚</span>
          </div>
          <div class="c-d">{{item[0].sourceMsg}}</div>
        </div>
      </div>
      <div class="c-b mixin-center" v-show="!conversation.coverData">暂无会话</div>
    </div>
  </div>
</template>
<script>
  import head_bar from '@/components/head_bar'
  import {setLocalData,getLocalData} from '@/utils/storages';
  import { mapState,mapActions } from 'vuex'
    export default {
      name: "index",
      components:{head_bar},
      data(){
        return{
          head_title:'会话',
          tab_d:true,
          chat_list:[],
          bg_color:'#f4f3f0',//头部背景色
        }
      },
      watch:{
        conversation(val){
        }
      },
      computed: {
        ...mapState({
          JIM: state => state.chat.JIM,
          conversation: state => state.chat.conversation,
        }),
        ...mapActions(['onMsgReceive']),
      },
      methods:{
        inChat(to_nickname,head_img,to_username,index){
          this.$router.push({
            path:'/chatIn',
            query:{
              to_nickname:to_nickname,//接收者昵称
              urlImg:head_img,//接收者头像
              to_username:to_username,//接收者用户名
            }
          })
        },
      },
      created(){
        this.$store.commit('selectedTab',{tab_index:2});
        this.onMsgReceive
      },
    }
</script>

<style lang="less" scoped>
  @import '../../assets/less/reset';
  .marginT12{margin-top: 12px}
  .marginR22{margin-right: 22px}
  .marginR6{margin-right: 6px}
  .marginB12{margin-bottom: 12px}
  .marginB8{margin-bottom: 8px}
  #Chat{
    height: 100%;
    background-color: @bg-b;
    padding-top: 90px;
    .chatList{
      width: 689px;
      margin: 11px auto 0 auto;
      .chat_item{
        display: flex;
        width: 100%;
        height: 165px;
        padding: 31px 31px 35px 25px;
        .head_box{
          position: relative;
          .radius_img(100px,100px);
          .red_point{
            position: absolute;
            top: 4px;
            right: 5px;
            display: block;
            width: 21px;
            height: 21px;
            .mixin-borderRadius(50%);
            background-color: @hot;
          }
        }
        .abstract{
          flex: 0 0 80%;
          .other_name{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .name{
              max-width: 340px;
              display: flex;
              align-items: center;
              .shop_sign{
                display: inline-block;
                text-align: center;
                width: 54px;
                height: 28px;
                line-height: 28px;
                background-color: @sign_bg;
                .mixin-borderRadius(12px)
              }
            }
          }
        }
      }
    }
  }
</style>
