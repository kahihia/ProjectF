<template>
    <div id="card_list">
      <head_bar :backLast="true" :tab_c="true" :head="head" :showAdd="true"
                :bg_color="bg_color" @addSth="addCard">
      </head_bar>
      <div class="content">
        <div class="card_wrap">
          <div class="card_item" v-show="bank_list.length!==0" v-for="(item,index) in bank_list"
               :style="'background:url('+bg_card[randomBgIndex]+') 50% 50% no-repeat'">
            <div class="up_wrap">
              <span class="bank_name input_title">{{item.belongs_to_bank}}</span>
              <span class="card_type c-u">储蓄卡</span>
            </div>
            <div class="down_wrap c-m">尾号{{item.bank_card_no.substring(item.bank_card_no.length-4)}}</div>
          </div>
        </div>
        <div class="null_wrap mixin-center" v-show="bank_list.length===0">
          <img src="@/assets/images/common/null_notice.png">
          <p class="c-j marginT">亲，你还没有绑定银行卡哦！</p>
          <p class="c-j">赶快去设置吧！</p>
        </div>
      </div>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar';
  import {getLocalData} from '@/utils/storages';
  import request from '@/utils/request';
  import {formatDateTime} from '@/utils/format';
    export default {
      name: "card_list",
      components:{head_bar},
      data(){
        return{
          head:'我的银行卡',
          bg_color:'#f4f3f0',
          user_info:getLocalData('user_info'),//用户信息
          timeStamp:formatDateTime(new Date()),//时间戳
          bank_list:[],//银行卡列表
          message:[],//提示信息
          bg_card:[require('./images/bg_card1.png'),require('./images/bg_card2.png'),require('./images/bg_card3.png')],
          randomBgIndex:Math.round( Math.random() * 2 ),//随机数
        }
      },
      methods:{
        // 获取银行卡列表
        getBankLists(){
          let params={
            user_id:this.user_info.id,
            timeStamp:formatDateTime(new Date()),
          };
          request.getBingBankLists(params).then(res=>{
            if(res.data.code===200){
              this.bank_list=res.data.data;
            }else {
              this.message=res.data.message;
            }
          })
        },
        addCard(){
          this.$router.push({
            path:'/bankCard',
            query:{last_path:this.$route.path}
          })
        }
      },
      created(){
        this.getBankLists()
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
  #card_list{
    width: 100%;
    background-color: @bg-b;
    min-height: 100%;
    padding-top: 90px;
    .content{
      padding: 20px 75px;
      .card_wrap{
        .card_item{
          width: 100%;
          height: 200px;
          padding: 50px 40px;
          .bank_name{
            margin-right: 20px;
          }
          .down_wrap{
            margin-top: 40px;
          }
        }
      }
      .null_wrap{
        text-align: center;
      }
    }
  }
</style>
