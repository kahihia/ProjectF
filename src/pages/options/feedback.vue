<template>
  <div id="feedback">
    <head_bar :backLast="true" :tab_c="true" :head="head" :bg_color="bg_color"></head_bar>
    <div class="content">
      <p class="c-b">亲，感谢您为我们提供宝贵的建议，我们会认真考虑的哟！</p>
      <div class="textArea">
        <textarea class="c-b" v-model="feedback_val" placeholder="可以在这儿写下想说的话~"></textarea>
      </div>
      <button class="submitBtn" v-show="canSubmit" @click="submitFeed">提交</button>
      <button class="cannotSub submitBtn" v-show="!canSubmit">提交</button>
    </div>
    <div class="notice" v-transfer-dom>
      <popup v-model="show_notice" position="top" :show-mask="false">
        <div class="position-vertical-demo">{{noticeMsg}}</div>
      </popup>
    </div>
  </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import {getLocalData} from '@/utils/storages';
  import request from '@/utils/request';
  import {Popup,TransferDomDirective as TransferDom} from 'vux';
  import {formatDateTime} from '@/utils/format';
    export default {
      name: "feedback",
      components:{head_bar,Popup},
      directives: {TransferDom},
      data(){
        return{
          head:'意见反馈',
          bg_color:'#f4f3f0',
          user_info:getLocalData('user_info'),//用户信息
          timeStamp:formatDateTime(new Date()),//时间戳
          canSubmit:false,
          feedback_val:'',
          show_notice:false,
          noticeMsg:'',
        }
      },
      watch:{
        feedback_val(val){
          if(val){
            this.canSubmit=true
          }else {
            this.canSubmit=false
          }
        }
      },
      methods:{
        submitFeed(){
          let params={
            user_id:this.user_info.id,
            feedback_content:this.feedback_val,
            timeStamp:this.timeStamp
          };
          request.userFeedback(params).then(res=>{
            this.show_notice=true;
            this.noticeMsg=res.data.message;
            setTimeout(()=>{
              this.$router.push({path:'/options'})
            },2000)
          })
        }
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
  @import "../../assets/less/reset";
  #feedback{
    width: 100%;
    background-color: @bg-b;
    min-height: 100%;
    padding-top: 90px;
    .content{
      padding: 20px 32px;
      .textArea{
        margin: 20px 0 60px;
        border: 1px solid @border_c;
        textarea{
          padding: 20px;
          background-color: @bg-c;
          display: block;
          width: 100%;
          height: 500px;
          border: none;
        }
      }
      .submitBtn{
        display: block;
        border: none;
        .mixin-setButton(500px,60px,@G1,@bg-d,24px,none);
        box-shadow: 0 5px 9px 0
        rgba(0, 1, 1, 0.14);
        .mixin-borderRadius(8px);
        margin: 0 auto;
      }
      .cannotSub{
        .mixin-setButton(500px,60px,@G6,@bg-i,24px,none);
      }
    }
  }
</style>
