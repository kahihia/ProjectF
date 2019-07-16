<template>
    <div id="options">
      <div class="top_icon">
        <div class="left_bell" @click="toBellList">
          <div class="circle" v-show="has_notice"></div>
          <img src="./images/icon_bell.png"/>
        </div>
      </div>
      <div class="head_content marginB52">
        <div class="head_box marginB46">
          <img class="mixin-img" :src="imgUrl(user_info.head_img)" :onerror="$store.state.remix.errorHeadImg">
        </div>
        <div class="name_block marginB15">
          <span class="user_name t_b marginR11">{{user_info.user_name}}</span>
          <span class="edit_btn" @click="toEditUser">编辑</span>
        </div>
        <div class="info_block">
          <div class="left_info marginR22">
            <div class="sex_img marginR7" v-if="user_info.sex==1"><img class="mixin-img" src="./images/sex_man.png"></div>
            <div class="sex_img marginR7" v-else><img class="mixin-img" src="./images/sex_woman.png"></div>
            <span class="c-e marginR14" v-if="user_info.sex==1">男</span>
            <span class="c-e marginR14" v-else>女</span>
            <span class="c-e">{{user_info.age}}</span>
          </div>
          <div class="right_info">
            <div class="loc_img marginR8"><img class="mixin-img" src="./images/icon_location.png"></div>
            <span class="c-e">成都</span>
          </div>
        </div>
      </div>
      <div class="mid_content">
        <div class="card_box marginB13" @click="toBalance">
          <div class="_right c-e">如何获得更多？</div>
          <div class="left_box">
            <div class="coin_block marginT10 marginR24"><img src="./images/icon_coin.png"></div>
            <div class="word_block"><span class="c-Ba">余额</span><span class="t_c">{{user_info.user_bill}}</span></div>
          </div>
        </div>
        <div class="cards marginB55">
          <div class="cards_item marginR10" @click="toOrderList">
            <div class="img_box marginR25"><img class="mixin-img" src="./images/icon_coupon.png"/></div>
            <span class="t-b-b">历史订单</span>
          </div>
          <div class="cards_item" @click="getShopStatus()">
            <div class="img_box marginR25"><img class="mixin-img" src="./images/icon_shop.png"/></div>
            <span class="t-b-b">我的商铺</span>
          </div>
        </div>
      </div>
      <div class="foot_content">
        <!--<div class="lit_title">-->
          <!--<span class="c-e">其他</span>-->
          <!--<div class="under_box">-->
            <!--<span class="cell_title cell_title">通知</span>-->
            <!--<inline-x-switch class="cell_switch" title="" v-model="notification"></inline-x-switch>-->
          <!--</div>-->
        <!--</div>-->
        <ul class="cell_box">
          <li class="cell_item cell_title" v-for="(item,index) in cell_data" :style="item.color?'color:'+item.color:false" @click="cellOperate(item.id)">{{item.cell_name}}</li>
        </ul>
      </div>
      <div class="audit" v-transfer-dom>
        <alert v-model="alert_show">{{alert_text}}</alert>
      </div>
    </div>
</template>

<script>
  import { InlineXSwitch,Alert,TransferDomDirective as TransferDom} from 'vux';
  import {getLocalData,clearLocalData} from '@/utils/storages';
  import request from '@/utils/request';
  import {formatDateTime} from '@/utils/format';
    export default {
      name: "index",
      components:{InlineXSwitch,Alert},
      directives: {TransferDom},
      data(){
        return{
          defaultImg: 'this.src="' + require('@/assets/images/head_init.png') + '"',//默认图片
          notification:false,//关闭通知
          cell_data:[
            {id:1,cell_name:'我的收藏'},
            // {id:2,cell_name:'我的关注'},
            // {id:3,cell_name:'我的粉丝'},
            {id:4,cell_name:'我的银行卡'},
            {id:5,cell_name:'反馈'},
            {id:6,cell_name:'登出',color:'red'}
          ],
          user_info:getLocalData('user_info'),
          timeStamp:formatDateTime(new Date()),
          shop_status:'',
          alert_show:false,
          alert_text:'',
          has_notice:false,
        }
      },
      methods:{
        toBalance(){//跳转到订单列表
          this.$router.push({
            path:'/balance',
            query:{role:'user'}
          })
        },
        toOrderList(){//跳转到订单列表
          this.$router.push({path:'/orderList'})
        },
        toMyShop(state,audit){//跳转到我的商铺
          if(this.user_info.is_merchants==1){
            if(state==1){
              this.$router.push({path:'/merchantHome'})
            }
          }else {
            if(audit==-1){
              this.$router.push({path:'/setShop'})
            }else if(audit==0){
              this.alert_show=true;
              this.alert_text='正在审核中……';
            }else if(audit==2){
              this.$router.push({path:'/auditFail'})
            }
            if(state==0){
              this.alert_show=true;
              this.alert_text='您的商铺已被删除，有任何疑问请联系客服。';
            }
          }
        },
        toEditUser(){//跳转到编辑用户信息
          this.$router.push({path:'/editUser'})
        },
        toBellList(){//跳转到编辑用户信息
          this.$router.push({path:'/noticeList'})
        },
        cellOperate(id){
          if(id===1){
            this.$router.push({path:'/myCollection'})
          }else if(id===2){
          }else if(id===4){
            this.$router.push({path:'/cardList'})
          }else if(id===5){
            this.$router.push({path:'/feedback'})
          }else if(id===6){
            clearLocalData('user_info');
            this.$router.push('/Login')
          }
        },
        getShopStatus(){//获取商铺申请状态
          let params={user_id:this.user_info.id,timeStamp:this.timeStamp};
          this.getUserInfo(this.user_info.id).then(res=>{
            this.user_info=res;
            request.getMerchantsStatus(params).then(res=>{
              let res_data = res.data.data;
              this.toMyShop(res_data.merchants_state,res_data.merchants_audit)
            })
          });
        },
        judgeNotice(user_id){
          let params={user_id:user_id,timeStamp:this.timeStamp};
          request.judgeUserNotice(params).then(res=>{
            let res_data=res.data.data;
            res_data.length>0?this.has_notice=true:this.has_notice=false
          })
        }
      },
      created(){
        this.getUserInfo(this.user_info.id);
        this.judgeNotice(this.user_info.id);
        this.$store.commit('selectedTab',{tab_index:3});
      }
    }
