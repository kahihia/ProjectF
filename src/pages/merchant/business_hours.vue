<template>
    <div id="business_hours">
      <head_bar :backLast="true" :tab_c="true"
                :head="head" :bg_color="bg_color">
      </head_bar>
      <div class="content">
        <div class="card time_wrap">
          <div class="add_item">
            <span class="title wordFour c-a">工作日期</span>
            <div class="valid_date">
              <popup-picker class="item_time c-b" :data="weeks" value-text-align="center" v-model="work_week.start_week"></popup-picker>
              <popup-picker class="item_time c-b" :data="weeks" value-text-align="center" v-model="work_week.end_week"></popup-picker>
            </div>
          </div>
          <div class="add_item">
            <span class="title wordFour c-a">工作时间</span>
            <div class="valid_date">
              <datetime class="item_time c-b" format="HH:mm" v-model="work_time.start_time"></datetime>
              <datetime class="item_time c-b" format="HH:mm" v-model="work_time.end_time"></datetime>
            </div>
          </div>
        </div>
        <button class="btn notAll_btn" v-show="!is_confirm">保存</button>
        <button class="btn confirm_btn" v-show="is_confirm" @click="confirmTime">保存</button>
      </div>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar';
  import {formatDateTime} from '@/utils/format';
  import request from '@/utils/request';
  import {getLocalData} from '@/utils/storages';
  import {Datetime,PopupPicker,TransferDomDirective as TransferDom} from 'vux';
    export default {
      name: "business_hours",
      components:{head_bar,Datetime,PopupPicker},
      directives: {TransferDom},
      data(){
        return{
          head:'营业时间',
          bg_color:'#ffe035',
          user_info: getLocalData('user_info'),//用户信息
          timeStamp:formatDateTime(new Date()),//时间戳
          weeks: [['周一', '周二', '周三', '周四', '周五', '周六', '周日']],
          is_confirm:false,//时间戳
          work_week:{
            start_week:['周一'],
            end_week:['周日'],
          },
          work_time:{
            start_time:'每日开始时间',
            end_time:'每日结束时间',
          },
        }
      },
      watch:{
        work_week:{
          handler: function() {
            this.isSelectedAll()
          },
          deep: true
        },
        work_time:{
          handler: function() {
            this.isSelectedAll()
          },
          deep: true
        },
      },
      methods:{
        isSelectedAll(){
          if(this.work_week.start_week!==['每周开始星期']&&this.work_week.end_week!==['每周结束星期']
            &&this.work_time.start_time!=='每日开始时间'&&this.work_time.end_time!=='每日结束时间'){
            this.is_confirm=true;
            request.editMerchants()
          }
        },
        confirmTime(){
          let open_time=this.work_week.start_week+' '+this.work_time.start_time+'-'+
            this.work_week.end_week+' '+this.work_time.end_time;
          let params={
            id:this.user_info.merchants_id,
            merchants_user_id:this.user_info.id,
            merchants_open_time:open_time,
            timeStamp:formatDateTime(new Date())
          };
          request.editMerchants(params).then(res=>{
            if(res.data.code==200){
              this.$router.push({path:'/merchantOpt'})
            }
          })
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
  .card{
    background-color: @bg-c;
    box-shadow: 0 0 15px 0
    rgba(0, 1, 1, 0.05);
    .mixin-borderRadius(10px)
  }
  #business_hours{
    min-height: 100%;
    padding-top: 90px;
    background-color: @bg-b;
    .content{
      margin-top: 20px;
      padding: 0 32px;
      .time_wrap{
        padding: 10px 20px;
        .add_item{
          padding: 30px 0;
          border-bottom: 1px solid @border_c;
          display: flex;
          align-items: center;
          &:last-child{
            border-bottom: none;
          }
          .title{
            margin-right: 130px;
          }
          .wordFour{
            margin-right: 105px;
          }
          .wordFive{
            margin-right: 80px;
          }
          .valid_date{
            .item_time{
              display: inline-block;
              width: 200px;
              text-align: left;
              &:first-child{
                padding-right: 40px;
                margin-right: 40px;
                border-right: 1px solid @border_c;
              }
            }
          }
        }
      }
      .btn{
        display: block;
        margin: 0 auto;
        border: none;
        .mixin-borderRadius(8px);
        box-shadow: 0 0 15px 0
        rgba(0, 1, 1, 0.05);
        margin-top: 400px;
      }
      .notAll_btn{
        .mixin-setButton(500px,60px,@G7,@bg-j,24px,none);
      }
      .confirm_btn{
        .mixin-setButton(500px,60px,@G1,@bg-d,24px,none);
      }
    }
  }
</style>
