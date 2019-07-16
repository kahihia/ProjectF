<template>
    <div id="withdrawal">
      <head_bar :backLast="back_last" :tab_c="true" :head="head" :bg_color="bg_color"></head_bar>
      <div class="content">
        <group v-show="bank_list.length>0">
          <popup-picker class="card_wrap card c-b" ref="card_wrap" :data="bank_list" :columns="1"
                        :placeholder="place_holder" value-text-align="left" v-model="choose_card" show-name @on-hide="chooseCard">
            <!--<div v-show="bank_list.length>0&&show_title" class="bank_info" slot="title">-->
              <!--<div class="c-j"><span>尾号</span><span>储蓄卡</span></div>-->
            <!--</div>-->
          </popup-picker>
        </group>
        <div v-show="bank_list.length<=0" class="card_wrap card" @click="toAddBank">
          <div class="left_wrap">
            <!--<img src="./images/icon_bank.png" >-->
            <!--<div class="bank_info">-->
              <!--<p class="c-a">中国农业银行</p>-->
              <!--<div class="c-j"><span>尾号</span><span>储蓄卡</span></div>-->
            <!--</div>-->
            <div class="bank_info">
              <p class="c-a">{{message}}</p>
            </div>
          </div>
          <div class="right_wrap">
            <img src="./images/icon_left.png" >
          </div>
        </div>
        <div class="money_wrap card">
          <div class="title c-b">提现金额</div>
          <div class="input_money">
            <label for="balance_input" class="c-Bf">￥</label>
            <input id="balance_input" class="c-Bf" type="text" v-model="amount"
                   @input="handleInput">
          </div>
          <div class="down_wrap">
            <span class="c-j">可用余额 {{bill}}元</span>
            <em class="c-s get_all" @click="withdrawalAll">全部提现</em>
          </div>
        </div>
        <button class="no_confirm" v-show="!can_confirm" @click="withdrawalMsg">预计24小时到账，确认提现</button>
        <button class="confirm_wrap" v-show="can_confirm" @click="withdrawal">预计24小时到账，确认提现</button>
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
  import {formatDateTime} from '@/utils/format';
  import {PopupPicker,Group,Popup,TransferDomDirective as TransferDom} from 'vux';
    export default {
      name: "withdrawal",
      directives: {TransferDom},
      components:{head_bar,PopupPicker,Group,Popup},
      data(){
        return{
          back_last:true,
          head:'提现',
          bg_color:'#f4f3f0',
          user_info:getLocalData('user_info'),//用户信息
          timeStamp:formatDateTime(new Date()),//时间戳
          role:this.$route.query.role,//角色
          bank_list:[],//银行卡列表
          amount:'',//提现数额
          choose_card:[],
          bill:'',
          cardPop_show: false,
          message:'',
          place_holder:'请选择银行卡',
          show_title:false,
          can_confirm:false,
          show_notice:false,
          noticeMsg:'',
        }
      },
      watch:{
        choose_card(){
          this.canConfirm()
        },
        amount(){
          this.canConfirm()
        },
        show_notice(val){
          if(val){
            setTimeout(() => {
              this.show_notice = false
            },2000)
          }
        },
      },
      methods:{
        withdrawalMsg(){
          if(this.choose_card.length===0){
            this.show_notice=true;
            this.noticeMsg='请选择银行卡';
          }else if(!this.amount&&this.amount===0){
            this.show_notice=true;
            this.noticeMsg='您的余额不足提现';
          }
        },
        withdrawalAll(){
          this.amount=this.bill
        },
        withdrawal(){
          let params={
            user_id:this.user_info.id,
            merchants_id:this.user_info.merchants_id,
            bank_card_id:this.choose_card[0],
            withdrawal_money:this.amount,
            withdrawal_identity:this.role==='user'?'1':'2',
            timeStamp:this.timeStamp
          };
          if(this.role==='user'){
            delete params.merchants_id
          }
          request.initiateWithdrawal(params).then(res=>{
            let res_data = res.data;
            this.show_notice=true;
            this.noticeMsg=res_data.message;
            if(res_data.code===200){
              if(this.role==='merchant'){
                this.$router.push({path:'/merchantGoods'})
              }else if(this.role==='user'){
                this.$router.push({path:'options'})
              }
            }
          })
        },
        canConfirm(){
          if(this.choose_card.length>0&&this.amount){
            this.can_confirm=true;
          }else {
            this.can_confirm=false;
          }
        },
        chooseCard(closeType){
          if(closeType){
            // this.show_title=true;
          }
        },
        // 获取商铺余额
        getMerchantsBill(){
          let params={
            merchants_id:this.user_info.merchants_id,
            timeStamp:this.timeStamp
          };
          request.getMerchantsBill(params).then(res=>{
            this.bill=res.data.data
          })
        },
        // 获取用户余额
        getUserBill(){
          let params={
            user_id:this.user_info.id,
            timeStamp:this.timeStamp
          };
          request.getUserBill(params).then(res=>{
            this.bill=res.data.data
          })
        },
        // 获取银行卡列表
        getBankLists(){
          let params={
            user_id:this.user_info.id,
            timeStamp:this.timeStamp,
          };
          request.getBingBankLists(params).then(res=>{
            let card_arr = res.data.data;
            this.message=res.data.message;
            card_arr.map((val,key)=>{
              val.value=val.id;
              val.name=val.belongs_to_bank;
            });
            this.bank_list=card_arr;
          })
        },
        toAddBank(){
          if(this.bank_list.length>0){
          }else if(this.bank_list.length<=0){
            this.$router.push({
              path:'/bankCard',
              query:{last_path:this.$route.path,role:this.role}
            })
          }
        },
        handleInput(e){
          this.amount=e.target.value.replace(/[^\.\d]/g,'');
        },
        //判断是否商户
        judgeUsMer(){
          if(this.role==='merchant'){
            this.getMerchantsBill();
          }else if(this.role==='user'){
            this.getUserBill();
          }
        }
      },
      created(){
        this.judgeUsMer();
        this.getBankLists();
      },
      mounted(){
        this.getUserInfo(this.user_info.id);
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
#withdrawal{
  width: 100%;
  background-color: @bg-b;
  min-height: 100%;
  .content{
    padding: 90px 32px 0;
    .card_wrap{
      margin-top: 20px;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left_wrap{
        display: flex;
        align-items: center;
        .bank_info{
          margin-left: 20px;
          span{
            &:first-child{
              margin-right: 18px;
            }
          }
        }
      }
    }
    .money_wrap{
      margin: 16px 0 40px;
      padding: 20px;
      .title{
        margin-bottom: 30px;
      }
      .input_money{
        display: flex;
        align-items: center;
        padding-bottom: 18px;
        border-bottom: 1px solid @border_c;
        width: 100%;
        #balance_input{
          width: 80%;
          display: block;
          border: none;
        }
      }
      .down_wrap{
        padding-top: 20px;
        .get_all{
          margin-left: 20px;
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
<style lang="less">
  #withdrawal{
    .weui-cell{
      width: 100%;
    }
  }
</style>