</script>

<style lang="less" scoped>
  @import '../../assets/less/reset';
  .marginT10{margin-top: 10px;}
  .marginB46{margin-bottom: 46px !important;}
  .marginB52{margin-bottom: 52px}
  .marginB55{margin-bottom: 55px}
  .marginB15{margin-bottom: 15px}
  .marginB13{margin-bottom: 13px !important;}
  .marginR25{margin-right: 25px}
  .marginR24{margin-right: 24px}
  .marginR22{margin-right: 22px}
  .marginR14{margin-right: 14px}
  .marginR11{margin-right: 11px}
  .marginR10{margin-right: 10px}
  .marginR8{margin-right: 8px}
  .marginR7{margin-right: 7px}
  #options{
    background-color: @bg-b;
    min-height: 100%;
    .top_icon{
      padding: 27px 0 0 32px;
      text-align: left;
      .left_bell{
        position: relative;
        width: 38px;
        height: 46px;
      }
    }
    .head_content{
      .head_box{
        width: 178px;
        height: 178px;
        margin: 0 auto;
        .mixin-borderRadius(50%);
        overflow: hidden;
      }
      .name_block{
        display: flex;
        justify-content: center;
        align-items: center;
        .edit_btn{
          float: left;
          width: 46px;
          height: 24px;
          line-height: 24px;
          background-color: @btn_bg;
          color: @W2;
          text-align: center;
          .mixin-borderRadius(6px);
        }
      }
      .info_block{
        display: flex;
        justify-content: center;
        align-items: center;
        .left_info{
          display: flex;
          align-items: center;
          .sex_img{
            width: 25px;
            height: 25px;
          }
        }
        .right_info{
          display: flex;
          align-items: center;
          .loc_img{
            width: 21px;
            height: 29px;
          }
        }
      }
    }
    .mid_content{
      .card_box{
        width: 690px;
        /*height: 174px;*/
        padding: 37px 27px 50px 36px;
        margin: 0 auto;
        background-color: #ffe035;
        box-shadow: 0 0 15px 0
        rgba(0, 1, 1, 0.05);
        border-radius: 12px;
        .left_box{
          display: flex;
          .coin_block{
            width: 70px;
            height: 76px;
          }
          .word_block{
            display: flex;
            flex-direction: column;
            align-content: center;
          }
        }
      }
      .cards{
        display: flex;
        justify-content: center;
        align-items: center;
        .cards_item{
          display: flex;
          align-items: center;
          padding-left: 35px;
          width: 340px;
          height: 128px;
          background-color: #ffffff;
          box-shadow: 0 0 15px 0
          rgba(0, 1, 1, 0.05);
          border-radius: 12px;
          .img_box{
            width: 73px;
            height: 73px;
          }
        }
      }
    }
    .foot_content{
      width: 670px;
      margin: 0 auto;
      .under_box{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0 20px 0;
      }
      .cell_box{
        padding: 0;
        padding-bottom: 91px;
        .cell_item{
          padding: 41px 0 35px 0;
          border-top: solid 3px rgba(107, 127, 158, 0.1);
          &:first-child{
            border-top: none;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  @switch-not-checked-bg-color:#384252;
  @switch-checked-bg-color:#ffe035;
  #options{
    .foot_content{
      .under_box{
        .weui-switch{
          width: 107px;
          height: 58px;
          border-radius: 29px;
          background-color: @switch-not-checked-bg-color;
          &:checked{
            border-color: @switch-checked-bg-color;
            background-color: @switch-checked-bg-color;
            &:before{
              width: 100%;
              height: 100%;
              border-radius: 29px;
            }
            &:after{
              top: 4px;
              width: 49px;
              height: 49px;
              border-radius: 50%;
              border-color: @switch-not-checked-bg-color;
              background-color: @switch-not-checked-bg-color;
              transform: translateX(54px);
              box-shadow: 0 0 15px 0
              rgba(0, 1, 1, 0.05);
            }
          }
          &:before{
            width: 100%;
            height: 100%;
            border-radius: 29px;
            background-color: @switch-not-checked-bg-color;
          }
          &:after{
            top: 4px;
            width: 49px;
            height: 49px;
            border-radius: 50%;
            background-color: @switch-checked-bg-color;
            box-shadow: 0 0 15px 0
            rgba(0, 1, 1, 0.05);
          }
        }
      }
    }
  }
  .audit{
    .weui-dialog{
      border-radius: 12px;
      max-width: 340px;
      .weui-dialog__bd{
        font-size: 24px;
      }
      .weui-dialog__ft{
        font-size: 26px;
        .weui-dialog__btn_primary{
          color: @switch-checked-bg-color;
        }
      }
    }
  }
</style>
