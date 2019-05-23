<template>
  <div id="backCard">
    <head_bar :backLast="true" :tab_c="true" :head="head" :bg_color="bg_color"></head_bar>
    <div class="content">
      <p class="c-j title">请绑定持卡人本人的银行卡</p>
      <div class="card_wrap card">
        <div class="input_wrap">
          <label for="cardholder" class="item_label c-a">持卡人</label>
          <input id="cardholder" class="item_input c-Bc" type="text"
                 placeholder="请输入持卡人姓名" v-model="bank_card.bank_card_account_holder">
        </div>
        <div class="input_wrap">
          <label for="card_num" class="item_label c-a">卡号</label>
          <input id="card_num" class="item_input c-Bc" type="text"
                 placeholder="请输入银行卡号" v-model="bank_card.bank_card_no">
        </div>
        <div class="input_wrap">
          <label for="phone_num" class="item_label c-a">手机号</label>
          <input id="phone_num" class="item_input c-Bc" type="text"
                 placeholder="请输入手机号" v-model="bank_card.bank_card_phone">
        </div>
      </div>
      <button class="no_confirm" v-show="!can_confirm">立即提交</button>
      <button class="confirm_wrap" v-show="can_confirm" @click="addBankCard">立即提交</button>
    </div>
    <div class="notice" v-transfer-dom>
      <popup v-model="show_notice" position="top" :show-mask="false">
        <div class="position-vertical-demo">{{noticeMsg}}</div>
      </popup>
    </div>
  </div>
</template>

<script>
  import head_bar from '@/components/head_bar';
  import {getLocalData} from '@/utils/storages';
  import request from '@/utils/request';
  import {formatDateTime} from '@/utils/format';
  import {Popup,TransferDomDirective as TransferDom} from 'vux';
    export default {
      name: "bank_card",
      directives: {TransferDom},
      components:{head_bar,Popup},
      data(){
        return{
          head:'添加银行卡',
          bg_color:'#f4f3f0',
          bank_card:{
            user_id:getLocalData('user_info').id,
            bank_card_account_holder:'',
            bank_card_no:'',
            bank_card_phone:'',
            timeStamp:formatDateTime(new Date()),
          },
          can_confirm:false,//按钮
          show_notice:false,//显示提示
          noticeMsg:'',//提示信息
          last_path:this.$route.query.last_path,
          role:this.$route.query.role,
        }
      },
      watch:{
        show_notice(val){
          if(val){
            setTimeout(() => {
              this.show_notice = false
            },2000)
          }
        },
        bank_card: {
          handler: function() {
            this.isWriteAll()
          },
          deep: true
        },
      },
      methods:{
        isWriteAll(){
          if(this.bank_card.bank_card_account_holder&&
            this.bank_card.bank_card_no&&this.bank_card.bank_card_phone){
            this.can_confirm=true;
          }else {
            this.can_confirm=false;
          }
        },
        addBankCard(){
          let params=this.bank_card;
          if(this.regularStr(params.bank_card_account_holder,'ch')&&
            this.regularStr(params.bank_card_no,'bank_card')&&
            this.regularStr(params.bank_card_phone,'phone')){
            request.addBingBankCard(params).then(res=>{
              this.show_notice=true;
              this.noticeMsg=res.data.message;
              if(res.data.code===200){
                setTimeout(() => {
                  this.$router.push({path:this.last_path,query:{role:this.role}})
                },2000)
              }
            })
          }else {
            if(!this.regularStr(params.bank_card_account_holder,'ch')){
              this.show_notice=true;
              this.noticeMsg='名称请输入中文';
            }else if(!this.regularStr(params.bank_card_no,'bank_card')){
              this.show_notice=true;
              this.noticeMsg='请输入正确格式的银行卡';
            }else if(!this.regularStr(params.bank_card_phone,'phone')){
              this.show_notice=true;
              this.noticeMsg='请输入正确格式的手机号';
            }
          }
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
  .card{
    background-color: @bg-c;
    box-shadow: 0 0 15px 0
    rgba(0, 1, 1, 0.05);
    .mixin-borderRadius(10px)
  }
  #backCard{
    width: 100%;
    background-color: @bg-b;
    min-height: 100%;
    padding-top: 90px;
    .content{
      padding: 0 32px;
      .title{
        padding: 20px;
      }
      .card_wrap{
        padding: 0 20px;
        margin-bottom: 30px;
        .input_wrap{
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 30px 0;
          border-bottom: 1px solid @border_c;
          .item_input{
            flex: 0 0 76%;
            display: inline-block;
            border: none;
          }
        }
      }
      .no_confirm{
        display: block;
        margin: 0 auto;
        .mixin-setButton(500px,60px,@G2,@bg-i,24px,none);
        .mixin-borderRadius(8px);
        border: none;
      }
      .confirm_wrap{
        display: block;
        margin: 0 auto;
        .mixin-setButton(500px,60px,@G1,@bg-d,24px,none);
        .mixin-borderRadius(8px);
        border: none;
      }
    }
  }
</style>
